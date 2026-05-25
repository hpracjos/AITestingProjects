# SOP: LLM Test Plan Generation Tool

## Goal
Take a list of Jira user stories and use an LLM (Groq, Ollama) to generate a comprehensive 12-section test plan.

## Inputs
- `issues_json` (string): JSON payload of Jira issues.
- `provider` (string): 'groq' or 'ollama'.
- `.env` variables: `GROQ_API_KEY`, `OLLAMA_BASE_URL`.

## Logic
1. Load credentials from `.env`.
2. Read the issues payload from `.tmp/issues.json` or as direct input.
3. Construct the system prompt enforcing the 12-section enterprise format.
4. Call the respective LLM API.
5. Save the generated Markdown response to `.tmp/test_plan_output.md`.

## Outputs
- Path to the generated markdown file.
- On failure, output a structured error message.

## Edge Cases
- LLM API timeout.
- Context window exceeded (if too many issues, limit the payload).
