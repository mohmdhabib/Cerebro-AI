import os
from flask import Flask
from flask_cors import CORS
from supabase import create_client, Client

def create_app():
    app = Flask(__name__)
    CORS(app) # Enable Cross-Origin Resource Sharing

    # Initialize Supabase client
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    app.supabase: Client = create_client(url, key)

    # app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')

    # Import and register routes
    from . import routes
    app.register_blueprint(routes.bp)

    return app