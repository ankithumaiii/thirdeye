import React, { useState, useEffect } from 'react';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Play,
  RotateCcw,
  Sparkles,
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Users,
  Send,
  Loader2,
  MessageCircle,
  Users2,
  FileCheck2,
  HeartHandshake
} from 'lucide-react';
import { SCENARIOS } from '../data/scenarios.js';

const D_OPTIONS_CONFIG = {
  Distract: {
    name: 'DISTRACT',
    tag: 'Indirect Deflection',
    icon: MessageCircle,
    colorClass: 'cyan',
    explanation: 'Interrupt the situation with everyday questions or social distractions to defuse tension.'
  },
  Delegate: {
    name: 'DELEGATE',
    tag: 'Allied Mobilization',
    icon: Users2,
    colorClass: 'emerald',
    explanation: 'Mobilize staff, drivers, security, or fellow bystanders to intervene collectively.'
  },
  Document: {
    name: 'DOCUMENT',
    tag: 'Verifiable Record',
    icon: FileCheck2,
    colorClass: 'amber',
    explanation: 'Discreetly note timestamps, carriage numbers, and details without provoking conflict.'
  },
  Delay: {
    name: 'DELAY',
    tag: 'Supportive Aftercare',
    icon: HeartHandshake,
    colorClass: 'indigo',
    explanation: 'Check in on the affected individual once the acute encounter passes; restore autonomy.'
  },
  Direct: {
    name: 'DIRECT',
    tag: 'Assertive Boundary',
    icon: AlertTriangle,
    colorClass: 'crimson',
    explanation: 'Firmly state a boundary when reasonably safe. Avoid violent or escalating confrontation.'
  }
};

