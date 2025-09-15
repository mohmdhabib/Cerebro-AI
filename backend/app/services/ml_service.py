# backend/app/services/ml_service.py
import httpx
import base64

# --- GCP Endpoint Configuration ---
# TODO: Replace with your actual GCP endpoint URL
GCP_ENDPOINT_URL = "https://mohammedhabib-btd.hf.space/predict/"  # Example placeholder

# --- Main Prediction Function ---
async def predict(image_file):
    """
    Sends an image to the GCP endpoint for prediction and returns the result.
    """
    if not GCP_ENDPOINT_URL or GCP_ENDPOINT_URL == "YOUR_GCP_ENDPOINT_URL_HERE":
        print("CRITICAL ERROR: GCP_ENDPOINT_URL is not set.")
        return {
            "success": False,
            "error": "Model endpoint is not configured."
        }

    contents = await image_file.read()

    # Prepare the file for multipart upload
    files = {"file": (image_file.filename, contents, image_file.content_type)}

    async with httpx.AsyncClient() as client:
        try:
            # Send request to the GCP endpoint as multipart/form-data
            response = await client.post(
                GCP_ENDPOINT_URL,
                files=files,
                timeout=30.0
            )
            response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)
            
            # Assuming the GCP endpoint returns a JSON response like:
            # {
            #   "success": true,
            #   "predicted_class": "No Tumor",
            #   "gradcam": "iVBORw0KGgo..."
            # }
            return response.json()

        except httpx.RequestError as e:
            print(f"ERROR: Could not reach the GCP endpoint. Details: {e}")
            return {
                "success": False,
                "error": f"Failed to connect to the prediction service: {e}"
            }
        except Exception as e:
            print(f"CRITICAL ERROR: An unexpected error occurred during prediction. Details: {e}")
            return {
                "success": False,
                "error": f"An unexpected error occurred: {e}"
            }