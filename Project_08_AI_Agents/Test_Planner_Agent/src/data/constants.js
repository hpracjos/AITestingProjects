/* The test plan template structure extracted from the DOCX file.
   This defines the 12 sections that make up a complete test plan. */

export const TEST_PLAN_SECTIONS = [
  {
    key: 'objective',
    title: 'Objective',
    description: 'Define the goal and purpose of this test plan',
  },
  {
    key: 'scope',
    title: 'Scope',
    description: 'What types of testing are covered (functional, performance, security, etc.)',
  },
  {
    key: 'inclusions',
    title: 'Inclusions',
    description: 'Detailed test areas: CRUD operations, boundary, concurrency, validation, auth, etc.',
  },
  {
    key: 'testEnvironments',
    title: 'Test Environments',
    description: 'OS, browsers, devices, network, hardware, security, access permissions',
  },
  {
    key: 'defectReporting',
    title: 'Defect Reporting Procedure',
    description: 'Criteria, steps, triage, tools, roles, communication, metrics',
  },
  {
    key: 'testStrategy',
    title: 'Test Strategy',
    description: 'Test design techniques, execution flow, best practices',
  },
  {
    key: 'testSchedule',
    title: 'Test Schedule',
    description: 'Task timeline, sprint durations, milestones',
  },
  {
    key: 'testDeliverables',
    title: 'Test Deliverables',
    description: 'Output artifacts and documentation',
  },
  {
    key: 'entryExitCriteria',
    title: 'Entry and Exit Criteria',
    description: 'Per STLC phase: Requirement Analysis, Test Execution, Test Closure',
  },
  {
    key: 'tools',
    title: 'Tools',
    description: 'Testing tools and software to be used',
  },
  {
    key: 'risksAndMitigations',
    title: 'Risks and Mitigations',
    description: 'Possible risks and mitigation strategies',
  },
  {
    key: 'approvals',
    title: 'Approvals',
    description: 'Documents requiring client approval',
  },
];

/* Platform integration cards for the Setup page */
export const PLATFORM_INTEGRATIONS = [
  {
    type: 'jira',
    name: 'Jira',
    icon: '🔵',
    status: 'available',
    description: 'Import requirements and user stories from Atlassian Jira',
    features: ['Requirements import', 'User stories', 'Acceptance criteria'],
  },
  {
    type: 'testrail',
    name: 'TestRail',
    icon: '🟩',
    status: 'coming_soon',
    description: 'Import existing test cases and test suites from TestRail',
    features: ['Test cases', 'Test suites', 'Test runs'],
  },
  {
    type: 'zephyr',
    name: 'Zephyr',
    icon: '🌀',
    status: 'coming_soon',
    description: 'Sync test cases from Zephyr Scale or Zephyr Squad',
    features: ['Test cases', 'Test cycles', 'Test execution'],
  },
  {
    type: 'xray',
    name: 'Xray',
    icon: '✖️',
    status: 'coming_soon',
    description: 'Import test cases and test plans from Xray',
    features: ['Test cases', 'Test plans', 'Test execution'],
  },
  {
    type: 'qase',
    name: 'Qase',
    icon: '📋',
    status: 'coming_soon',
    description: 'Import test cases and test plans from Qase',
    features: ['Test cases', 'Test suites', 'Test runs'],
  },
  {
    type: 'ado',
    name: 'Azure DevOps',
    icon: '☁️',
    status: 'coming_soon',
    description: 'Import test plans and test cases from Azure DevOps',
    features: ['Test plans', 'Test cases', 'Work items'],
  },
];

/* LLM provider options */
export const LLM_PROVIDERS = [
  {
    provider: 'ollama',
    name: 'Ollama',
    icon: '🦙',
    description: 'Run LLMs locally with Ollama',
    defaultUrl: 'http://localhost:11434',
    models: ['llama3', 'llama3.1', 'mistral', 'codellama', 'gemma2', 'phi3'],
  },
  {
    provider: 'groq',
    name: 'GROQ',
    icon: '⚡',
    description: 'Ultra-fast inference with Groq Cloud',
    defaultUrl: 'https://api.groq.com/openai/v1',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
  },
  {
    provider: 'grok',
    name: 'Grok',
    icon: '🤖',
    description: 'xAI Grok language model',
    defaultUrl: 'https://api.x.ai/v1',
    models: ['grok-3', 'grok-3-mini'],
  },
  {
    provider: 'openai',
    name: 'OpenAI',
    icon: '🧠',
    description: 'GPT models from OpenAI',
    defaultUrl: 'https://api.openai.com/v1',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'],
  },
];
