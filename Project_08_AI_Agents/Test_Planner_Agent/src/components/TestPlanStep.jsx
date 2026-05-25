import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TEST_PLAN_SECTIONS } from '../data/constants';
import {
  FileText,
  Download,
  Copy,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Check,
  Printer,
  Clock,
  Share2,
} from 'lucide-react';
import './TestPlanStep.css';

export default function TestPlanStep() {
  const { state, dispatch, showToast } = useApp();
  const [expandedSections, setExpandedSections] = useState(
    TEST_PLAN_SECTIONS.map(s => s.key)
  );
  const [copied, setCopied] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const plan = state.testPlan;

  const toggleSection = (key) => {
    setExpandedSections(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  const expandAll = () => setExpandedSections(TEST_PLAN_SECTIONS.map(s => s.key));
  const collapseAll = () => setExpandedSections([]);

  const handlePublish = async () => {
    if (!plan) return;
    setPublishing(true);
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: plan.title,
          spaceKey: state.fetchForm.projectKey || 'VMOAPP'
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to publish to Confluence');
      
      showToast(`Successfully published to Confluence!`, 'success');
      window.open(data.url, '_blank');
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    } finally {
      setPublishing(false);
    }
  };

  const handleCopyAll = () => {
    if (!plan) return;
    let text = `# ${plan.title}\n\n`;
    text += `Generated: ${new Date(plan.generatedAt).toLocaleString()}\n`;
    text += `Issues covered: ${plan.issueCount}\n\n---\n\n`;

    if (plan.isRawMarkdown) {
      text += plan.rawMarkdown;
    } else {
      TEST_PLAN_SECTIONS.forEach(section => {
        const content = plan.sections[section.key];
        if (content) {
          text += `## ${section.title}\n\n${content}\n\n---\n\n`;
        }
      });
    }

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      showToast('Test plan copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleExportMarkdown = () => {
    if (!plan) return;
    let text = `# ${plan.title}\n\n`;
    text += `**Generated:** ${new Date(plan.generatedAt).toLocaleString()}\n\n`;
    text += `**Issues Covered:** ${plan.issueCount}\n\n---\n\n`;

    if (plan.isRawMarkdown) {
      text += plan.rawMarkdown;
    } else {
      TEST_PLAN_SECTIONS.forEach(section => {
        const content = plan.sections[section.key];
        if (content) {
          text += `## ${section.title}\n\n${content}\n\n---\n\n`;
        }
      });
    }

    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${plan.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Test plan exported as Markdown!', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  if (!plan) {
    return (
      <div className="testplan-step animate-fade-in">
        <div className="card testplan-empty">
          <FileText size={48} className="text-muted" />
          <h3>No test plan generated yet</h3>
          <p className="text-sm text-muted">Complete the previous steps to generate your test plan</p>
          <button
            className="btn btn-primary mt-xl"
            onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })}
          >
            Start from Setup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="testplan-step animate-fade-in">
      {/* Plan Header */}
      <div className="card testplan-header-card mb-xl">
        <div className="testplan-title-row">
          <div>
            <h2>{plan.title}</h2>
            <div className="testplan-meta">
              <span className="testplan-meta-item">
                <Clock size={14} />
                {new Date(plan.generatedAt).toLocaleString()}
              </span>
              <span className="testplan-meta-item">
                <FileText size={14} />
                {plan.issueCount} issues covered
              </span>
              <span className="testplan-meta-item">
                <Check size={14} />
                {TEST_PLAN_SECTIONS.length} sections
              </span>
            </div>
          </div>
          <div className="testplan-actions">
            <button
              className="btn btn-outline btn-sm"
              onClick={handlePublish}
              disabled={publishing}
              title="Publish to Atlassian Confluence"
              style={{ color: '#0052CC', borderColor: '#0052CC' }}
            >
              {publishing ? <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : <Share2 size={14} />}
              {publishing ? 'Publishing...' : 'Confluence'}
            </button>
            <button className="btn btn-outline btn-sm" onClick={handleCopyAll}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy All'}
            </button>
            <button className="btn btn-outline btn-sm" onClick={handleExportMarkdown}>
              <Download size={14} /> Export .md
            </button>
            <button className="btn btn-outline btn-sm" onClick={handlePrint}>
              <Printer size={14} /> Print
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => dispatch({ type: 'RESET_WIZARD' })}
            >
              <RefreshCw size={14} /> New Plan
            </button>
          </div>
        </div>
      </div>

      {/* Expand/Collapse controls */}
      <div className="testplan-controls mb-lg">
        <button className="btn btn-ghost btn-sm" onClick={expandAll}>Expand All</button>
        <button className="btn btn-ghost btn-sm" onClick={collapseAll}>Collapse All</button>
      </div>

      {/* Plan Sections */}
      <div className="testplan-sections">
        {plan.isRawMarkdown ? (
          <div className="testplan-section card">
            <div className="testplan-section-content">
              <div className="testplan-section-body">
                {plan.rawMarkdown.split('\n').map((line, i) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <h4 key={i} className="section-subheading">{line.replace(/\*\*/g, '')}</h4>;
                  }
                  if (line.startsWith('# ')) {
                    return <h2 key={i}>{line.replace(/^#\s*/, '')}</h2>;
                  }
                  if (line.startsWith('## ')) {
                    return <h3 key={i}>{line.replace(/^##\s*/, '')}</h3>;
                  }
                  if (line.startsWith('### ')) {
                    return <h4 key={i}>{line.replace(/^###\s*/, '')}</h4>;
                  }
                  if (line.startsWith('| ')) {
                    return <code key={i} className="section-table-row">{line}</code>;
                  }
                  if (line.startsWith('• ') || line.startsWith('- ')) {
                    return <li key={i} className="section-list-item">{line.replace(/^[•-]\s*/, '')}</li>;
                  }
                  if (line.match(/^\d+\./)) {
                    return <li key={i} className="section-list-item numbered">{line}</li>;
                  }
                  if (line === '---') {
                    return <hr key={i} className="divider" />;
                  }
                  if (line.trim() === '') return <br key={i} />;
                  return <p key={i} className="section-paragraph">{line.replace(/\*\*(.*?)\*\*/g, '$1')}</p>;
                })}
              </div>
            </div>
          </div>
        ) : (
          TEST_PLAN_SECTIONS.map((section, index) => {
            const content = plan.sections[section.key];
            const isExpanded = expandedSections.includes(section.key);

            return (
              <div key={section.key} className="testplan-section card">
                <button
                  className="testplan-section-header"
                  onClick={() => toggleSection(section.key)}
                >
                  <div className="testplan-section-title">
                    <span className="testplan-section-num">{index + 1}</span>
                    <h3>{section.title}</h3>
                  </div>
                  {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>

                {isExpanded && content && (
                  <div className="testplan-section-content animate-fade-in">
                    <div className="testplan-section-body">
                      {content.split('\n').map((line, i) => {
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return <h4 key={i} className="section-subheading">{line.replace(/\*\*/g, '')}</h4>;
                        }
                        if (line.startsWith('| ')) {
                          return <code key={i} className="section-table-row">{line}</code>;
                        }
                        if (line.startsWith('• ') || line.startsWith('- ')) {
                          return <li key={i} className="section-list-item">{line.replace(/^[•-]\s*/, '')}</li>;
                        }
                        if (line.match(/^\d+\./)) {
                          return <li key={i} className="section-list-item numbered">{line}</li>;
                        }
                        if (line === '---') {
                          return <hr key={i} className="divider" />;
                        }
                        if (line.trim() === '') return <br key={i} />;
                        return <p key={i} className="section-paragraph">{line}</p>;
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
