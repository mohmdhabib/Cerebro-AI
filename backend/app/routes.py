from flask import jsonify, request, current_app as app
from .services import supabase_service, ml_service
from . import auth
import uuid
from werkzeug.utils import secure_filename

# Auth Helper to securely get user from token
def get_user_from_token():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header: return None, "Missing Authorization Header"
        
        jwt = auth_header.split(" ")[1]
        user = supabase_service.supabase.auth.get_user(jwt=jwt)
        return user, None
    except Exception as e:
        return None, str(e)

# --- Auth Routes ---
@app.route('/api/auth/signup', methods=['POST'])
def signup(): return auth.handle_signup()

@app.route('/api/auth/login', methods=['POST'])
def login(): return auth.handle_login()

# --- Unified Profile Route (for the logged-in doctor) ---
@app.route('/api/profile', methods=['GET', 'PUT'])
def handle_profile():
    user, error = get_user_from_token()
    if error or not user:
        return jsonify({"error": "Unauthorized", "details": error}), 401
    
    user_id = user.user.id

    if request.method == 'GET':
        profile, db_error = supabase_service.get_user_profile(user_id)
        if db_error: return jsonify({"error": db_error}), 500
        return jsonify(profile), 200
        
    if request.method == 'PUT':
        profile_data = {}
        
        # Get text data from the form part of the request
        if 'name' in request.form: profile_data['name'] = request.form['name']
        if 'title' in request.form: profile_data['title'] = request.form['title']
        if 'specialty' in request.form: profile_data['specialty'] = request.form['specialty']
        if 'institution' in request.form: profile_data['institution'] = request.form['institution']

        # Check for an avatar file in the file part of the request
        if 'avatar' in request.files:
            file = request.files['avatar']
            if file and file.filename:
                file_content = file.read()
                content_type = file.content_type
                jwt = request.headers.get('Authorization').split(" ")[1]
                avatar_url, upload_error = supabase_service.upload_avatar_as_user(user_id, file_content, content_type, jwt)
                if upload_error:
                    return jsonify({"error": f"Storage error: {upload_error}"}), 500
                profile_data['avatar_url'] = avatar_url
        
        if not profile_data:
            return jsonify({"message": "No data provided for update"}), 400

        updated_profile, db_error = supabase_service.update_user_profile(user_id, profile_data)
        if db_error:
            return jsonify({"error": db_error}), 500
        
        return jsonify(updated_profile), 200

# --- Patient Data Routes (for managing actual patients) ---
@app.route('/api/patients', methods=['GET', 'POST'])
def handle_patients():
    user, error = get_user_from_token()
    if error or not user:
        return jsonify({"error": "Unauthorized"}), 401
    
    doctor_user_id = user.user.id

    if request.method == 'POST':
        patient_data = request.get_json()
        new_patient, db_error = supabase_service.create_patient(patient_data, doctor_user_id)
        if db_error: return jsonify({"error": db_error}), 500
        return jsonify(new_patient), 201
    
    # GET request
    data, db_error = supabase_service.get_all_patients(doctor_user_id)
    if db_error: return jsonify({"error": db_error}), 500
    return jsonify(data), 200

# --- Report Routes (NOW SECURED) ---
@app.route('/api/reports', methods=['GET'])
def get_reports():
    user, error = get_user_from_token()
    if error or not user:
        return jsonify({"error": "Unauthorized"}), 401
    
    data, db_error = supabase_service.get_all_reports()
    if db_error: return jsonify({"error": db_error}), 500
    return jsonify(data), 200

# --- Scan Routes (NOW SECURED) ---
@app.route('/api/scans', methods=['GET'])
def get_scans():
    user, error = get_user_from_token()
    if error or not user:
        return jsonify({"error": "Unauthorized"}), 401

    data, db_error = supabase_service.get_all_scans()
    if db_error: return jsonify({"error": db_error}), 500
    return jsonify(data), 200

@app.route('/api/scans/upload', methods=['POST'])
def upload_scan():
    user, error = get_user_from_token()
    if error or not user:
        return jsonify({"error": "Unauthorized"}), 401

    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    # ... (rest of upload logic) ...
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


### Why This Fixes the Problem
