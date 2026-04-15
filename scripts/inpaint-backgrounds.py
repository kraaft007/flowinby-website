#!/usr/bin/env python3
"""
Remove text overlays from FlowinBy website images using Nano Banana (Gemini) inpainting.
Uses the google-genai library with gemini-3-pro-image-preview model.
"""

import os
import sys
from pathlib import Path
from PIL import Image
from google import genai

# API key from banana-illustrator project
API_KEY = "AIzaSyBQs8kd0oVz-pz_37pDXvbJtVJ6xWXH_h4"

# Image descriptions for inpainting prompts
IMAGE_TASKS = {
    "1": {
        "file": "Black and White Minimalist Creative Portfolio Presentation - 1.png",
        "prompt": "Remove all text overlays (404, not found, welcome to my world, About Me, Experience, projects) from this image. Keep only the artistic photo of the crushed Hello Kitty and elephant balloons on the asphalt ground. Fill in the areas where text was with the natural continuation of the ground texture and balloon fragments. Preserve the artistic, whimsical quality of the original photo.",
        "output": "bg-hero.png"
    },
    "2": {
        "file": "Black and White Minimalist Creative Portfolio Presentation - 2.png",
        "prompt": "Remove all text overlays (Greetings, navigation text, contact info, signature, tagline) from this image. Keep only the artistic pink/sepia toned photo strips showing the person in a cowboy hat. Fill in the text areas naturally with the continuation of the photo aesthetic and pink/warm tones. Preserve the dreamy, nostalgic quality of the collage.",
        "output": "bg-about.png"
    },
    "3": {
        "file": "Black and White Minimalist Creative Portfolio Presentation - 3.png",
        "prompt": "Remove all text overlays (Experience, OCAD University, navigation, all lorem ipsum text) from this image. Keep only the artistic photo of the colorful BT21 plush toys (Cooky, Mang, etc) on the dark textured ground. Fill in the text areas with the natural continuation of the dark ground texture. Preserve the playful, kawaii aesthetic of the plushies.",
        "output": "bg-experience.png"
    }
}

def inpaint_image(client, input_path, prompt, output_path):
    """Use Gemini to inpaint/edit an image based on prompt."""
    print(f"\nProcessing: {input_path.name}")
    print(f"  Prompt: {prompt[:80]}...")

    # Load image
    img = Image.open(input_path)

    # Generate edited image
    response = client.models.generate_content(
        model="gemini-3-pro-image-preview",
        contents=[prompt, img],
        config={
            "response_modalities": ["IMAGE"],
        }
    )

    # Extract and save the image
    for part in response.parts:
        if part.inline_data:
            result_img = part.as_image()
            result_img.save(output_path)
            print(f"  Saved: {output_path}")
            return True

    print(f"  ERROR: No image returned")
    return False

def main():
    project_dir = Path(__file__).parent.parent
    images_dir = project_dir / "images"
    images_dir.mkdir(exist_ok=True)

    # Initialize Gemini client
    client = genai.Client(api_key=API_KEY)

    print("FlowinBy Background Inpainting")
    print("=" * 40)

    # Process specific image or all
    if len(sys.argv) > 1:
        tasks = {sys.argv[1]: IMAGE_TASKS[sys.argv[1]]}
    else:
        tasks = IMAGE_TASKS

    for key, task in tasks.items():
        input_path = project_dir / task["file"]
        output_path = images_dir / task["output"]

        if not input_path.exists():
            print(f"  SKIP: {task['file']} not found")
            continue

        success = inpaint_image(client, input_path, task["prompt"], output_path)
        if success:
            print(f"  ✓ Created {task['output']}")
        else:
            print(f"  ✗ Failed to process {task['file']}")

    print("\nDone! Check the 'images/' directory for results.")

if __name__ == "__main__":
    main()
