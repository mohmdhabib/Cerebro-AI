# backend/app/services/supabase_service.py

import uuid
import traceback
from flask import current_app

def upload_image_to_storage(file, user_id):
    """Uploads a file to Supabase storage and returns the full public URL."""
    try:
        supabase = current_app.supabase
        file_extension = file.filename.split('.')[-1]
        unique_filename = f"{user_id}/{uuid.uuid4()}.{file_extension}"
        
        # Reset file stream to the beginning before reading
        file.stream.seek(0)
        
        # Upload the file
        supabase.storage.from_("scan_images").upload(unique_filename, file.read())
        
        # Get the public URL which should be a full URL
        res = supabase.storage.from_("scan_images").get_public_url(unique_filename)
        return res
    except Exception as e:
        print(f"ERROR in upload_image_to_storage: {str(e)}")
        traceback.print_exc()
        raise e

def save_report_to_db(report_data):
    """Saves report metadata to the 'reports' table."""
    try:
        supabase = current_app.supabase
        data, count = supabase.table('reports').insert(report_data).execute()
        return data[1][0] if data[1] else None
    except Exception as e:
        print(f"ERROR in save_report_to_db: {str(e)}")
        traceback.print_exc()
        raise e

def get_user_profile(user_id):
    """Fetches a user's profile. Handles cases where a profile may not exist."""
    try:
        supabase = current_app.supabase
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

def get_reports_from_db(user_id, role):
    try:
        supabase = current_app.supabase
        # This query fetches all columns from reports and joins to get the full_name
        query = supabase.table('reports').select('*, profiles:patient_id (full_name)').order('created_at', desc=True)
        if role == 'Patient':
            query = query.eq('patient_id', user_id)
        response = query.execute()
        if not response.data: return []
        
        # This loop flattens the result to include 'patient_name'
        reports = response.data
        for report in reports:
            profile_data = report.get('profiles')
            report['patient_name'] = profile_data.get('full_name') if profile_data else 'N/A'
            if 'profiles' in report: del report['profiles']
        return reports
    except Exception as e:
        traceback.print_exc()
        raise e