# 🚀 Project Constitution (gemini.md)

This document is the absolute source of truth for the project.

## 1. Data Schemas

### Input Shape
- **Jira Credentials:** URL, Email, API Token
- **LLM Configuration:** Provider (Ollama, Groq, Grok), API Key (if applicable), Model Name
- **Project Context:** Project Key, Sprint version, Additional context string
- **Fetched Issues (Jira Data):** Array of objects containing Issue Key, Summary, Description, and Acceptance Criteria.

### Output Shape
- **Generated Test Plan Payload:** A structured text document (Markdown format) comprising 12 enterprise-standard sections (Scope, Inclusions, Strategy, Defect Reporting, Entry/Exit Criteria, etc.).

## 2. Behavioral Rules
- **Design Aesthetic:** Premium enterprise SaaS design ensuring reliability and trust.
- **Color Palette:** Midnight Blue (#0F172A), Teal (#14B8A6), Silver Gray (#CBD5E1), White (#FFFFFF). Must support Light and Dark Modes.
- **Workflow:** Strictly follow a 4-step wizard process: Setup -> Fetch Issues -> Review -> Test Plan.
- **Tone:** Professional, analytical, and structured (Fortune 500 consulting style).
- **Execution:** Test plans must adhere to a standardized 12-section template to ensure consistency.

## 3. Architectural Invariants
- **A.N.T. 3-Layer Architecture:**
  - **Architecture:** `gemini.md` and documentation for schemas.
  - **Navigation:** React component structure and Context API for state management.
  - **Tools:** Independent, mockable API endpoints (Jira integration, LLM connectors).
- **State Management:** Centralized via React Context (`AppContext.jsx`) using `useReducer`.

## 4. Maintenance Log
- **[2026-05-16]** Baseline established for STLC360 AI - Intelligent Test Planning Agent.
