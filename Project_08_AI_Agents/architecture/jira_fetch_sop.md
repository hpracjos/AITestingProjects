# SOP: Jira Fetch Tool

## Goal
Fetch user stories, summaries, descriptions, and acceptance criteria from Jira based on a Project Key or JQL.

## Inputs
- `project_key` (string): The Jira project key (e.g., VWOAPP)
- `.env` variables: `JIRA_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`

## Logic
1. Load credentials from `.env`.
2. Construct the JQL query (e.g., `project = {project_key} AND issuetype = Story`).
3. Make a GET request to `{JIRA_URL}/rest/api/2/search` with Basic Auth.
4. Parse the JSON response.
5. Extract Key, Summary, Description, and custom fields for Acceptance Criteria.

## Outputs
- JSON string or payload containing an array of issues.
- On failure, output a structured error message.

## Edge Cases
- Missing credentials: Return error requiring `.env` setup.
- Network timeout: Return timeout error.
- No issues found: Return empty array gracefully.
