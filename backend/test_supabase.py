import os
from supabase import create_client, Client
from dotenv import load_dotenv

print("--- Starting Supabase Connection Test ---")

try:
    # 1. Load environment variables from .env file
    load_dotenv()
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")

    # 2. Check if variables were loaded
    if not url or not key:
        raise ValueError("Error: SUPABASE_URL or SUPABASE_KEY not found in .env file.")

    print(f"Successfully loaded credentials. URL: {url}")
    print("--- Attempting to connect to Supabase... ---")

    # 3. Create the Supabase client
    supabase: Client = create_client(url, key)
    print("Client created successfully.")

    # 4. Attempt a simple query
    print("--- Fetching one profile from the database... ---")
    response = supabase.table('profiles').select('*').limit(1).execute()

    # 5. Print the result
    print("\n✅ SUCCESS: The connection and query worked!")
    print("Data received:")
    print(response.data)

except Exception as e:
    print("\n❌ FAILURE: The script failed.")
    print("Error details:")
    print(e)

print("\n--- Test Finished ---")