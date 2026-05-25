import os
import sys
import json
import requests
from dotenv import load_dotenv
from requests.auth import HTTPBasicAuth

# Load environment variables
load_dotenv()

def fetch_jira_issues(project_key):
    jira_url = os.getenv("JIRA_URL")
    email = os.getenv("JIRA_EMAIL")
    token = os.getenv("JIRA_API_TOKEN")

    if not all([jira_url, email, token]):
        print(json.dumps({"error": "Missing Jira credentials in .env file."}))
        sys.exit(1)

    jql = f"project = {project_key} AND issuetype = Story ORDER BY created DESC"
    url = f"{jira_url.rstrip('/')}/rest/api/3/search/jql"
    
    query = {
        'jql': jql,
        'maxResults': 10,
        'fields': 'summary,description'
    }

    auth = HTTPBasicAuth(email, token)
    headers = {"Accept": "application/json"}

    try:
        response = requests.get(url, headers=headers, params=query, auth=auth, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        issues = []
        for item in data.get('issues', []):
            issues.append({
                "key": item.get('key'),
                "summary": item.get('fields', {}).get('summary', ''),
                "description": item.get('fields', {}).get('description', '')
            })
            
        # Write intermediate payload to .tmp
        os.makedirs('.tmp', exist_ok=True)
        with open('.tmp/jira_issues.json', 'w') as f:
            json.dump(issues, f, indent=2)
            
        print(json.dumps({"status": "success", "count": len(issues), "tmp_file": ".tmp/jira_issues.json"}))

    except requests.exceptions.RequestException as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python jira_fetch.py <PROJECT_KEY>"}))
        sys.exit(1)
    
    project_key = sys.argv[1]
    fetch_jira_issues(project_key)
