import os
import sys
import json
import requests
import markdown
from requests.auth import HTTPBasicAuth
from dotenv import load_dotenv

load_dotenv()

def main():
    if len(sys.argv) < 4:
        print(json.dumps({"error": "Usage: python confluence_publish.py <markdown_file> <page_title> <space_key>"}))
        sys.exit(1)

    file_path = sys.argv[1]
    title = sys.argv[2]
    space_key = sys.argv[3]

    jira_url = os.getenv("JIRA_URL")
    email = os.getenv("JIRA_EMAIL")
    token = os.getenv("JIRA_API_TOKEN")

    if not all([jira_url, email, token]):
        print(json.dumps({"error": "Missing JIRA credentials in .env"}))
        sys.exit(1)

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            md_content = f.read()
    except Exception as e:
        print(json.dumps({"error": f"Failed to read file: {str(e)}"}))
        sys.exit(1)

    # Convert markdown to html for Confluence storage format
    html_content = markdown.markdown(md_content, extensions=['tables', 'fenced_code'])

    # Prepare Confluence API request (API v1)
    base_url = jira_url.rstrip('/')
    url = f"{base_url}/wiki/rest/api/content"

    payload = {
        "type": "page",
        "title": title,
        "space": {
            "key": space_key
        },
        "body": {
            "storage": {
                "value": html_content,
                "representation": "storage"
            }
        }
    }

    headers = {
        "Content-Type": "application/json"
    }
    
    auth = HTTPBasicAuth(email, token)

    try:
        res = requests.post(url, json=payload, headers=headers, auth=auth, timeout=30)
        res.raise_for_status()
        data = res.json()
        page_url = f"{base_url}/wiki{data['_links']['webui']}"
        print(json.dumps({"status": "success", "url": page_url}))
    except requests.exceptions.HTTPError as e:
        print(json.dumps({"error": str(e), "details": e.response.text}))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
