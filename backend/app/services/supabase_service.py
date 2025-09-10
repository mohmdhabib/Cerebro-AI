import uuid
from flask import current_app

def upload_image_to_storage(file, user_id):
    """Uploads a file to Supabase storage and returns the public URL."""
    supabase = current_app.supabase
    
    # Generate a unique file name to avoid conflicts
    file_extension = file.filename.split('.')[-1]
    unique_filename = f"{user_id}/{uuid.uuid4()}.{file_extension}"
    
    # Reset file stream position
    file.stream.seek(0)
    
    # Upload the file
    supabase.storage.from_("scan_images").upload(unique_filename, file.read())
    
    # Get the public URL
    res = supabase.storage.from_("scan_images").get_public_url(unique_filename)
    return res

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
    query = supabase.table('reports').select('*, profiles(full_name)').order('created_at', desc=True)
    
    # Patients only see their own reports. This is also enforced by RLS,
    # but filtering here is good practice.
    if role == 'Patient':
        query = query.eq('patient_id', user_id)
        
    data, count = query.execute()
    return data[1] if data[1] else []