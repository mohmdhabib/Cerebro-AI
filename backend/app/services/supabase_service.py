# backend/app/services/supabase_service.py

import uuid
from flask import current_app,request

def upload_image_to_storage(file, user_id):
    try:
        supabase = current_app.supabase

        file_extension = file.filename.split('.')[-1]
        unique_filename = f"{user_id}/{uuid.uuid4()}.{file_extension}"

        file.stream.seek(0)

        # Attach owner metadata
        metadata = {
            "owner": user_id
        }

        # Upload the file with metadata
        supabase.storage.from_("scan_images").upload(
            unique_filename,
            file.read(),
            {
                "content-type": file.content_type,
                "metadata": metadata
            }
        )

        res = supabase.storage.from_("scan_images").get_public_url(unique_filename)
        return res
    except Exception as e:
        print("Error in upload_image_to_storage:", e)
        raise e

def save_report_to_db(report_data):
    """Saves report metadata to the 'reports' table."""
    supabase = current_app.supabase
    data, count = supabase.table('reports').insert(report_data).execute()
    return data[1][0] if data[1] else None

def get_user_profile(user_id):
    """Fetches a user's profile to determine their role."""
    supabase = current_app.supabase
    data, count = supabase.table('profiles').select('*').eq('id', user_id).single().execute()
    return data[1] if data[1] else None

def get_reports_from_db(user_id, role):
    """Fetches reports based on user role."""
    supabase = current_app.supabase
    
    # THE FIX IS HERE: Explicitly define the foreign key relationship
    # This tells Supabase to use the 'patient_id' column to join with 'profiles'
    query = supabase.table('reports').select('*, patient_id:profiles(full_name)').order('created_at', desc=True)
    
    if role == 'Patient':
        query = query.eq('patient_id', user_id)
        
    data, count = query.execute()
    return data[1] if data[1] else []