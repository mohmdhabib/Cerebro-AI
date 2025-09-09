from .services.supabase_service import supabase
from flask import request, jsonify

def handle_signup():
    """Signs up a new user and creates their profile in one transaction."""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        profile_details = { "name": data.get('name'), "title": data.get('title'), "specialty": data.get('specialty'), "institution": data.get('institution') }

        if not all([email, password, profile_details["name"]]):
            return jsonify({"error": "Email, password, and name are required"}), 400

        auth_response = supabase.auth.sign_up({"email": email, "password": password})
        if not auth_response.user:
             return jsonify({"error": "Failed to create authentication user."}), 500

        user_id = auth_response.user.id
        
        from .services import supabase_service
        profile, db_error = supabase_service.create_user_profile(user_id, email, profile_details)
        if db_error:
            return jsonify({"error": f"Could not create user profile: {db_error}"}), 500

        user_dict = { "id": auth_response.user.id, "email": auth_response.user.email }

        return jsonify({
            "access_token": auth_response.session.access_token,
            "refresh_token": auth_response.session.refresh_token,
            "user": user_dict,
            "profile": profile
        }), 201

    except Exception as e:
        if 'User already registered' in str(e):
            return jsonify({"error": "A user with this email address already exists."}), 409
        return jsonify({"error": str(e)}), 500

def handle_login():
    """Logs in an existing user."""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        auth_response = supabase.auth.sign_in_with_password({"email": email, "password": password})
        
        user_dict = { "id": auth_response.user.id, "email": auth_response.user.email }

        return jsonify({
            "access_token": auth_response.session.access_token,
            "refresh_token": auth_response.session.refresh_token,
            "user": user_dict
        }), 200

    except Exception as e:
        return jsonify({"error": "Invalid login credentials"}), 401