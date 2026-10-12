import React, { useEffect, useState } from 'react';
import './styles/tokens.css';
import './styles/global.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/netflix.css';
import './styles/staged-simulator.css';
import './styles/glossy.css';
import './styles/soft-ui.css';

import { useSimulation } from './hooks/useSimulation.js';
import NetflixNavbar from './components/NetflixNavbar.jsx';
import TopTelemetryBar from './components/TopTelemetryBar.jsx';
import Home from './pages/Home.jsx';
import StagedSimulator from './components/StagedSimulator.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ScenariosPage from './pages/ScenariosPage.jsx';
import FrameworkPage from './pages/FrameworkPage.jsx';
import ReadinessPage from './pages/ReadinessPage.jsx';
import About from './pages/About.jsx';
import DebriefModal from './components/DebriefModal.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import Toast from './components/Toast.jsx';

export default function App({ initialTab = 'home', simulatorViewMode = 'staged' }) {
  const {
    scenariosList,
    currentScenarioId,
    scenario,
    currentScene,
    currentState,
    events,
    actionHistory,
    behavioralCounts,
    feedback,
    lastDeltas,
    isProcessing,
    lastFeedbackSource,
    errorMessage,
    retryLastFreeform,
    debrief,
    isDebriefOpen,
    setIsDebriefOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    activeTab,
    setActiveTab,
    isMuted,
    toggleMute,
    testSound,
    toasts,
    dismissToast,
    backendStatus,
    configStatus,
    initializeScenario,
    handleSelectD,
    handleFreeformSubmit,
    resetSimulation,
    clearPreferences
  } = useSimulation();

  const [currentTab, setCurrentTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState(simulatorViewMode); // 'staged' (guided progressive workflow) or 'console' (full incident room)

  const isTensionCritical = currentState.tension >= 70;

  useEffect(() => {
    const supportsFinePointer = window.matchMedia?.('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (!supportsFinePointer || prefersReducedMotion) return undefined;

    let targetX = 0;
    let targetY = 0;
    let pointerX = 0;
    let pointerY = 0;
    let animationFrameId = null;

    const animateCursorPosition = () => {
      pointerX += (targetX - pointerX) * 0.18;
      pointerY += (targetY - pointerY) * 0.18;
      document.documentElement.style.setProperty('--pointer-x', `${pointerX}px`);
      document.documentElement.style.setProperty('--pointer-y', `${pointerY}px`);

      if (Math.abs(targetX - pointerX) < 0.5 && Math.abs(targetY - pointerY) < 0.5) {
        pointerX = targetX;
        pointerY = targetY;
        document.documentElement.style.setProperty('--pointer-x', `${pointerX}px`);
        document.documentElement.style.setProperty('--pointer-y', `${pointerY}px`);
        animationFrameId = null;
        return;
      }

      animationFrameId = window.requestAnimationFrame(animateCursorPosition);
    };

    const updateCursorPosition = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;

      if (animationFrameId === null) {
        pointerX = targetX;
        pointerY = targetY;
        animationFrameId = window.requestAnimationFrame(animateCursorPosition);
      }
    };

    window.addEventListener('pointermove', updateCursorPosition, { passive: true });
    return () => {
      window.removeEventListener('pointermove', updateCursorPosition);
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  useEffect(() => {
    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      return undefined;
    }

    const revealTargets = document.querySelectorAll(
      '.netflix-card, .d-module-card, .netflix-stats-banner, .netflix-row-wrap, .netflix-faq-section'
    );
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

    revealTargets.forEach((element, index) => {
      element.classList.add('scroll-reveal');
      element.classList.remove('is-visible');
      element.style.setProperty('--reveal-delay', `${Math.min(index % 5, 4) * 55}ms`);
      element.style.setProperty('--reveal-x', index % 2 === 0 ? '-28px' : '28px');
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [currentTab]);

  const handleLaunchScenarioFromAnywhere = (scenarioId) => {
    initializeScenario(scenarioId);
    setCurrentTab('simulator');
  };

  return (
    <div className={`app-container ${isTensionCritical ? 'tension-critical' : ''}`}>
      {/* Netflix Top Navigation Bar */}
      <NetflixNavbar
        activeTab={currentTab}
        onSelectTab={setCurrentTab}
        tension={currentState.tension}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onOpenSettings={() => setIsSettingsOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* When in simulator mode, allow toggling between Guided Progressive Workflow and Tactical Incident Console */}
      {currentTab === 'simulator' && (
        <div
          style={{
            background: '#ffffff',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '10px 36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-sans)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: 500 }}>Active Scenario:</span>
            <strong style={{ color: 'var(--physio-plum)' }}>{scenario?.title}</strong>
            <span className="status-pill emerald" style={{ fontSize: '11px', borderRadius: '9999px' }}>
              Engine Live
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Workflow:</span>
            <button
              type="button"
              className={`physio-subnav-pill ${viewMode === 'staged' ? 'active' : ''}`}
              style={{ padding: '4px 14px', fontSize: '12px' }}
              onClick={() => setViewMode('staged')}
            >
              Step-by-Step Flow
            </button>
            <button
              type="button"
              className={`physio-subnav-pill ${viewMode === 'console' ? 'active' : ''}`}
              style={{ padding: '4px 14px', fontSize: '12px' }}
              onClick={() => setViewMode('console')}
            >
              Incident Console
            </button>
          </div>
        </div>
      )}

      {/* Page Routing */}
      {currentTab === 'home' && (
        <Home
          onPlayScenario={handleLaunchScenarioFromAnywhere}
          onNavigateTab={setCurrentTab}
        />
      )}

      {currentTab === 'simulator' && (
        viewMode === 'staged' ? (
          <StagedSimulator
            scenario={scenario}
            currentScene={currentScene}
            currentState={currentState}
            events={events}
            actionHistory={actionHistory}
            behavioralCounts={behavioralCounts}
            feedback={feedback}
            lastDeltas={lastDeltas}
            isProcessing={isProcessing}
            onSelectD={handleSelectD}
            onSubmitFreeform={handleFreeformSubmit}
            onSelectScenario={initializeScenario}
            onResetSimulation={resetSimulation}
            debrief={debrief}
            isEnding={Boolean(currentScene?.isEnding)}
            onNavigateHome={() => setCurrentTab('home')}
          />
        ) : (
          <Dashboard
            scenario={scenario}
            currentScene={currentScene}
            currentState={currentState}
            events={events}
            actionHistory={actionHistory}
            behavioralCounts={behavioralCounts}
            feedback={feedback}
            lastDeltas={lastDeltas}
            isProcessing={isProcessing}
            onSelectD={handleSelectD}
            onSubmitFreeform={handleFreeformSubmit}
            lastFeedbackSource={lastFeedbackSource}
            errorMessage={errorMessage}
            onRetry={retryLastFreeform}
          />
        )
      )}

      {currentTab === 'scenarios' && (
        <ScenariosPage
          onPlayScenario={handleLaunchScenarioFromAnywhere}
          searchQuery={searchQuery}
        />
      )}

      {currentTab === 'framework' && (
        <FrameworkPage
          onPlayScenario={handleLaunchScenarioFromAnywhere}
        />
      )}

      {currentTab === 'readiness' && (
        <ReadinessPage
          actionHistory={actionHistory}
          behavioralCounts={behavioralCounts}
          debrief={debrief}
          onLaunchSimulator={() => setCurrentTab('simulator')}
        />
      )}

      {currentTab === 'about' && (
        <About onBackToSimulator={() => setCurrentTab('simulator')} />
      )}

      {/* Outcome & Debrief Modal (Accessible for Full Console mode or manual trigger) */}
      <DebriefModal
        isOpen={isDebriefOpen}
        debrief={debrief}
        onRestart={() => {
          setIsDebriefOpen(false);
          initializeScenario(currentScenarioId);
          setCurrentTab('simulator');
        }}
        onSelectAnotherScenario={() => {
          setIsDebriefOpen(false);
          const nextId =
            currentScenarioId === 'metro'
              ? 'campus'
              : currentScenarioId === 'campus'
              ? 'bus_stop'
              : 'metro';
          initializeScenario(nextId);
          setCurrentTab('simulator');
        }}
        onClose={() => setIsDebriefOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        config={configStatus}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onTestSound={testSound}
        onClearPreferences={clearPreferences}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
