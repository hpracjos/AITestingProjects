import { useEffect, useState } from 'react';
import { useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Stepper from './components/Stepper';
import SetupStep from './components/SetupStep';
import FetchStep from './components/FetchStep';
import ReviewStep from './components/ReviewStep';
import TestPlanStep from './components/TestPlanStep';
import Dashboard from './components/Dashboard';
import Toast from './components/Toast';
import './App.css';

function App() {
  const { state, dispatch } = useApp();
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' or 'test-planner'

  // Apply theme to document element
  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  const handleStepClick = (step) => {
    // Only allow navigating to completed steps
    if (step < state.currentStep) {
      dispatch({ type: 'SET_STEP', payload: step });
    }
  };

  const renderAgentStep = () => {
    switch (state.currentStep) {
      case 1:
        return <SetupStep />;
      case 2:
        return <FetchStep />;
      case 3:
        return <ReviewStep />;
      case 4:
        return <TestPlanStep />;
      default:
        return <SetupStep />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="app-main">
        <div className="app-container">
          
          {currentView === 'dashboard' ? (
            <Dashboard onNavigate={setCurrentView} />
          ) : (
            <>
              <Header onViewHistory={() => {}} />
              
              {/* Only show stepper for steps 1-4. Step 4 is view mode, but keeps stepper */}
              <div className="mb-3xl">
                <Stepper 
                  currentStep={state.currentStep} 
                  onStepClick={handleStepClick} 
                />
              </div>

              <div className="step-content">
                {renderAgentStep()}
              </div>
            </>
          )}

        </div>
      </main>
      <Toast />
    </div>
  );
}

export default App;
