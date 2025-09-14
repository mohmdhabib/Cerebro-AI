# backend/app/routes.py

import traceback
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, Request, Response, Body, Form
from typing import Optional
from .auth import get_current_user
from .services import ml_service, supabase_service

bp = APIRouter(prefix="/api")

@bp.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    user = Depends(get_current_user),
    request: Request = None
):
    """
    Handles the initial patient upload. Only saves the AI prediction.
    """
    try:
        user_id = user.id
        
        # 1. Get prediction from the model
        prediction_result = await ml_service.predict(file)

        if not prediction_result.get("success"):
            error_message = prediction_result.get("error", "Unknown prediction error")
            raise HTTPException(status_code=500, detail=error_message)

        prediction = prediction_result.get("predicted_class")
        gradcam_b64 = prediction_result.get("gradcam")

        # 2. Upload original image to storage
        image_url = await supabase_service.upload_image_to_storage(file, user_id, request)

        # 3. Upload Grad-CAM image to storage
        gradcam_url = None
        if gradcam_b64:
            gradcam_url = await supabase_service.upload_gradcam_image(gradcam_b64, user_id, request)

        # 4. Prepare report data
        report_data = {
            "patient_id": user_id,
            "image_url": image_url,
            "prediction": prediction,
            "gradcam_image_url": gradcam_url,
            "status": "Pending Review"
        }

        # 5. Save the complete report to the database
        saved_report = await supabase_service.save_report_to_db(report_data, request)

        return saved_report

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"An error occurred during upload and processing: {str(e)}")

@bp.post("/reports/{report_id}/analysis")
async def create_analysis(
    report_id: int,
    analysis_data: dict = Body(...),
    user = Depends(get_current_user),
    request: Request = None
):
    try:
        user_profile = await supabase_service.get_user_profile(user.id, request)
        if user_profile.get('role') != 'Doctor':
            raise HTTPException(status_code=403, detail="Only doctors can submit analysis.")

        analysis_data['doctor_id'] = user.id
        analysis_data['report_id'] = report_id
        
        saved_analysis = await supabase_service.save_doctor_analysis(analysis_data, request)
        await supabase_service.update_report_status(report_id, "Completed", request)
        
        return saved_analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save analysis: {str(e)}")

@bp.get("/reports/{report_id}/analysis")
async def get_analysis(report_id: int, user = Depends(get_current_user), request: Request = None):
    """Get doctor analysis for a specific report."""
    try:
        analysis = await supabase_service.get_doctor_analysis_by_report_id(report_id, request)
        if not analysis:
            raise HTTPException(status_code=404, detail="Analysis not found for this report")
        return analysis
    except HTTPException as e:
        raise e
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to retrieve analysis: {str(e)}")

@bp.get("/reports")
async def get_reports(user = Depends(get_current_user), request: Request = None):
    user_id = user.id
    user_profile = await supabase_service.get_user_profile(user_id, request)
    reports = await supabase_service.get_reports_from_db(user_id, user_profile['role'], request)
    return reports

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