import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

import uvicorn
from app import create_app

app = create_app()

if __name__ == "__main__":
    # Use PORT from environment variables or default to 8000
    port = int(os.getenv("PORT", 8001))
    uvicorn.run("run:app", host="0.0.0.0", port=port, reload=True)