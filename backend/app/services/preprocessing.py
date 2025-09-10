from PIL import Image
import numpy as np

def preprocess_image(image, target_size=(150, 150)):
    """
    Resizes, converts to RGB (if needed), and normalizes an image.
    """
    # Ensure image is in RGB format
    if image.mode != "RGB":
        image = image.convert("RGB")
        
    # Resize the image
    image = image.resize(target_size)
    
    # Convert image to a numpy array
    image_array = np.asarray(image)
    
    # Normalize pixel values to be between 0 and 1
    image_array = image_array / 255.0
    
    return image_array