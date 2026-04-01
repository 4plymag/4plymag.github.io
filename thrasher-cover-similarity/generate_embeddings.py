"""
Generate embeddings for Thrasher covers.

Content embeddings: DINOv2 (pure vision, no text bias) on cropped images (masthead removed)
Color embeddings: HSV histogram + RGB stats

Usage:
    pip install torch torchvision transformers pillow numpy scikit-learn umap-learn requests tqdm
    python generate_embeddings.py

    # To only re-embed new covers (skips existing):
    python generate_embeddings.py --incremental
"""

import argparse
import requests
import numpy as np
from PIL import Image
import io
import json
from pathlib import Path
from sklearn.preprocessing import normalize
import umap
from tqdm import tqdm

import torch
from transformers import AutoImageProcessor, AutoModel

COVERS_DIR = Path("../thrashercovers/covers")
DATA_FILE = Path("thrasher_data.json")
COORDS_FILE = Path("thrasher_coordinates.json")
CACHE_DIR = Path("_embedding_cache")


def get_local_images():
    """Get all cover images from local directory."""
    image_files = []
    for f in sorted(COVERS_DIR.glob("*.jpg")):
        image_files.append({
            "filename": f.name,
            "url": f"/thrashercovers/covers/{f.name}",
            "path": f,
        })
    return image_files


def load_image(path):
    """Load a PIL Image from local path."""
    return Image.open(path).convert("RGB")


def crop_masthead(image, crop_fraction=0.18):
    """
    Crop the top portion of the image to remove the THRASHER masthead.
    Default removes top 18% — enough to cut the logo without losing the action.
    """
    w, h = image.size
    top = int(h * crop_fraction)
    return image.crop((0, top, w, h))


def get_content_embedding_dino(image, model, processor, device):
    """
    Generate content embedding using DINOv2.

    DINOv2 is a pure vision model — no text encoder, no text training.
    It understands visual structure, objects, poses, and composition
    without being biased by text in the image.
    """
    inputs = processor(images=image, return_tensors="pt").to(device)
    with torch.no_grad():
        outputs = model(**inputs)
        # Use the CLS token as the image-level embedding
        embedding = outputs.last_hidden_state[:, 0, :]
    return embedding.cpu().numpy().flatten()


