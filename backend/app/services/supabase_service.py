import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

def get_all_patients():
    try:
        response = supabase.table('patients').select('*').order('name').execute()
        return response.data, None
    except Exception as e:
        return None, str(e)

def get_all_reports():
    try:
        response = supabase.table('reports').select('*, patients(name)').order('created_at', desc=True).execute()
        return response.data, None
    except Exception as e:
        return None, str(e)
        
# --- NEW FUNCTION ---
def get_all_scans():
    """Fetches all scans with their related patient details, newest first."""
    try:
        response = supabase.table('scans').select('*, patients(*)').order('created_at', desc=True).execute()
        return response.data, None
    except Exception as e:
        return None, str(e)
# --- END OF NEW FUNCTION ---

def upload_scan_to_storage(filename, file_content, content_type):
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

def create_scan_record(patient_id, image_url, filename):
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