# backend/app/services/supabase_service.py

import uuid
import traceback
from flask import current_app, request

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

        # Get the public URL - make sure this includes the full URL with domain
        res = supabase.storage.from_("scan_images").get_public_url(unique_filename)
        
        # Debug the URL
        print(f"Generated image URL: {res}")
        
        # If the URL doesn't start with http, prepend the Supabase URL
        if not res.startswith('http'):
            supabase_url = current_app.config.get('SUPABASE_URL')
            res = f"{supabase_url}/storage/v1/object/public/scan_images/{unique_filename}"
            print(f"Modified image URL: {res}")
            
        return res
    except Exception as e:
        print("Error in upload_image_to_storage:", e)
        traceback.print_exc()
        raise e

def save_report_to_db(report_data):
    """Saves report metadata to the 'reports' table."""
    try:
        supabase = current_app.supabase
        data, count = supabase.table('reports').insert(report_data).execute()
        return data[1][0] if data[1] else None
    except Exception as e:
        print("Error in save_report_to_db:", e)
        traceback.print_exc()
        raise e

def get_user_profile(user_id):
    """Fetches a user's profile to determine their role."""
    try:
        supabase = current_app.supabase
        # Remove .single() to avoid the error when no profile exists
        data, count = supabase.table('profiles').select('*').eq('id', user_id).execute()
        
        # Check if any data was returned
        if data[1] and len(data[1]) > 0:
            return data[1][0]  # Return the first profile found
        else:
            # Return a default profile with 'Patient' role if none exists
            print(f"No profile found for user {user_id}, using default profile")
            return {"id": user_id, "role": "Patient", "full_name": None}
    except Exception as e:
        print("Error in get_user_profile:", e)
        traceback.print_exc()
        # Return a default profile instead of raising an exception
        return {"id": user_id, "role": "Patient", "full_name": None}

def get_reports_from_db(user_id, role):
    """Fetches reports based on user role."""
    try:
        supabase = current_app.supabase
        
        print(f"Fetching reports for user {user_id} with role {role}")
        
        # Since RLS is disabled, we can simplify the query
        query = supabase.table('reports').select('*').order('created_at', desc=True)
        
        # Patients should only see their own reports
        if role == 'Patient':
            query = query.eq('patient_id', user_id)
        
        print(f"Executing query: {query}")
        response = query.execute()
        
        # Check if there's any data in the response
        if not response.data:
            print("No data returned from query")
            return []

        # With RLS disabled, we need to manually fetch patient names
        reports = response.data
        
        # Get all unique patient IDs from the reports
        patient_ids = list(set([report.get('patient_id') for report in reports if report.get('patient_id')]))
        
        if patient_ids:
            # Fetch all profiles for these patients in a single query
            profiles_query = supabase.table('profiles').select('id, full_name').in_('id', patient_ids)
            profiles_response = profiles_query.execute()
            
            # Create a lookup dictionary for patient names
            patient_names = {}
            if profiles_response.data:
                for profile in profiles_response.data:
                    patient_names[profile.get('id')] = profile.get('full_name')
            
            # Add patient names to reports
            for report in reports:
                patient_id = report.get('patient_id')
                report['patient_name'] = patient_names.get(patient_id, 'N/A')
        
        return reports
    except Exception as e:
        print(f"ERROR in get_reports_from_db: {str(e)}")
        traceback.print_exc()
        raise e