import { Target, FileCheck, BrainCircuit, ShieldCheck, Zap, BarChart } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard({ onNavigate }) {
  const features = [
    {
      icon: Target,
      title: "Intelligent Test Planning",
      description: "Auto-generate comprehensive test plans from Jira user stories using advanced LLMs (Ollama, Groq, Grok)."
    },
    {
      icon: FileCheck,
      title: "Standardized Templates",
      description: "Ensure consistency across all projects with Fortune 500-grade standardized test plan templates."
    },
    {
      icon: BrainCircuit,
      title: "AI-Powered Analysis",
      description: "Leverage AI to identify edge cases, boundary conditions, and potential security risks automatically."
    },
    {
      icon: ShieldCheck,
      title: "Enterprise Reliability",
      description: "Built for scale with robust integrations to your existing CI/CD and test management ecosystems."
    },
    {
      icon: Zap,
      title: "Dynamic Integrations",
      description: "Connect on the fly to Jira, ADO, X-Ray, Zephyr, and TestRail to keep your test artifacts perfectly synced."
    },
    {
      icon: BarChart,
      title: "Actionable Insights",
      description: "Track test coverage, defect density, and readiness metrics across all your active sprints and releases."
    }
  ];

  return (
    <div className="dashboard animate-fade-in">
      <div className="dashboard-header">
        <h1>Welcome to STLC360 AI</h1>
        <p>Enterprise-Grade Intelligent Software Testing Life Cycle Management</p>
      </div>

      <div className="dashboard-hero card">
        <div className="hero-content">
          <h2>Transform your QA Strategy</h2>
          <p>STLC360 AI is your unified platform for modern software testing. We combine industry best practices with cutting-edge artificial intelligence to streamline test planning, execution, and reporting.</p>
          <button className="btn btn-primary btn-lg mt-lg" onClick={() => onNavigate('test-planner')}>
            Launch Test Planning Agent
          </button>
        </div>
      </div>

      <h3 className="section-title mt-2xl mb-lg">Platform Capabilities</h3>
      <div className="dashboard-grid">
        {features.map((feat, i) => {
          const Icon = feat.icon;
          return (
            <div key={i} className="card feature-card">
              <div className="feature-icon">
                <Icon size={24} />
              </div>
              <h4>{feat.title}</h4>
              <p className="text-sm text-muted">{feat.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
