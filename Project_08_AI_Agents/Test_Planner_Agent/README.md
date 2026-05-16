# STLC360 AI - Intelligent Test Planning Agent

**STLC360 AI** is an enterprise-grade intelligent Software Testing Life Cycle management platform designed for Fortune 500 consulting style reliability. This project serves as a comprehensive Test Planning Agent, enabling QA teams, SDETs, and testing professionals to automatically generate professional test plans from project requirements and Jira user stories.

## 🚀 Key Features

* **Intelligent Test Planning:** Connects to powerful Large Language Models (LLMs) including Ollama (local), Groq, and Grok to analyze user stories and generate rich, detailed test plans.
* **Standardized Fortune 500 Templates:** Test plans are generated using a robust, 12-section template (covering Scope, Inclusions, Strategy, Defect Reporting, and Entry/Exit Criteria) ensuring consistency across all enterprise projects.
* **Dynamic Integrations:** Connects directly to project management and test management tools. Currently supports **Jira**, with upcoming support for Azure DevOps (ADO), TestRail, Zephyr, and Xray.
* **AI-Powered Analysis:** Identifies edge cases, boundary conditions, and acceptance criteria automatically from the context provided in your user stories.
* **Premium Enterprise UI/UX:** Built with React, featuring a sleek, responsive, and accessible interface. Uses a corporate "Midnight Blue, Teal, and Silver Gray" palette with full **Light and Dark Mode** support.
* **Export and Share:** Easily copy the generated test plan to your clipboard, print it, or export it as a Markdown (`.md`) file to embed in your documentation or Confluence pages.

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
