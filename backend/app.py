import os
from app import create_app

# Create the Flask app instance using the factory function
app = create_app()

if __name__ == '__main__':
    # Run the app. It will be accessible at http://127.0.0.1:5000
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)