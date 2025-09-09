from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv

def create_app():
    """Application factory to create and configure the Flask app."""
    
    # Load environment variables from .env file
    load_dotenv()

    app = Flask(__name__)
    
    # Enable CORS to allow your React frontend to make requests to this API
    CORS(app, resources={r"/api/*": {"origins": "*"}}) # Allow all origins for development

    with app.app_context():
        # Import the routes so Flask knows about the API endpoints
        from . import routes

    return app