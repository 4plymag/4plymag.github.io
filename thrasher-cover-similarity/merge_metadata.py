import csv
import json
import re

def normalize_month(month):
    """Normalize month name for matching"""
    if not month:
        return ''
    return month.lower().strip()

def normalize_filename(filename):
    """Extract month and year from filename"""
    # Handle formats like "January2020.jpg", "january2020.jpg", "MayJune1982.jpg"
    match = re.match(r'([a-zA-Z]+)(\d{4})', filename.replace('.jpg', ''))
    if match:
        month = match.group(1).lower()
        year = match.group(2)
        return month, year
    return None, None

def main():
    # Load existing coordinates
    with open('thrasher_coordinates.json', 'r') as f:
        covers = json.load(f)

    # Load CSV metadata
    metadata = {}
    with open('4ply_covers.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            month = normalize_month(row['month'])
            year = row['year'].strip()
            key = f"{month}{year}"
            metadata[key] = {
                'issue': row['issueno'],
                'skater': row['skater'].strip() if row['skater'] else '',
                'trick': row['trick'].strip() if row['trick'] else '',
                'obstacle': row['obstacle'].strip() if row['obstacle'] else '',
                'spot': row['spot'].strip() if row['spot'] else '',
                'location': row['location'].strip() if row['location'] else '',
                'special': row['special'].strip() if row['special'] else '',
                'soty': row['soty'].strip() if row['soty'] else ''
            }

    # Merge metadata into covers
    matched = 0
    unmatched = []

    for cover in covers:
        month, year = normalize_filename(cover['filename'])
        if month and year:
            key = f"{month}{year}"
            if key in metadata:
                cover.update(metadata[key])
                matched += 1
            else:
                # Try variations
                found = False
                for meta_key in metadata:
                    if year in meta_key and month[:3] in meta_key:
                        cover.update(metadata[meta_key])
                        matched += 1
                        found = True
                        break
                if not found:
                    unmatched.append(cover['filename'])
                    # Set empty defaults
                    cover.update({
                        'issue': '',
                        'skater': '',
                        'trick': '',
                        'obstacle': '',
                        'spot': '',
                        'location': '',
                        'special': '',
                        'soty': ''
                    })

    print(f"Matched: {matched}/{len(covers)}")
    if unmatched[:10]:
        print(f"Sample unmatched: {unmatched[:10]}")

    # Collect unique values for filters
    skaters = set()
    tricks = set()
    obstacles = set()
    locations = set()

    for cover in covers:
        if cover.get('skater'):
            # Split multiple skaters
            for s in re.split(r'[,&]', cover['skater']):
                s = s.strip()
                if s and s != '-':
                    skaters.add(s)
        if cover.get('trick'):
            for t in re.split(r'[,&]', cover['trick']):
                t = t.strip()
                if t and t != '-':
                    tricks.add(t)
        if cover.get('obstacle'):
            o = cover['obstacle'].strip()
            if o and o != '-':
                obstacles.add(o)
        if cover.get('location'):
            l = cover['location'].strip()
            if l and l != '-':
                locations.add(l)

    # Create output with filter options
    output = {
        'covers': covers,
        'filters': {
            'skaters': sorted(list(skaters)),
            'tricks': sorted(list(tricks)),
            'obstacles': sorted(list(obstacles)),
            'locations': sorted(list(locations))
        }
    }

    # Save merged data
    with open('thrasher_data.json', 'w') as f:
        json.dump(output, f, indent=2)

    print(f"\nSaved to thrasher_data.json")
    print(f"Unique skaters: {len(skaters)}")
    print(f"Unique tricks: {len(tricks)}")
    print(f"Unique obstacles: {len(obstacles)}")
    print(f"Unique locations: {len(locations)}")

    # Sample output
    print("\nSample cover with metadata:")
    for cover in covers:
        if cover.get('skater') and cover.get('trick'):
            print(json.dumps(cover, indent=2))
            break

if __name__ == "__main__":
    main()
