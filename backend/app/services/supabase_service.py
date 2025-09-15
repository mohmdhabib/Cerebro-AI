# backend/app/services/supabase_service.py

import uuid
import traceback
import base64
from fastapi import Request

async def upload_image_to_storage(file, user_id, request: Request):
    """Uploads a file to Supabase storage and returns the full public URL."""
    try:
        supabase = request.app.state.supabase
        file_extension = file.filename.split('.')[-1]
        unique_filename = f"{user_id}/{uuid.uuid4()}.{file_extension}"
        
        # Read file content
        file_content = await file.read()
        
        # Upload the file
        supabase.storage.from_("scan_images").upload(unique_filename, file_content)
        
        # Reset file position for potential future reads
        await file.seek(0)
        
        # Get the public URL which should be a full URL
        res = supabase.storage.from_("scan_images").get_public_url(unique_filename)
        return res
    except Exception as e:
        print(f"ERROR in upload_image_to_storage: {str(e)}")
        traceback.print_exc()
        raise e

async def save_report_to_db(report_data, request: Request):
    """Saves report metadata to the 'reports' table."""
    try:
        supabase = request.app.state.supabase
        data, count = supabase.table('reports').insert(report_data).execute()
        return data[1][0] if data[1] else None
    except Exception as e:
        print(f"ERROR in save_report_to_db: {str(e)}")
        traceback.print_exc()
        raise e

async def save_doctor_analysis(analysis_data: dict, request: Request):
    """Saves the doctor's analysis to the 'doctor_analysis' table."""
    try:
        supabase = request.app.state.supabase
        
        # Convert empty strings to None for numeric fields
        numeric_fields = ['size_length_cm', 'size_width_cm', 'patient_age']
        for field in numeric_fields:
            if field in analysis_data and analysis_data[field] == '':
                analysis_data[field] = None
        
        response = supabase.table('doctor_analysis').insert(analysis_data).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        print(f"ERROR in save_doctor_analysis: {str(e)}")
        traceback.print_exc()
        raise e

async def get_doctor_analysis_by_report_id(report_id: int, request: Request):
    """Fetches doctor analysis for a specific report ID."""
    try:
        supabase = request.app.state.supabase
        response = supabase.table('doctor_analysis').select('*').eq('report_id', report_id).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        print(f"ERROR in get_doctor_analysis_by_report_id: {str(e)}")
        traceback.print_exc()
        return None

async def update_report_status(report_id: int, status: str, request: Request):
    """Updates the status of a report in the 'reports' table."""
    try:
        supabase = request.app.state.supabase
        response = supabase.table('reports').update({"status": status}).eq('id', report_id).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        print(f"ERROR in update_report_status: {str(e)}")
        traceback.print_exc()
        raise e

async def get_user_profile(user_id, request: Request):
    """Fetches a user's profile. Handles cases where a profile may not exist."""
    try:
        supabase = request.app.state.supabase
        response = supabase.table('profiles').select('*').eq('id', user_id).execute()
        
        # Check if any data was returned
        if response.data:
            return response.data[0]  # Return the first profile found
        else:
            # Return a default profile if none exists to prevent crashes
            return {"id": user_id, "role": "Patient", "full_name": "Unknown User"}
    except Exception as e:
        print(f"ERROR in get_user_profile: {str(e)}")
        traceback.print_exc()
        # Return a default profile in case of an error
        return {"id": user_id, "role": "Patient", "full_name": "Unknown User"}

async def get_reports_from_db(user_id, role, request: Request):
    try:
        supabase = request.app.state.supabase
        # This query now joins with both profiles and the new doctor_analysis table
        query = supabase.table('reports').select('*, profiles:patient_id (full_name), doctor_analysis(*)').order('created_at', desc=True)
        if role == 'Patient':
            query = query.eq('patient_id', user_id)
        response = query.execute()
        return response.data if response.data else []
    except Exception as e:
        traceback.print_exc()
        raise e

async def upload_gradcam_image(gradcam_b64: str, user_id: str, request: Request):
    """Uploads a base64 encoded Grad-CAM image to Supabase storage."""
    try:
        supabase = request.app.state.supabase
        
        # Clean the base64 string if it contains metadata prefix
        if ',' in gradcam_b64:
            # Remove prefix like 'data:image/png;base64,'
            gradcam_b64 = gradcam_b64.split(',', 1)[1]
        
        # Remove any whitespace, newlines or other non-base64 characters
        gradcam_b64 = gradcam_b64.strip().replace('\n', '').replace('\r', '')
        
        # Add padding if needed
        padding = len(gradcam_b64) % 4
        if padding:
            gradcam_b64 += '=' * (4 - padding)
        
        # Decode the base64 string
        try:
            image_data = base64.b64decode(gradcam_b64)
        except Exception as decode_error:
            print(f"Base64 decoding error: {str(decode_error)}")
            # Try with URL-safe base64 decoding as fallback
            image_data = base64.urlsafe_b64decode(gradcam_b64)
        
        # Create a unique filename
        unique_filename = f"{user_id}/gradcam_{uuid.uuid4()}.png"
        
        # Upload the image bytes
        supabase.storage.from_("scan_images").upload(
            unique_filename,
            image_data,
            {"content-type": "image/png"}
        )
        
        # Get the public URL
        res = supabase.storage.from_("scan_images").get_public_url(unique_filename)
        return res
    except Exception as e:
        print(f"ERROR in upload_gradcam_image: {str(e)}")
        traceback.print_exc()
        raise e