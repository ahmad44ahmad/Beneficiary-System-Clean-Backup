import sys
import google.auth
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import io
from googleapiclient.http import MediaIoBaseDownload

def main():
    try:
        # Use Application Default Credentials from gcloud
        # This bypasses the need for client_secrets.json and manual token flows
        creds, project = google.auth.default(scopes=['https://www.googleapis.com/auth/drive.readonly'])
        
        service = build('drive', 'v3', credentials=creds)

        if len(sys.argv) > 1:
            query = " ".join(sys.argv[1:])
            print(f"Searching for: {query}")
            
            results = service.files().list(
                q=f"name contains '{query}'",
                pageSize=5,fields="nextPageToken, files(id, name, mimeType)").execute()
            items = results.get('files', [])

            if not items:
                print('No files found.')
                return

            print('Found files:')
            for i, item in enumerate(items):
                print(f"{i+1}. {item['name']} ({item['id']}) - {item['mimeType']}")
            
            # Auto-read the first one
            file_id = items[0]['id']
            file_name = items[0]['name']
            mime_type = items[0]['mimeType']
            
            print(f"\nAttempting to read first result: {file_name}")
            
            if "google-apps" in mime_type:
                request = service.files().export_media(fileId=file_id, mimeType='text/plain')
            else:
                request = service.files().get_media(fileId=file_id)
                
            file_content = io.BytesIO()
            downloader = MediaIoBaseDownload(file_content, request)
            done = False
            while done is False:
                status, done = downloader.next_chunk()
            
            print("-" * 20)
            print(file_content.getvalue().decode('utf-8', errors='ignore'))
            print("-" * 20)

        else:
            print("Usage: python drive_connector.py <filename_search_term>")

    except HttpError as error:
        print(f'An error occurred: {error}')
    except Exception as e:
        print(f"Authentication error: {e}")
        print("Please run: gcloud auth application-default login --scopes=openid,https://www.googleapis.com/auth/userinfo.email,https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/drive.readonly --no-launch-browser")

if __name__ == '__main__':
    main()
