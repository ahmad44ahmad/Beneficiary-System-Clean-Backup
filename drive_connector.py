#!/usr/bin/env python3
"""
Basira Quality System — Google Drive Connector
Searches, lists, and downloads quality documents from Google Drive.

Usage:
  python drive_connector.py "search term"                    # Search & show first result
  python drive_connector.py "search term" --pick 2           # Pick specific result (1-based)
  python drive_connector.py "search term" --list             # List only, no download
  python drive_connector.py "search term" --save             # Save to downloads/ folder
  python drive_connector.py "search term" --save --pick 3    # Save specific file
  python drive_connector.py --batch "جودة" "مؤشرات" "خطة"   # Search multiple terms

Requires: pip install google-auth google-api-python-client
Auth:     gcloud auth application-default login --scopes=openid,https://www.googleapis.com/auth/userinfo.email,https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/drive.readonly
"""

import sys
import os
import argparse
import google.auth
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import io
from googleapiclient.http import MediaIoBaseDownload


DOWNLOADS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'downloads')

EXPORT_MIMES = {
    'application/vnd.google-apps.document': ('text/plain', '.txt'),
    'application/vnd.google-apps.spreadsheet': ('text/csv', '.csv'),
    'application/vnd.google-apps.presentation': ('application/pdf', '.pdf'),
    'application/vnd.google-apps.drawing': ('image/png', '.png'),
}


def get_service():
    creds, project = google.auth.default(
        scopes=['https://www.googleapis.com/auth/drive.readonly']
    )
    return build('drive', 'v3', credentials=creds)


def search_files(service, query, max_results=10):
    results = service.files().list(
        q=f"name contains '{query}' and trashed = false",
        pageSize=max_results,
        fields="files(id, name, mimeType, modifiedTime, size)",
        orderBy="modifiedTime desc"
    ).execute()
    return results.get('files', [])


def format_size(size_str):
    if not size_str:
        return 'N/A'
    size = int(size_str)
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size < 1024:
            return f"{size:.1f} {unit}"
        size /= 1024
    return f"{size:.1f} TB"


def print_results(items, query):
    print(f"\n  Search: \"{query}\"")
    print(f"  Found: {len(items)} file(s)\n")
    print(f"  {'#':<4} {'Name':<55} {'Type':<20} {'Modified':<12} {'Size':<10}")
    print(f"  {'—'*4} {'—'*55} {'—'*20} {'—'*12} {'—'*10}")
    for i, item in enumerate(items):
        name = item['name'][:54]
        mime = item['mimeType'].split('.')[-1] if 'google-apps' in item['mimeType'] else item['mimeType'].split('/')[-1]
        modified = item.get('modifiedTime', '')[:10]
        size = format_size(item.get('size'))
        print(f"  {i+1:<4} {name:<55} {mime:<20} {modified:<12} {size:<10}")
    print()


def download_file(service, file_item, save_to_disk=False):
    file_id = file_item['id']
    file_name = file_item['name']
    mime_type = file_item['mimeType']

    print(f"  Downloading: {file_name}")

    if mime_type in EXPORT_MIMES:
        export_mime, ext = EXPORT_MIMES[mime_type]
        request = service.files().export_media(fileId=file_id, mimeType=export_mime)
        file_name_out = file_name + ext
    else:
        request = service.files().get_media(fileId=file_id)
        file_name_out = file_name

    buffer = io.BytesIO()
    downloader = MediaIoBaseDownload(buffer, request)
    done = False
    while not done:
        status, done = downloader.next_chunk()
        if status:
            pct = int(status.progress() * 100)
            print(f"  Progress: {pct}%", end='\r')
    print(f"  Progress: 100%")

    content = buffer.getvalue()

    if save_to_disk:
        os.makedirs(DOWNLOADS_DIR, exist_ok=True)
        safe_name = "".join(c if c.isalnum() or c in ' .-_()' else '_' for c in file_name_out)
        filepath = os.path.join(DOWNLOADS_DIR, safe_name)
        with open(filepath, 'wb') as f:
            f.write(content)
        print(f"  Saved: {filepath} ({format_size(str(len(content)))})\n")
        return filepath
    else:
        print(f"\n{'='*80}")
        try:
            text = content.decode('utf-8', errors='ignore')
            print(text)
        except Exception:
            print(f"  [Binary file — {format_size(str(len(content)))}. Use --save to download.]")
        print(f"{'='*80}\n")
        return None


def main():
    parser = argparse.ArgumentParser(
        description='Basira Quality System — Google Drive Connector',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument('query', nargs='*', help='Search term(s)')
    parser.add_argument('--pick', type=int, default=1, help='Pick result # (1-based, default: 1)')
    parser.add_argument('--list', action='store_true', help='List results only, do not download')
    parser.add_argument('--save', action='store_true', help='Save file to downloads/ folder')
    parser.add_argument('--batch', nargs='+', help='Search multiple terms')
    parser.add_argument('--max', type=int, default=10, help='Max results per search (default: 10)')

    args = parser.parse_args()

    if not args.query and not args.batch:
        parser.print_help()
        sys.exit(1)

    try:
        service = get_service()
    except Exception as e:
        print(f"\n  Authentication error: {e}")
        print("\n  Run this command first:")
        print("  gcloud auth application-default login \\")
        print("    --scopes=openid,https://www.googleapis.com/auth/userinfo.email,\\")
        print("https://www.googleapis.com/auth/cloud-platform,\\")
        print("https://www.googleapis.com/auth/drive.readonly\n")
        sys.exit(1)

    queries = args.batch if args.batch else [' '.join(args.query)]

    for query in queries:
        try:
            items = search_files(service, query, args.max)

            if not items:
                print(f"\n  No files found for: \"{query}\"\n")
                continue

            print_results(items, query)

            if args.list:
                continue

            pick = args.pick
            if pick < 1 or pick > len(items):
                print(f"  Invalid pick #{pick}. Choose 1-{len(items)}.")
                continue

            download_file(service, items[pick - 1], save_to_disk=args.save)

        except HttpError as error:
            print(f"\n  Google API error: {error}\n")


if __name__ == '__main__':
    main()
