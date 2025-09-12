import traceback
from fastapi import APIRouter, Depends, File, Form, UploadFile, HTTPException, Request, Response
from fastapi.responses import JSONResponse
from typing import Optional
from .auth import get_current_user
from .services import ml_service, supabase_service

bp = APIRouter(prefix="/api")

@bp.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    location: Optional[str] = Form(None),
    size_length_cm: Optional[float] = Form(None),
    size_width_cm: Optional[float] = Form(None),
    edema_present: Optional[bool] = Form(False),
    contrast_pattern: Optional[str] = Form(None),
    tumor_grade: Optional[str] = Form(None),
    recommendation: Optional[str] = Form(None),
    patient_age: Optional[int] = Form(None),
    patient_gender: Optional[str] = Form(None),
    user = Depends(get_current_user),
    request: Request = None
):
    try:
        user_id = user.id
        
        # 1. Get prediction from the model
        prediction, confidence = ml_service.predict(file)
        
        # 2. Upload image to storage
        image_url = await supabase_service.upload_image_to_storage(file, user_id, request)

        # 3. Prepare report data
        report_data = {
            "patient_id": user_id,
            "image_url": image_url,
            "prediction": prediction,
            "confidence": float(confidence),
            "location": location,
            "size_length_cm": size_length_cm,
            "size_width_cm": size_width_cm,
            "edema_present": edema_present,
            "contrast_pattern": contrast_pattern,
            "tumor_grade": tumor_grade,
            "recommendation": recommendation,
            "patient_age": patient_age,
            "patient_gender": patient_gender,
        }

        # 4. Save the complete report to the database
        saved_report = await supabase_service.save_report_to_db(report_data, request)

        return saved_report

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"An error occurred during upload and processing: {str(e)}")


@bp.get("/reports")
async def get_reports(user = Depends(get_current_user), request: Request = None):
    try:
        user_id = user.id
        user_profile = await supabase_service.get_user_profile(user_id, request)
        
        reports = await supabase_service.get_reports_from_db(user_id, user_profile['role'], request)
        return reports

    except Exception as e:
        print(f"Error in get_reports route: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to fetch reports: {str(e)}")

@bp.get("/image-proxy/{file_path:path}")
async def image_proxy(file_path: str, user = Depends(get_current_user), request: Request = None):
    """
    Securely fetches an image from Supabase storage on behalf of the user.
    This avoids CORS issues in the browser for PDF generation.
    """
    try:
        # Download the image bytes from Supabase Storage
        image_bytes = request.app.state.supabase.storage.from_("scan_images").download(file_path)
        
        # Determine mimetype (e.g., 'image/jpeg')
        mimetype = 'image/jpeg' if file_path.lower().endswith(('.jpg', '.jpeg')) else 'image/png'
        
        # Return the image bytes as a response
        return Response(content=image_bytes, media_type=mimetype)
    except Exception as e:
        # Print the detailed exception to the console
        print(f"--- Image Proxy Error --- \nFile Path: {file_path}\nError: {e}\n-------------------------")
        raise HTTPException(status_code=404, detail="Image not found")
