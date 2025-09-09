import os
import httpx
import uuid
from supabase import create_client, Client
from supabase.lib.client_options import ClientOptions
from dotenv import load_dotenv

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

# Use a robust client initialization to prevent timeout issues
options = ClientOptions(postgrest_client_timeout=None)
supabase: Client = create_client(url, key, options=options)


# --- User Profile Functions (using the 'patients' table) ---

def get_user_profile(user_id):
    """Fetches a user's professional profile from the patients table."""
    try:
        response = supabase.table('patients').select('*').eq('user_id', user_id).maybe_single().execute()
        return response.data, None
    except Exception as e:
        return None, str(e)

def create_user_profile(user_id, email, profile_data):
    """Creates the initial user profile in the patients table during onboarding."""
    try:
        data_to_insert = {
            "user_id": user_id,
            "email": email,
            "name": profile_data.get('name'),
            "title": profile_data.get('title'),
            "specialty": profile_data.get('specialty'),
            "institution": profile_data.get('institution'),
            "onboarded": True
        }
        # Corrected: .insert() returns the new data in the response by default.
        response = supabase.table('patients').insert(data_to_insert).execute()
        return response.data[0], None
    except Exception as e:
        return None, str(e)

def update_user_profile(user_id, profile_data):
    """Updates an existing user's professional profile."""
    try:
        # Corrected: .update() returns the updated data in the response.
        response = supabase.table('patients').update(profile_data).eq('user_id', user_id).execute()
        return response.data[0], None
    except Exception as e:
        return None, str(e)


# --- Patient Data Functions ---

def get_all_patients(doctor_user_id):
    """Fetches all patient records BELONGING to a specific doctor."""
    try:
        # FIX: Only select records marked as 'PATIENT' and owned by the current doctor
        response = supabase.table('patients').select('*') \
            .eq('user_id', doctor_user_id) \
            .eq('record_type', 'PATIENT') \
            .order('name').execute()
        return response.data, None
    except Exception as e:
        return None, str(e)

def create_patient(patient_data, doctor_user_id):
    """Creates a new patient record and links it to the logged-in doctor."""
    try:
        # Ensure the new patient record is linked to the doctor creating it
        patient_data['user_id'] = doctor_user_id
        patient_data['record_type'] = 'PATIENT'
        
        response = supabase.table('patients').insert(patient_data).select().single().execute()
        return response.data, None
    except Exception as e:
        return None, str(e)


# --- Scan & Report Functions ---

def get_all_scans():
    """Fetches all scans with their related patient details, newest first."""
    try:
        response = supabase.table('scans').select('*, patients(*)').order('created_at', desc=True).execute()
        return response.data, None
    except Exception as e:
        return None, str(e)

def get_all_reports():
    """Fetches all generated reports."""
    try:
        response = supabase.table('reports').select('*, patients(name)').order('created_at', desc=True).execute()
        return response.data, None
    except Exception as e:
        return None, str(e)

def create_scan_record(patient_id, image_url, filename):
    """Creates a database record for a newly uploaded scan."""
    try:
        scan_data = {
            'patient_id': patient_id,
            'image_url': image_url,
            'status': 'Processing'
        }
        response = supabase.table('scans').insert(scan_data).execute()
        return response.data[0], None
    except Exception as e:
        return None, str(e)

def update_scan_with_results(scan_id, results):
    """Updates a scan record with results from the ML model."""
    try:
        response = supabase.table('scans').update(results).eq('id', scan_id).execute()
        return response.data[0], None
    except Exception as e:
        return None, str(e)


# --- Storage Functions ---

def upload_scan_to_storage(filename, file_content, content_type):
    """Uploads a scan image to the 'scans' storage bucket."""
    try:
        bucket_name = 'scans'
        supabase.storage.from_(bucket_name).upload(
            file=file_content,
            path=filename,
            file_options={"content-type": content_type}
        )
        public_url = supabase.storage.from_(bucket_name).get_public_url(filename)
        return public_url, None
    except Exception as e:
        return None, str(e)