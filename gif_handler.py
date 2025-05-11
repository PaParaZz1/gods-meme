#!/usr/bin/env python3
from PIL import Image
import os

def extract_last_frame(gif_path, output_path):
    """
    Extract the last frame from a GIF and save it as a PNG.
    
    Args:
        gif_path (str): Path to the input GIF file
        output_path (str): Path where the last frame will be saved as PNG
    """
    try:
        # Open the GIF file
        with Image.open(gif_path) as img:
            # Get the number of frames
            frames = 0
            try:
                while True:
                    # Go to the next frame
                    img.seek(frames)
                    frames += 1
            except EOFError:
                # End of sequence
                frames -= 1
                
            print(f"Total frames in GIF: {frames + 1}")
            
            # Go to the last frame
            img.seek(frames)
            
            # Convert to RGB if needed (in case of palette mode)
            if img.mode == 'P':
                last_frame = img.convert('RGBA')
            else:
                last_frame = img.copy()
            
            # Save the last frame as PNG
            last_frame.save(output_path, 'PNG')
            print(f"Last frame saved as: {output_path}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Define paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Assuming the GIF is in the public folder
    gif_path = os.path.join(script_dir, 'public', 'landing_cat.gif')
    output_path = os.path.join(script_dir, 'public', 'landing_cat_static.png')
    
    # Extract and save the last frame
    extract_last_frame(gif_path, output_path)
    print("Done!")
