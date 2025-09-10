from functools import wraps
from flask import request, g, current_app, jsonify

def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({"error": "Authorization header missing"}), 401
        
        try:
            # The token is expected to be 'Bearer <your-jwt>'
            jwt_token = auth_header.split(" ")[1]
            user_response = current_app.supabase.auth.get_user(jwt_token)
            g.user = user_response.user
        except Exception as e:
            return jsonify({"error": "Invalid token", "details": str(e)}), 401
        
        return f(*args, **kwargs)
    return decorated_function