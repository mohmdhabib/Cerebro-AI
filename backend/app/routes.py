from flask import jsonify, request, current_app as app
from .services import supabase_service, ml_service
from . import auth
import uuid
from werkzeug.utils import secure_filename

# --- Auth Routes ---
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    return auth.handle_signup()

@app.route('/api/auth/login', methods=['POST'])
def login():
    return auth.handle_login()


# --- Patient Routes ---
@app.route('/api/patients', methods=['GET'])
def get_patients():
    data, error = supabase_service.get_all_patients()
    if error: return jsonify({"error": error}), 500
    return jsonify(data), 200


# --- Report Routes ---
@app.route('/api/reports', methods=['GET'])
def get_reports():
    data, error = supabase_service.get_all_reports()
    if error: return jsonify({"error": error}), 500
    return jsonify(data), 200


# --- Scan Routes ---
# --- NEW ROUTE ---
@app.route('/api/scans', methods=['GET'])
def get_scans():
    data, error = supabase_service.get_all_scans()
    if error: return jsonify({"error": error}), 500
    return jsonify(data), 200
# --- END OF NEW ROUTE ---

@app.route('/api/scans/upload', methods=['POST'])
def upload_scan():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']
    patient_id = request.form.get('patient_id')

    if file.filename == '' or not patient_id:
        return jsonify({"error": "File or patient_id is missing"}), 400

    filename = secure_filename(file.filename)
    unique_filename = f"{uuid.uuid4()}-{filename}"
    file_content = file.read()

    upload_result, error = supabase_service.upload_scan_to_storage(unique_filename, file_content, file.content_type)
    if error: return jsonify({"error": error}), 500

    image_url = upload_result
    scan_record, error = supabase_service.create_scan_record(patient_id, image_url, unique_filename)
    if error: return jsonify({"error": error}), 500
    
    ml_service.run_tumor_detection(scan_record['id'])
    
    return jsonify({"message": "Scan uploaded successfully", "scan": scan_record}), 201