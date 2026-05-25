# Project 09: AI Agents (n8n)

This repository contains modern, low-code AI Agent workflows designed for **n8n** that automate common software testing and QA tasks in **Jira Software**. By leveraging LangChain-powered nodes inside n8n, these workflows create intelligent assistants that communicate via chat, retain context, and interact directly with Jira.

## 🚀 Workflows Included

### 1. Jira Bug/Issue Creator Agent (`AI_02_JIRA_AIAGENT.json`)
This workflow sets up an interactive chat interface where users can request the AI agent to report and log new bugs or issues directly into Jira Software.
* **Trigger**: LangChain Chat Trigger (chat UI within n8n).
* **AI Brain**: Groq LLM (e.g. `openai/gpt-oss-120b` or compatible model).
* **Memory**: `Simple Memory` (LangChain Memory Buffer Window, retaining the last 10 interactions for conversational context).
* **Action Tool**: LangChain Jira Tool. It automatically extracts details (Summary, Description) from the user's natural language input and logs the issue under the project `AIAvengers` as a `Bug`.

---

### 2. Jira Ticket Reader & Test Plan Generator (`AI_02_JIRA_AIAGENT_READPRD_TESTPLAN.json`)
This workflow allows QA engineers to supply a Jira Ticket/Story/Bug ID through the chat window. The AI agent automatically reads the ticket details and writes a comprehensive test plan tailored to the ticket requirements.
* **Trigger**: LangChain Chat Trigger.
* **AI Brain**: Groq LLM.
* **Memory**: `Simple Memory` (retaining the last 10 messages).
* **Action Tool**: LangChain Jira Tool configured to perform a `get` operation using the `Issue_Key` parsed from conversation.
* **Output**: A structured test plan built on the retrieved Jira ticket details.

---

## 🛠️ Tech Stack & Integrations

* **n8n**: Workflow automation platform supporting LangChain nodes.
* **LangChain Integration**:
  * **LangChain Agent**: Orchestrates decision-making and tool selection.
  * **Groq Chat Model**: Serves as the language model brain for logic and text generation.
  * **Memory Buffer Window**: Maintains local state for multi-turn conversations.
* **Jira Software Cloud**: Source of truth for tickets and target system for bug filing.

---

## 📖 How to Use

1. **Import to n8n**:
   * Open your n8n workspace.
   * Create a new workflow.
   * Click the top-right menu and choose **Import from File**.
   * Select either `AI_02_JIRA_AIAGENT.json` or `AI_02_JIRA_AIAGENT_READPRD_TESTPLAN.json`.

2. **Configure Credentials**:
   * **Groq API**: Ensure you configure your Groq account credential with a valid API key.
   * **Jira Software Cloud API**: Connect your Jira account with API tokens, specifying the target domain/instance.

3. **Start the Agent**:
   * Turn the workflow active or run it manually.
   * Open the chat interface and start pair testing with your automated QA agent!
