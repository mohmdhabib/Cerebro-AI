from .services.supabase_service import supabase
from flask import request, jsonify

def handle_signup():
    """Signs up a new user and logs them in immediately."""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        # With email confirmation disabled, this will sign up and log in the user
        auth_response = supabase.auth.sign_up({"email": email, "password": password})
        
        # If the signup is successful, a session is returned
        if auth_response.user and auth_response.session:
            return jsonify({
                "message": "User created and logged in successfully.",
                "access_token": auth_response.session.access_token,
                "refresh_token": auth_response.session.refresh_token, # Important for session management
                "user": {
                    "id": auth_response.user.id,
                    "email": auth_response.user.email
                }
            }), 201
        else:
            # Handle cases where signup might fail (e.g., user exists but is not confirmed in old setup)
            return jsonify({"error": "Could not sign up user"}), 400

    except Exception as e:
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
        
        return jsonify({
            "access_token": auth_response.session.access_token,
            "refresh_token": auth_response.session.refresh_token,
            "user": {
                "id": auth_response.user.id,
                "email": auth_response.user.email
            }
        }), 200

    except Exception as e:
        return jsonify({"error": "Invalid login credentials"}), 401