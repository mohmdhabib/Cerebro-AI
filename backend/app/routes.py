import traceback
from flask import Blueprint, request, jsonify, g, current_app
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
        
        prediction, confidence = ml_service.predict(file)
        image_url = supabase_service.upload_image_to_storage(file, user_id)

        report_data = {
            "patient_id": user_id,
            "image_url": image_url,
            "prediction": prediction,
            "confidence": float(confidence)
        }

        print("--- Attempting to save this data to Supabase: ---", report_data)
        saved_report = supabase_service.save_report_to_db(report_data)

        return jsonify(saved_report), 201

    except Exception as e:
        # THE FIX IS HERE: This line will print the full traceback to your terminal
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