export default function StagedSimulator({
  scenario,
  currentScene,
  currentState,
  events,
  actionHistory,
  behavioralCounts,
  feedback,
  lastDeltas,
  isProcessing,
  onSelectD,
  onSubmitFreeform,
  onSelectScenario,
  onResetSimulation,
  debrief,
  isEnding,
  onNavigateHome
}) {
  // Simulator progressive stages:
  // 'selection' -> 'briefing' -> 'encounter' -> 'response' -> 'consequence' -> 'debrief'
  // Secondary stage: 'freeform'
  const [stage, setStage] = useState('briefing');
  const [selectedD, setSelectedD] = useState(null);
  const [isInsightOpen, setIsInsightOpen] = useState(false);
  const [freeformDraft, setFreeformDraft] = useState('');

  // Automatically sync to debrief stage when simulation reaches an ending
  useEffect(() => {
    if (isEnding && debrief) {
      setStage('debrief');
    }
  }, [isEnding, debrief]);

  // Stepper progress indicator list
  const steps = [
    { id: 'selection', label: 'Scenario' },
    { id: 'briefing', label: 'Briefing' },
    { id: 'encounter', label: 'Encounter' },
    { id: 'response', label: 'Response' },
    { id: 'consequence', label: 'Consequence' },
    { id: 'debrief', label: 'Debrief' }
  ];

  const getStepStatus = (stepId) => {
    const stageOrder = ['selection', 'briefing', 'encounter', 'response', 'consequence', 'debrief'];
    const currentIdx = stageOrder.indexOf(stage === 'freeform' ? 'response' : stage);
    const stepIdx = stageOrder.indexOf(stepId);

    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'active';
    return 'upcoming';
  };

  const handleStartBriefing = (scenarioId) => {
    onSelectScenario(scenarioId);
    setStage('briefing');
  };

  const handleConfirmDecision = () => {
    if (!selectedD || isProcessing) return;
    onSelectD(selectedD);
    setStage('consequence');
  };

  const handleFreeformSubmit = () => {
    if (!freeformDraft.trim() || isProcessing) return;
    onSubmitFreeform(freeformDraft);
    setFreeformDraft('');
    setStage('consequence');
  };

  const handleContinueEncounter = () => {
    if (isEnding) {
      setStage('debrief');
    } else {
      setSelectedD(null);
      setIsInsightOpen(false);
      setStage('encounter');
    }
  };

  const handleReplayScenario = () => {
    onResetSimulation();
    setSelectedD(null);
    setIsInsightOpen(false);
    setStage('encounter');
  };

  return (
    <div className="staged-simulator-root">
      {/* 1. PERSISTENT PROGRESS STEPPER */}
      <nav className="staged-stepper-wrap" aria-label="Simulation Progressive Workflow">
        <div className="staged-stepper-container">
          {steps.map((step, idx) => {
            const status = getStepStatus(step.id);
            return (
              <React.Fragment key={step.id}>
                <div className={`stepper-step ${status}`}>
                  <span className="stepper-step-number">
                    {status === 'completed' ? '✓' : idx + 1}
                  </span>
                  <span>{step.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <span className="stepper-arrow" aria-hidden="true">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </nav>

      {/* 2. MAIN STAGE CONTENT */}
      <div className="staged-content-container">

        {/* ==============================================================
            STAGE 1: SCENARIO SELECTION
           ============================================================== */}
        {stage === 'selection' && (
          <section className="stage-card" aria-labelledby="stage-select-heading">
            <div className="stage-header-block anim-step-1">
              <span className="stage-eyebrow">
                <Compass size={14} />
                <span>Stage 1 // Scenario Briefing</span>
              </span>
              <h1 id="stage-select-heading" className="stage-title">
                Enter the Simulation
              </h1>
              <p className="stage-description">
                Select a crisis encounter to test non-violent de-escalation instincts.
                Each scenario offers multiple branching paths and realistic consequences.
              </p>
            </div>

            <div className="scenario-selection-grid">
              {SCENARIOS.map((s, idx) => {
                const isSelected = scenario?.id === s.id;
                return (
                  <div
                    key={s.id}
                    className={`scenario-select-card anim-step-${Math.min(idx + 2, 5)} ${isSelected ? 'selected' : ''}`}
                    style={{ animationDelay: `${(idx + 1) * 120}ms` }}
                    onClick={() => handleStartBriefing(s.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="scenario-select-top">
                      <div className="scenario-select-icon">
                        <Shield size={22} />
                      </div>
                      <span className="status-pill subtle font-mono">
                        Tension: {s.initialState.tension}%
                      </span>
                    </div>

                    <h2 className="scenario-select-title">{s.title}</h2>

                    <div className="scenario-select-meta-chips">
                      <span className="status-pill amber" style={{ fontSize: '11px' }}>
                        <MapPin size={11} style={{ display: 'inline', marginRight: '3px' }} />
                        {s.location.split('(')[0]}
                      </span>
                      <span className="status-pill subtle" style={{ fontSize: '11px' }}>
                        <Clock size={11} style={{ display: 'inline', marginRight: '3px' }} />
                        ~3-4 mins
                      </span>
                    </div>

                    <p className="scenario-select-desc">
                      {s.environment}
                    </p>

                    <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
                      <button
                        type="button"
                        className="btn-stage-primary"
                        style={{ width: '100%' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartBriefing(s.id);
                        }}
                      >
                        <span>Select & View Briefing</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ==============================================================
            STAGE 2: SCENARIO BRIEFING
           ============================================================== */}
        {stage === 'briefing' && scenario && (
          <section className="stage-card" aria-labelledby="stage-briefing-heading">
            <div className="stage-header-block anim-step-1">
              <span className="stage-eyebrow">
                <Compass size={14} />
                <span>Stage 2 // Operational Setup</span>
              </span>
              <h1 id="stage-briefing-heading" className="stage-title">
                {scenario.title}
              </h1>
              <p className="stage-description">
                {scenario.subtitle} • {scenario.location}
              </p>
            </div>

            <div className="briefing-box anim-step-2">
              {/* Context Summary */}
              <div className="anim-step-2">
                <h3 style={{ fontSize: '16.5px', fontWeight: 700, color: 'var(--physio-plum)', marginBottom: '8px' }}>
                  Incident Context
                </h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {scenario.scenes[scenario.initialState.sceneId]?.narrative}
                </p>
              </div>

              {/* User's Role Callout */}
              <div className="briefing-role-callout anim-step-3">
                <Users size={20} style={{ color: 'var(--physio-purple-pill)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--physio-plum)', fontSize: '14.5px', display: 'block', marginBottom: '3px' }}>
                    Your Role: Observant Bystander
                  </strong>
                  <span style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                    You are positioned approximately {scenario.bystanderProximity} from the encounter.
                    No one else is currently intervening. Your goal is to support the targeted person and lower acute risk.
                  </span>
                </div>
              </div>

              {/* Safety Reminder */}
              <div className="briefing-safety-reminder anim-step-4">
                <AlertTriangle size={20} style={{ color: 'var(--color-amber)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#92400e', fontSize: '14.5px', display: 'block', marginBottom: '3px' }}>
                    Core De-escalation Mandate
                  </strong>
                  <span style={{ fontSize: '13.5px', color: '#78350f', lineHeight: 1.55 }}>
                    No intervention is universally safe. The victim's autonomy and user safety supersede scores.
                    Avoid aggressive physical confrontation that could escalate into violence.
                  </span>
                </div>
              </div>
            </div>

            {/* Stage Actions */}
            <div className="stage-action-bar anim-step-5">
              <button
                type="button"
                className="btn-stage-secondary"
                onClick={() => setStage('selection')}
              >
                <ArrowLeft size={16} />
                <span>Back to Scenarios</span>
              </button>

              <button
                type="button"
                className="btn-stage-primary"
                onClick={() => setStage('encounter')}
              >
                <span>Start Encounter</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </section>
        )}

        {/* ==============================================================
            STAGE 3: INCIDENT NARRATIVE (ENCOUNTER)
           ============================================================== */}
        {stage === 'encounter' && currentScene && (
          <section className="stage-card" aria-labelledby="stage-encounter-heading">
            <div className="stage-header-block anim-step-1">
              <span className="stage-eyebrow">
                <AlertTriangle size={14} />
                <span>Stage 3 // Active Encounter</span>
              </span>
              <h1 id="stage-encounter-heading" className="stage-title">
                {currentScene.title || 'Unfolding Incident'}
              </h1>
            </div>

            <div className="incident-encounter-panel">
              {/* Metadata chips */}
              <div className="encounter-metadata-bar anim-step-2">
                <div className="encounter-meta-item">
                  <MapPin size={14} style={{ color: 'var(--color-amber)' }} />
                  <span>{scenario ? scenario.location : 'Transit Sector'}</span>
                </div>

                <div className="encounter-meta-item">
                  <Users size={14} style={{ color: 'var(--color-cyan)' }} />
                  <span>Proximity: {scenario ? scenario.bystanderProximity : '4 meters'}</span>
                </div>

                <div className="encounter-meta-item font-mono">
                  <span>Current Tension:</span>
                  <strong style={{ color: currentState.tension >= 70 ? 'var(--color-crimson)' : currentState.tension >= 35 ? 'var(--color-amber)' : 'var(--color-emerald)' }}>
                    {currentState.tension}%
                  </strong>
                </div>
              </div>

              {/* Large, Readable Narrative Text */}
              <div className="encounter-narrative-content anim-step-3">
                {currentScene.narrative}
              </div>
            </div>

            {/* Stage Action */}
            <div className="stage-action-bar anim-step-4" style={{ justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn-stage-primary"
                style={{ fontSize: '15px', padding: '13px 34px' }}
                onClick={() => setStage('response')}
              >
                <span>Choose Your Response</span>
                <ArrowRight size={17} />
              </button>
            </div>
          </section>
        )}

        {/* ==============================================================
            STAGE 4: INTERVENTION CHOICE (5 Ds SELECTION - ONE BY ONE)
           ============================================================== */}
        {stage === 'response' && currentScene && (
          <section className="stage-card" aria-labelledby="stage-response-heading">
            <div className="stage-header-block anim-step-1">
              <span className="stage-eyebrow">
                <Shield size={14} />
                <span>Stage 4 // Tactical Decision</span>
              </span>
              <h1 id="stage-response-heading" className="stage-title">
                What would you do?
              </h1>
              <p className="stage-description">
                Choose an intervention that prioritizes safety in this situation. Select an option to review its details before confirming.
              </p>
            </div>

            {/* 5-D Options Grid - ANIMATED ONE BY ONE */}
            <div className="decision-options-grid" role="radiogroup" aria-label="5 Ds Intervention Options">
              {Object.entries(D_OPTIONS_CONFIG).map(([dKey, config], index) => {
                const Icon = config.icon;
                const specificOption = currentScene.options ? currentScene.options[dKey] : null;
                const contextualExample =
                  specificOption?.label ||
                  specificOption?.actionText ||
                  scenario?.contextLabels?.[dKey] ||
                  `Apply ${config.name} response`;

                const isSelected = selectedD === dKey;

                return (
                  <div
                    key={dKey}
                    id={`btn-intervention-${dKey.toLowerCase()}`}
                    className={`decision-option-card anim-step-${Math.min(index + 2, 6)} ${isSelected ? 'selected' : ''}`}
                    style={{ animationDelay: `${(index + 1) * 110}ms` }}
                    onClick={() => setSelectedD(dKey)}
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={0}
                  >
                    <div className="decision-card-header">
                      <div className="decision-card-name-wrap">
                        <div
                          className="decision-card-icon"
                          style={{
                            background: `var(--color-${config.colorClass}-bg)`,
                            color: `var(--color-${config.colorClass})`
                          }}
                        >
                          <Icon size={18} />
                        </div>
                        <span className="decision-card-name">{config.name}</span>
                      </div>
                      <span className="status-pill subtle font-mono" style={{ fontSize: '10px' }}>
                        {config.tag}
                      </span>
                    </div>

                    <p className="decision-card-explanation">{config.explanation}</p>

                    <div className="decision-card-example">
                      "{contextualExample}"
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Bar */}
            <div className="stage-action-bar anim-step-6" style={{ animationDelay: '680ms' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-stage-secondary"
                  onClick={() => setStage('encounter')}
                >
                  <ArrowLeft size={15} />
                  <span>Review Scene</span>
                </button>

                <button
                  type="button"
                  className="btn-stage-secondary"
                  style={{ color: 'var(--physio-purple-pill)', borderColor: 'var(--color-indigo-border)' }}
                  onClick={() => setStage('freeform')}
                >
                  <Sparkles size={15} />
                  <span>Try Your Own Response</span>
                </button>
              </div>

              <button
                type="button"
                className="btn-stage-primary"
                disabled={!selectedD || isProcessing}
                onClick={handleConfirmDecision}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={16} className="spin-icon" />
                    <span>Evaluating...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Response {selectedD ? `[${selectedD}]` : ''}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </section>
        )}

        {/* ==============================================================
            STAGE 5: CONSEQUENCE REVEAL (ONE BY ONE)
           ============================================================== */}
        {stage === 'consequence' && (
          <section className="stage-card" aria-labelledby="stage-consequence-heading">
            <div className="stage-header-block anim-step-1">
              <span className="stage-eyebrow">
                <CheckCircle2 size={14} />
                <span>Stage 5 // Simulated Outcome</span>
              </span>
              <h1 id="stage-consequence-heading" className="stage-title">
                {isEnding ? 'Scenario Concluded' : 'Simulated Consequence'}
              </h1>
              {feedback?.recognizedD && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <span className="status-pill emerald">
                    Intervention Applied: {feedback.recognizedD}
                  </span>
                  {feedback.source && (
                    <span className="status-pill subtle font-mono" style={{ fontSize: '10px' }}>
                      Source: {feedback.source === 'gemini' ? 'Gemini AI' : 'Deterministic Engine'}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Consequence Narrative */}
            <div className="consequence-narrative-card anim-step-2">
              {feedback?.consequenceNarrative || currentScene?.narrative || 'The situation shifts in response to your action.'}
            </div>

            {/* Updated Telemetry Metrics Grid */}
            <div className="consequence-telemetry-grid anim-step-3">
              {/* Crisis Tension */}
              <div className="telemetry-metric-card">
                <div className="telemetry-card-header">
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Crisis Tension
                  </span>
                  {lastDeltas?.tensionDelta !== undefined && (
                    <span className={`status-pill ${lastDeltas.tensionDelta > 0 ? 'crimson' : 'emerald'}`}>
                      {lastDeltas.tensionDelta > 0 ? `+${lastDeltas.tensionDelta}%` : `${lastDeltas.tensionDelta}%`}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: currentState.tension >= 70 ? 'var(--color-crimson)' : currentState.tension >= 35 ? 'var(--color-amber)' : 'var(--color-emerald)' }}>
                  {currentState.tension}%
                </div>
                <div className="metric-bar-track">
                  <div
                    className="metric-bar-fill"
                    style={{
                      width: `${currentState.tension}%`,
                      backgroundColor: currentState.tension >= 70 ? 'var(--color-crimson)' : currentState.tension >= 35 ? 'var(--color-amber)' : 'var(--color-emerald)'
                    }}
                  />
                </div>
              </div>

              {/* Target Safety */}
              <div className="telemetry-metric-card">
                <div className="telemetry-card-header">
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Victim Safety Index
                  </span>
                  {lastDeltas?.safetyDelta !== undefined && (
                    <span className={`status-pill ${lastDeltas.safetyDelta >= 0 ? 'emerald' : 'crimson'}`}>
                      {lastDeltas.safetyDelta >= 0 ? `+${lastDeltas.safetyDelta}%` : `${lastDeltas.safetyDelta}%`}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-emerald)' }}>
                  {currentState.victimSafetyIndex}%
                </div>
                <div className="metric-bar-track">
                  <div
                    className="metric-bar-fill"
                    style={{
                      width: `${currentState.victimSafetyIndex}%`,
                      backgroundColor: 'var(--color-emerald)'
                    }}
                  />
                </div>
              </div>

              {/* Bystander Exposure */}
              <div className="telemetry-metric-card">
                <div className="telemetry-card-header">
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Bystander Exposure
                  </span>
                  {lastDeltas?.exposureDelta !== undefined && (
                    <span className={`status-pill ${lastDeltas.exposureDelta > 0 ? 'amber' : 'emerald'}`}>
                      {lastDeltas.exposureDelta > 0 ? `+${lastDeltas.exposureDelta}%` : `${lastDeltas.exposureDelta}%`}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-amber)' }}>
                  {currentState.bystanderExposure}%
                </div>
                <div className="metric-bar-track">
                  <div
                    className="metric-bar-fill"
                    style={{
                      width: `${currentState.bystanderExposure}%`,
                      backgroundColor: 'var(--color-amber)'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Optional Expandable Tactical Insight Accordion */}
            <div className="tactical-insight-accordion anim-step-4">
              <button
                type="button"
                className="tactical-insight-trigger"
                onClick={() => setIsInsightOpen(!isInsightOpen)}
                aria-expanded={isInsightOpen}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HelpCircle size={17} style={{ color: 'var(--physio-purple-pill)' }} />
                  <span>Tactical Insight & Risk Analysis</span>
                </span>
                {isInsightOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {isInsightOpen && (
                <div className="tactical-insight-content">
                  {feedback?.actionCritique && (
                    <p style={{ margin: 0 }}>
                      <strong>Assessment:</strong> {feedback.actionCritique}
                    </p>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginTop: '6px' }}>
                    <div>
                      <strong style={{ color: 'var(--color-emerald)', fontSize: '12px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                        Potential Benefits
                      </strong>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {(feedback?.potentialBenefits || ['Deflects immediate pressure']).map((b, i) => (
                          <li key={i} style={{ display: 'flex', gap: '6px', fontSize: '13px' }}>
                            <CheckCircle2 size={13} style={{ color: 'var(--color-emerald)', flexShrink: 0, marginTop: '3px' }} />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <strong style={{ color: 'var(--color-amber)', fontSize: '12px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                        Potential Hazards / Risks
                      </strong>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {(feedback?.potentialRisks || ['Unpredictable individual reaction']).map((r, i) => (
                          <li key={i} style={{ display: 'flex', gap: '6px', fontSize: '13px' }}>
                            <AlertTriangle size={13} style={{ color: 'var(--color-amber)', flexShrink: 0, marginTop: '3px' }} />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {feedback?.recommendedNextStep && (
                    <div style={{ marginTop: '8px', padding: '10px 14px', background: '#f5f0fb', borderRadius: 'var(--radius-xs)' }}>
                      <strong style={{ color: 'var(--physio-purple-pill)', fontSize: '12px' }}>Next Consideration: </strong>
                      <span style={{ fontSize: '13px' }}>{feedback.recommendedNextStep}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Stage Action Bar */}
            <div className="stage-action-bar anim-step-5" style={{ justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn-stage-primary"
                onClick={handleContinueEncounter}
              >
                <span>{isEnding ? 'View Final Debrief' : 'Continue to Next Decision'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </section>
        )}

        {/* ==============================================================
            STAGE 6: AI FREEFORM INTERVENTION
           ============================================================== */}
        {stage === 'freeform' && (
          <section className="stage-card" aria-labelledby="stage-freeform-heading">
            <div className="stage-header-block anim-step-1">
              <span className="stage-eyebrow">
                <Sparkles size={14} />
                <span>Secondary Response Mode // Natural Language AI</span>
              </span>
              <h1 id="stage-freeform-heading" className="stage-title">
                Describe Your Own Intervention
              </h1>
              <p className="stage-description">
                Explain what you would say or do in natural language. Our evaluation engine classifies your tactic under the 5 Ds.
              </p>
            </div>

            <div className="freeform-stage-box anim-step-2">
              <textarea
                className="freeform-textarea"
                rows={4}
                value={freeformDraft}
                onChange={(e) => setFreeformDraft(e.target.value.slice(0, 600))}
                placeholder="Example: I casually step into the aisle between them, make eye contact with the commuter, and ask: 'Excuse me, does this train transfer at 8th Street or Central?'"
                aria-label="Enter your own tactical intervention response"
              />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                <span>{freeformDraft.length} / 600 characters</span>
                <span>Powered by Gemini AI with deterministic local transition rules</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="stage-action-bar anim-step-3">
              <button
                type="button"
                className="btn-stage-secondary"
                onClick={() => setStage('response')}
              >
                <ArrowLeft size={15} />
                <span>Back to 5-D Options</span>
              </button>

              <button
                type="button"
                className="btn-stage-primary"
                disabled={freeformDraft.trim().length < 5 || isProcessing}
                onClick={handleFreeformSubmit}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={16} className="spin-icon" />
                    <span>Evaluating Action...</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Evaluate & Apply Response</span>
                  </>
                )}
              </button>
            </div>
          </section>
        )}

        {/* ==============================================================
            STAGE 8: FINAL DEBRIEF
           ============================================================== */}
        {stage === 'debrief' && debrief && (
          <section className="stage-card" aria-labelledby="stage-debrief-heading">
            <div className="stage-header-block anim-step-1">
              <span className="stage-eyebrow">
                <Award size={14} />
                <span>Simulation Completed // Debrief Report</span>
              </span>
              <h1 id="stage-debrief-heading" className="stage-title">
                {debrief.scenarioTitle}
              </h1>
              <span className="status-pill subtle font-mono" style={{ alignSelf: 'flex-start' }}>
                Outcome: {debrief.endingType}
              </span>
            </div>

            {/* Debrief Hero Banner */}
            <div className="debrief-hero anim-step-2">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Observed Intervention Style
                </span>
                <div className="debrief-style-badge" style={{ fontSize: '15px', padding: '6px 16px' }}>
                  <Award size={17} />
                  <span>{debrief.interventionStyle || 'Strategic Deflector'}</span>
                </div>
              </div>

              <div className="debrief-score-ring">
                <span className="debrief-score-number">
                  {debrief.readinessScore || 90}
                </span>
                <span className="debrief-score-label">Readiness</span>
              </div>
            </div>

            {/* Educational Disclaimer */}
            <p className="anim-step-2" style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
              * The Readiness Index is an educational simulation metric measuring decision prudence,
              victim protection, and non-violent outcomes. It is not an official real-world emergency certification.
            </p>

            {/* Strengths & Improvements */}
            <div className="anim-step-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
              <div>
                <h3 className="debrief-section-title">Observed Strengths</h3>
                <ul className="debrief-list">
                  {(debrief.strengths || []).map((s, idx) => (
                    <li key={idx} className="debrief-list-item strength">
                      <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="debrief-section-title">Actionable Refinements</h3>
                <ul className="debrief-list">
                  {(debrief.improvements || []).map((imp, idx) => (
                    <li key={idx} className="debrief-list-item improvement">
                      <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Reflection Prompt */}
            {debrief.reflectionQuestion && (
              <div className="reflection-box anim-step-4">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <HelpCircle size={15} style={{ color: 'var(--physio-purple-pill)' }} />
                  <strong style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--physio-plum)', letterSpacing: '0.05em' }}>
                    Reflection For Practice
                  </strong>
                </div>
                <p className="reflection-question">
                  "{debrief.reflectionQuestion}"
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="stage-action-bar anim-step-5">
              <button
                type="button"
                className="btn-stage-secondary"
                onClick={() => setStage('selection')}
              >
                <span>Choose Another Scenario</span>
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-stage-secondary"
                  onClick={onNavigateHome}
                >
                  <span>Return to Home</span>
                </button>

                <button
                  type="button"
                  className="btn-stage-primary"
                  onClick={handleReplayScenario}
                >
                  <RotateCcw size={15} />
                  <span>Replay Scenario</span>
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
