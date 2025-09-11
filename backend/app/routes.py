import traceback
from flask import Blueprint, request, jsonify, g, current_app, Response
from .auth import token_required
from .services import ml_service, supabase_service

bp = Blueprint('api', __name__, url_prefix='/api')

@bp.route('/upload', methods=['POST'])
@token_required
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected for uploading"}), 400

    try:
        user_id = g.user.id
        file = request.files['file']
        
        # 1. Get prediction from the model (as before)
        prediction, confidence = ml_service.predict(file)
        
        # 2. Upload image to storage (as before)
        image_url = supabase_service.upload_image_to_storage(file, user_id)

        # 3. THE UPDATE: Get all the new form data from the request
        report_data = {
            "patient_id": user_id,
            "image_url": image_url,
            "prediction": prediction,
            "confidence": float(confidence),
            
            # Add the new fields from the form
            "location": request.form.get('location'),
            "size_length_cm": request.form.get('size_length_cm', type=float),
            "size_width_cm": request.form.get('size_width_cm', type=float),
            "edema_present": request.form.get('edema_present', default='false').lower() == 'true',
            "contrast_pattern": request.form.get('contrast_pattern'),
            "tumor_grade": request.form.get('tumor_grade'),
            "recommendation": request.form.get('recommendation'),
            "patient_age": request.form.get('patient_age', type=int),
            "patient_gender": request.form.get('patient_gender'),
        }

        # 4. Save the complete report to the database
        saved_report = supabase_service.save_report_to_db(report_data)

        return jsonify(saved_report), 201

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "An error occurred during upload and processing", "details": str(e)}), 500


@bp.route('/reports', methods=['GET'])
@token_required
def get_reports():
    try:
        user_id = g.user.id
        user_profile = supabase_service.get_user_profile(user_id)
        
        # We don't need this check anymore since get_user_profile always returns a profile
        # if not user_profile:
        #     return jsonify({"error": "User profile not found"}), 404

        reports = supabase_service.get_reports_from_db(user_id, user_profile['role'])
        return jsonify(reports), 200

    except Exception as e:
        print(f"Error in get_reports route: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": "Failed to fetch reports", "details": str(e)}), 500

# --- NEW PROXY ENDPOINT ---# backend/app/routes.py

# ... (keep all other imports and routes the same) ...

# --- UPDATED PROXY ENDPOINT WITH ERROR LOGGING ---
@bp.route('/image-proxy/<path:file_path>', methods=['GET'])
@token_required
def image_proxy(file_path):
    """
    Securely fetches an image from Supabase storage on behalf of the user.
    This avoids CORS issues in the browser for PDF generation.
    """
    try:
        # Download the image bytes from Supabase Storage
        image_bytes = current_app.supabase.storage.from_("scan_images").download(file_path)
        
        # Determine mimetype (e.g., 'image/jpeg')
        mimetype = 'image/jpeg' if file_path.lower().endswith(('.jpg', '.jpeg')) else 'image/png'
        
        # Return the image bytes as a response
        return Response(image_bytes, mimetype=mimetype)
    except Exception as e:
        # THE FIX IS HERE: Print the detailed exception to the console
        print(f"--- Image Proxy Error --- \nFile Path: {file_path}\nError: {e}\n-------------------------")
        # If the file is not found or another error occurs
        return jsonify({"error": "Image not found or access denied", "details": str(e)}), 404
