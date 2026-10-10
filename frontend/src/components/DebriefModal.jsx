import React from 'react';
import {
  Award,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Compass,
  X,
  Shield
} from 'lucide-react';

export default function DebriefModal({
  isOpen = false,
  debrief = null,
  onRestart,
  onSelectAnotherScenario,
  onClose
}) {
  if (!isOpen || !debrief) return null;

  const score = debrief.readinessScore || 85;
  const scoreColor =
    score >= 80 ? 'var(--color-emerald)' : score >= 60 ? 'var(--color-amber)' : 'var(--color-crimson)';

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="debrief-modal-title">
      <div className="modal-dialog">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title" id="debrief-modal-title">
            <Shield size={18} style={{ color: 'var(--color-emerald)' }} />
            <span>Crisis Debrief // {debrief.scenarioTitle}</span>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close debrief modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Top Hero Banner */}
          <div className="debrief-hero">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span className="status-pill subtle font-mono">
                OUTCOME: {debrief.endingType}
              </span>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Intervention Profile:
              </h3>
              <div className="debrief-style-badge">
                <Award size={14} />
                <span>{debrief.interventionStyle || 'Strategic Deflector'}</span>
              </div>
            </div>

            <div className="debrief-score-ring">
              <span className="debrief-score-number" style={{ color: scoreColor }}>
                {score}
              </span>
              <span className="debrief-score-label">Readiness Index</span>
            </div>
          </div>

          {/* Educational Disclaimer */}
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
            * ThirdEye Readiness Index is an educational training metric reflecting de-escalation prudence,
            target safety preservation, and non-violent outcomes. It is not an official certification.
          </p>

          {/* Observed Strengths */}
          <div>
            <h4 className="debrief-section-title">Observed Strengths</h4>
            <ul className="debrief-list">
              {(debrief.strengths || []).map((str, idx) => (
                <li key={idx} className="debrief-list-item strength">
                  <CheckCircle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actionable Improvements */}
          <div>
            <h4 className="debrief-section-title">Tactical Refinements</h4>
            <ul className="debrief-list">
              {(debrief.improvements || []).map((imp, idx) => (
                <li key={idx} className="debrief-list-item improvement">
                  <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 5-D Utilization Summary */}
          {debrief.behavioralCounts && (
            <div>
              <h4 className="debrief-section-title">5-D Action Distribution</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {Object.entries(debrief.behavioralCounts).map(([d, count]) => {
                  if (count === 0 && d === 'None') return null;
                  return (
                    <span key={d} className="status-pill subtle font-mono">
                      {d}: <strong>{count}</strong>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reflection Question */}
          {debrief.reflectionQuestion && (
            <div className="reflection-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <HelpCircle size={14} style={{ color: 'var(--color-indigo)' }} />
                <strong style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-primary)', letterSpacing: '0.05em' }}>
                  Reflection For Practice
                </strong>
              </div>
              <p className="reflection-question">
                "{debrief.reflectionQuestion}"
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            type="button"
            className="tactical-btn"
            onClick={onSelectAnotherScenario}
          >
            <Compass size={14} />
            <span>Select Another Scenario</span>
          </button>

          <button
            type="button"
            className="tactical-btn primary"
            onClick={onRestart}
          >
            <RotateCcw size={14} />
            <span>Replay Scenario</span>
          </button>
        </div>
      </div>
    </div>
  );
}