def get_color_embedding(image, n_bins_h=16, n_bins_s=8, n_bins_v=8):
    """
    Generate color-based embedding using HSV histogram + RGB stats.

    HSV is more perceptually uniform than RGB for color similarity.
    We also add RGB channel means/stds for additional signal.
    """
    img = image.resize((128, 128))
    pixels_rgb = np.array(img).reshape(-1, 3)

    img_hsv = image.resize((128, 128)).convert("HSV")
    pixels_hsv = np.array(img_hsv).reshape(-1, 3)

    # HSV histograms
    h_hist, _ = np.histogram(pixels_hsv[:, 0], bins=n_bins_h, range=(0, 256))
    s_hist, _ = np.histogram(pixels_hsv[:, 1], bins=n_bins_s, range=(0, 256))
    v_hist, _ = np.histogram(pixels_hsv[:, 2], bins=n_bins_v, range=(0, 256))

    # Normalize histograms
    h_hist = h_hist.astype(float) / (h_hist.sum() + 1e-8)
    s_hist = s_hist.astype(float) / (s_hist.sum() + 1e-8)
    v_hist = v_hist.astype(float) / (v_hist.sum() + 1e-8)

    # RGB statistics
    rgb_mean = pixels_rgb.mean(axis=0) / 255.0
    rgb_std = pixels_rgb.std(axis=0) / 255.0

    # Spatial color info: average color of each quadrant
    h, w = 128, 128
    quadrants = [
        pixels_rgb[: h * w // 4],  # rough top-left quarter of flattened
        pixels_rgb[h * w // 4 : h * w // 2],
        pixels_rgb[h * w // 2 : 3 * h * w // 4],
        pixels_rgb[3 * h * w // 4 :],
    ]
    quad_means = np.concatenate([q.mean(axis=0) / 255.0 for q in quadrants])

    embedding = np.concatenate([h_hist, s_hist, v_hist, rgb_mean, rgb_std, quad_means])

    # L2 normalize
    return embedding / (np.linalg.norm(embedding) + 1e-8)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--incremental",
        action="store_true",
        help="Only process images not already in the cache",
    )
    parser.add_argument(
        "--model",
        default="facebook/dinov2-base",
        help="HuggingFace model ID (default: facebook/dinov2-base)",
    )
    parser.add_argument(
        "--crop",
        type=float,
        default=0.18,
        help="Fraction of top to crop for masthead removal (default: 0.18)",
    )
    parser.add_argument(
        "--umap-neighbors-content",
        type=int,
        default=30,
        help="UMAP n_neighbors for content (default: 30)",
    )
    parser.add_argument(
        "--umap-min-dist-content",
        type=float,
        default=0.03,
        help="UMAP min_dist for content (default: 0.03)",
    )
    parser.add_argument(
        "--umap-neighbors-color",
        type=int,
        default=25,
        help="UMAP n_neighbors for color (default: 25)",
    )
    parser.add_argument(
        "--umap-min-dist-color",
        type=float,
        default=0.05,
        help="UMAP min_dist for color (default: 0.05)",
    )
    args = parser.parse_args()

    # Setup cache
    CACHE_DIR.mkdir(exist_ok=True)

    print(f"Loading model: {args.model}")
    device = "mps" if torch.backends.mps.is_available() else "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Device: {device}")

    processor = AutoImageProcessor.from_pretrained(args.model)
    model = AutoModel.from_pretrained(args.model).to(device)
    model.eval()

    print("Scanning local covers...")
    image_files = get_local_images()
    print(f"Found {len(image_files)} images")

    # Load cached embeddings if incremental
    cached_content = {}
    cached_color = {}
    if args.incremental:
        for npy in CACHE_DIR.glob("content_*.npy"):
            fname = npy.stem.replace("content_", "") + ".jpg"
            cached_content[fname] = np.load(npy)
        for npy in CACHE_DIR.glob("color_*.npy"):
            fname = npy.stem.replace("color_", "") + ".jpg"
            cached_color[fname] = np.load(npy)
        print(f"Cached: {len(cached_content)} content, {len(cached_color)} color")

    content_embeddings = []
    color_embeddings = []
    filenames = []

    print(f"Processing images (crop top {args.crop:.0%})...")
    for img_info in tqdm(image_files):
        fname = img_info["filename"]

        # Check cache
        if args.incremental and fname in cached_content and fname in cached_color:
            content_embeddings.append(cached_content[fname])
            color_embeddings.append(cached_color[fname])
            filenames.append(fname)
            continue

        try:
            image = load_image(img_info["path"])

            # Crop masthead for content embedding
            cropped = crop_masthead(image, args.crop)
            content_emb = get_content_embedding_dino(cropped, model, processor, device)

            # Full image for color embedding (color of the whole cover matters)
            color_emb = get_color_embedding(image)

            # Cache
            stem = fname.replace(".jpg", "")
            np.save(CACHE_DIR / f"content_{stem}.npy", content_emb)
            np.save(CACHE_DIR / f"color_{stem}.npy", color_emb)

            content_embeddings.append(content_emb)
            color_embeddings.append(color_emb)
            filenames.append(fname)

        except Exception as e:
            print(f"\nError processing {fname}: {e}")

    content_embeddings = np.array(content_embeddings)
    color_embeddings = np.array(color_embeddings)

    print(f"\nProcessed {len(filenames)} images")
    print(f"Content embedding shape: {content_embeddings.shape}")
    print(f"Color embedding shape: {color_embeddings.shape}")

    # L2 normalize content embeddings (important for cosine metric)
    content_embeddings = normalize(content_embeddings)

    # ── UMAP: Content ──
    print(f"\nRunning UMAP on content embeddings "
          f"(n_neighbors={args.umap_neighbors_content}, min_dist={args.umap_min_dist_content})...")
    umap_content = umap.UMAP(
        n_neighbors=args.umap_neighbors_content,
        min_dist=args.umap_min_dist_content,
        spread=1.5,
        metric="cosine",
        n_epochs=500,
        random_state=42,
    )
    content_coords = umap_content.fit_transform(content_embeddings)

    # ── UMAP: Color ──
    print(f"Running UMAP on color embeddings "
          f"(n_neighbors={args.umap_neighbors_color}, min_dist={args.umap_min_dist_color})...")
    umap_color = umap.UMAP(
        n_neighbors=args.umap_neighbors_color,
        min_dist=args.umap_min_dist_color,
        spread=1.5,
        metric="euclidean",
        n_epochs=500,
        random_state=42,
    )
    color_coords = umap_color.fit_transform(color_embeddings)

    # Normalize to [0, 1]
    for coords in [content_coords, color_coords]:
        mins = coords.min(axis=0)
        maxs = coords.max(axis=0)
        coords[:] = (coords - mins) / (maxs - mins + 1e-8)

    # Build output
    output_data = []
    for i, filename in enumerate(filenames):
        output_data.append({
            "filename": filename,
            "url": f"/thrashercovers/covers/{filename}",
            "umap_x": float(content_coords[i, 0]),
            "umap_y": float(content_coords[i, 1]),
            "color_x": float(color_coords[i, 0]),
            "color_y": float(color_coords[i, 1]),
        })

    with open(COORDS_FILE, "w") as f:
        json.dump(output_data, f, indent=2)

    print(f"\nSaved {len(output_data)} covers to {COORDS_FILE}")
    print(f"Next step: python merge_metadata.py")


if __name__ == "__main__":
    main()
