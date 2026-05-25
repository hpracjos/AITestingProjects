# STLC360 AI - Intelligent Test Planning Agent

**STLC360 AI** is an enterprise-grade intelligent Software Testing Life Cycle management platform designed for Fortune 500 consulting style reliability. This project serves as a comprehensive Test Planning Agent, enabling QA teams, SDETs, and testing professionals to automatically generate professional test plans from project requirements and Jira user stories.

## 🚀 Key Features & Capabilities

* **Intelligent Test Planning:** Connects to powerful Large Language Models (LLMs) including Ollama (local) and Groq to analyze user stories and generate rich, detailed test plans natively in markdown format.
* **Deterministic Python Backend Engine:** Follows the A.N.T. 3-Layer Architecture by separating frontend visual logic from backend deterministic engines. The Vite server seamlessly spawns local Python tools (`jira_fetch.py`, `llm_generate.py`, `confluence_publish.py`) to execute complex logic natively.
* **Live Jira Integration:** Securely authenticates with Atlassian Cloud to fetch real live User Stories, Epics, and Bugs dynamically by using the Jira v3 API.
* **Confluence Publishing:** Directly push the AI-generated Enterprise Test Plans to your Atlassian Confluence spaces with a single click via native markdown-to-html conversion. 
* **Secure UI Configuration:** Enter your LLM and Jira credentials right in the React Setup Wizard, which automatically synchronizes securely into your local `.env` backend file.
* **Persistent History & Session Management:** Entire wizard states, previously generated plans, and fetched issue states are securely persisted in browser `localStorage`.
* **Standardized Fortune 500 Templates:** Test plans are structured robustly, ensuring absolute consistency across all enterprise projects.
* **Premium Enterprise UI/UX:** Built with React, featuring a sleek, responsive interface with a corporate "Midnight Blue, Teal, and Silver Gray" palette with full **Light and Dark Mode** support.
* **Export and Share:** Easily copy the generated test plan, print it, export it as a Markdown (`.md`) file, or immediately publish it.

## 🛠️ Technology Stack

* **Frontend:** React, Vite, CSS (Custom Design System with CSS Variables)
* **Icons:** Lucide React
* **State Management:** React Context API + `useReducer`
* **Architecture Pattern:** B.L.A.S.T. (Blueprint, Link, Architect, Stylize, Trigger) / A.N.T. 3-Layer Architecture.

## 🎨 Design System

The application features a premium enterprise SaaS design tailored for reliability and trust:
* **Midnight Blue** (`#0F172A`) - Primary dark background / sidebar color.
* **Teal** (`#14B8A6`) - Primary accent color for actions and active states.
* **Silver Gray** (`#CBD5E1`) - Secondary text and subtle borders.
* **White** (`#FFFFFF`) - Clean surfaces in light mode.

## ⚙️ Getting Started

### Prerequisites
* Node.js (v18+)
* npm or yarn

### Installation & Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the local URL (usually `http://localhost:5173`).

## 🗺️ How to Use the Test Planning Wizard

The core of the application is a 4-step wizard:

1. **Setup:** Add your Jira connection (requires URL, Email, and API Token) and configure your preferred LLM provider (Ollama, Groq, Grok). Use the "Test Connection" buttons to verify your credentials.
2. **Fetch Issues:** Enter your Project Key (e.g., `VWOAPP`) and optionally specify a Sprint version. Add any additional context for the AI. The agent will fetch the relevant user stories.
3. **Review:** Select the specific issues you want included in the test plan. You can expand each issue to review its description and acceptance criteria. Click "Generate Test Plan" when ready.
4. **Test Plan:** The AI will generate a comprehensive test plan spanning 12 detailed sections. You can expand/collapse sections, copy the content, or export it to Markdown.

## 🏗️ Architecture Notes

This project strictly adheres to the **A.N.T. 3-Layer Architecture**:
* **Architecture:** Clear separation of concerns, standardized data schemas (defined in `gemini.md`).
* **Navigation:** React component structure and context-driven routing.
* **Tools:** Independent, mockable data fetchers and LLM connectors for deterministic results.
