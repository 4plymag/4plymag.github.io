import requests
from bs4 import BeautifulSoup
import numpy as np
from PIL import Image
import io
import json
from sklearn.preprocessing import normalize
import umap
from tqdm import tqdm

# For content embeddings, we'll use CLIP
# Install: pip install torch torchvision transformers pillow numpy scikit-learn umap-learn beautifulsoup4 requests tqdm
import torch
from transformers import CLIPProcessor, CLIPModel

def get_image_urls(github_url):
    """Fetch image URLs using GitHub API"""
    # Use GitHub API for reliable file listing
    api_url = "https://api.github.com/repos/jwilber/4PLY/contents/thrashercovers/covers"
    response = requests.get(api_url)

    if response.status_code != 200:
        raise Exception(f"GitHub API error: {response.status_code}")

    files = response.json()
    base_raw_url = "https://raw.githubusercontent.com/jwilber/4PLY/master/thrashercovers/covers/"
    image_files = []

    for file_info in files:
        if file_info['name'].endswith('.jpg'):
            image_files.append({
                'filename': file_info['name'],
                'url': base_raw_url + file_info['name']
            })

    return image_files

def download_image(url):
    """Download and return PIL Image"""
    response = requests.get(url)
    return Image.open(io.BytesIO(response.content)).convert('RGB')

def get_content_embedding(image, model, processor, device):
    """Generate CLIP embedding for image content"""
    inputs = processor(images=image, return_tensors="pt").to(device)
    with torch.no_grad():
        image_features = model.get_image_features(**inputs)
    return image_features.cpu().numpy().flatten()

def get_color_embedding(image, n_colors=10):
    """Generate color-based embedding using dominant colors and distribution"""
    # Resize for faster processing
    img = image.resize((100, 100))
    pixels = np.array(img).reshape(-1, 3)
    
    # Create color histogram in HSV space (more perceptually uniform)
    img_hsv = image.convert('HSV')
    pixels_hsv = np.array(img_hsv).reshape(-1, 3)
    
    # Create histogram features
    h_hist, _ = np.histogram(pixels_hsv[:, 0], bins=12, range=(0, 256))
    s_hist, _ = np.histogram(pixels_hsv[:, 1], bins=8, range=(0, 256))
    v_hist, _ = np.histogram(pixels_hsv[:, 2], bins=8, range=(0, 256))
    
    # Combine into feature vector
    color_features = np.concatenate([h_hist, s_hist, v_hist])
    
    # Add RGB statistics
    rgb_mean = pixels.mean(axis=0)
    rgb_std = pixels.std(axis=0)
    
    # Combine all features
    embedding = np.concatenate([color_features, rgb_mean, rgb_std])
    
    return embedding / (np.linalg.norm(embedding) + 1e-8)

def main():
    print("Loading CLIP model...")
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
    processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
    
    print("Fetching image URLs from GitHub...")
    github_url = "https://github.com/jwilber/4PLY/tree/master/thrashercovers/covers"
    image_files = get_image_urls(github_url)
    print(f"Found {len(image_files)} images")
    
    # Collect embeddings
    content_embeddings = []
    color_embeddings = []
    filenames = []
    
    print("Processing images...")
    for img_info in tqdm(image_files):
        try:
            image = download_image(img_info['url'])
            
            # Get embeddings
            content_emb = get_content_embedding(image, model, processor, device)
            color_emb = get_color_embedding(image)
            
            content_embeddings.append(content_emb)
            color_embeddings.append(color_emb)
            filenames.append(img_info['filename'])
            
        except Exception as e:
            print(f"Error processing {img_info['filename']}: {e}")
    
    # Convert to numpy arrays
    content_embeddings = np.array(content_embeddings)
    color_embeddings = np.array(color_embeddings)
    
    print(f"\nProcessed {len(filenames)} images successfully")
    print(f"Content embedding shape: {content_embeddings.shape}")
    print(f"Color embedding shape: {color_embeddings.shape}")
    
    # Run UMAP for content - tuned for better clustering
    print("\nRunning UMAP on content embeddings...")
    umap_content = umap.UMAP(
        n_neighbors=10,        # Smaller = more local structure, tighter clusters
        min_dist=0.02,         # Smaller = tighter clusters, more separation
        spread=1.5,            # Larger = more space between clusters
        metric='cosine',
        n_epochs=500,          # More iterations for better convergence
        random_state=42
    )
    content_coords = umap_content.fit_transform(content_embeddings)

    # Run UMAP for color - tuned for better clustering
    print("Running UMAP on color embeddings...")
    umap_color = umap.UMAP(
        n_neighbors=12,        # Slightly more neighbors for color similarity
        min_dist=0.02,         # Tight clusters
        spread=1.5,            # Good separation
        metric='euclidean',
        n_epochs=500,
        random_state=42
    )
    color_coords = umap_color.fit_transform(color_embeddings)
    
    # Normalize coordinates to [0, 1] range
    content_coords = (content_coords - content_coords.min(axis=0)) / (content_coords.max(axis=0) - content_coords.min(axis=0))
    color_coords = (color_coords - color_coords.min(axis=0)) / (color_coords.max(axis=0) - color_coords.min(axis=0))
    
    # Prepare output data
    output_data = []
    for i, filename in enumerate(filenames):
        output_data.append({
            'filename': filename,
            'url': f'https://raw.githubusercontent.com/jwilber/4PLY/master/thrashercovers/covers/{filename}',
            'umap_x': float(content_coords[i, 0]),
            'umap_y': float(content_coords[i, 1]),
            'color_x': float(color_coords[i, 0]),
            'color_y': float(color_coords[i, 1])
        })
    
    # Save to JSON
    output_file = 'thrasher_coordinates.json'
    with open(output_file, 'w') as f:
        json.dump(output_data, f, indent=2)
    
    print(f"\n✓ Saved coordinates to {output_file}")
    print(f"  Total images: {len(output_data)}")
    print(f"\nSample output:")
    print(json.dumps(output_data[0], indent=2))

if __name__ == "__main__":
    main()
