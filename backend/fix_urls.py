# Run this script to fix existing malformed URLs in your database
# Place this file in your backend directory and run: python fix_urls.py

import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Supabase client
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

def fix_malformed_urls():
    """
    Fix all existing malformed URLs in the reports table
    """
    try:
        print("Starting URL fix process...")
        
        # Get all reports with image URLs
        response = supabase.table('reports').select('id, image_url').execute()
        
        if not response.data:
            print("No reports found in database")
            return
        
        print(f"Found {len(response.data)} reports to check")
        
        fixed_count = 0
        for report in response.data:
            original_url = report.get('image_url')
            
            if not original_url:
                print(f"Report {report['id']} has no image URL, skipping")
                continue
                
            # Check if URL ends with problematic characters
            if original_url.endswith('?') or original_url.endswith('&'):
                cleaned_url = original_url.rstrip('?&').strip()
                
                print(f"Fixing report {report['id']}:")
                print(f"  Before: {original_url}")
                print(f"  After:  {cleaned_url}")
                
                # Update the record in the database
                update_response = supabase.table('reports').update({
                    'image_url': cleaned_url
                }).eq('id', report['id']).execute()
                
                if update_response.data:
                    fixed_count += 1
                    print(f"  ✓ Successfully updated")
                else:
                    print(f"  ✗ Failed to update")
            else:
                print(f"Report {report['id']} URL is clean: {original_url}")
        
        print(f"\n🎉 Process complete! Fixed {fixed_count} malformed URLs")
        
        if fixed_count > 0:
            print("\nYour images should now load properly!")
        else:
            print("\nNo malformed URLs found - your data was already clean!")
            
    except Exception as e:
        print(f"❌ Error during fix process: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("🔧 Malformed URL Fixer")
    print("=" * 50)
    
    # Check if we have the required environment variables
    if not url or not key:
        print("❌ Missing required environment variables:")
        print("   - SUPABASE_URL")
        print("   - SUPABASE_ANON_KEY")
        print("\nPlease check your .env file")
        exit(1)
    
    print(f"Connected to: {url}")
    
    # Ask for confirmation
    confirm = input("\n⚠️  This will modify your database. Continue? (yes/no): ").lower()
    
    if confirm in ['yes', 'y']:
        fix_malformed_urls()
    else:
        print("Operation cancelled.")