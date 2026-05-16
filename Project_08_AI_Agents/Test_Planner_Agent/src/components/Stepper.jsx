import './Stepper.css';
import { Check } from 'lucide-react';

const steps = [
  { num: 1, label: 'Setup' },
  { num: 2, label: 'Fetch Issues' },
  { num: 3, label: 'Review' },
  { num: 4, label: 'Test Plan' },
];

export default function Stepper({ currentStep, onStepClick }) {
  return (
    <div className="stepper">
      {steps.map((step, index) => {
        const isActive = step.num === currentStep;
        const isCompleted = step.num < currentStep;

        return (
          <button
            key={step.num}
            className={`stepper-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
            onClick={() => {
              if (isCompleted && onStepClick) onStepClick(step.num);
            }}
            disabled={!isCompleted && !isActive}
          >
            <div className="stepper-indicator">
              {isCompleted ? <Check size={14} strokeWidth={3} /> : step.num}
            </div>
            <span className="stepper-label">{step.label}</span>
            {index < steps.length - 1 && <div className="stepper-connector" />}
          </button>
        );
      })}
    </div>
  );
}
