import React from 'react';
import { CheckCircle2, AlertTriangle, ArrowRightCircle, Compass, HelpCircle } from 'lucide-react';

export default function RiskAnalysis({
  feedback = null,
  scenario = null,
  currentScene = null
}) {
  const benefits = feedback?.potentialBenefits || [
    'Maintains protective witness observation',
    'Prepares low-friction exit pathway'
  ];

  const risks = feedback?.potentialRisks || [
    'Aggressor reaction remains unpredictable in enclosed settings'
  ];

  const nextStep = feedback?.recommendedNextStep || (
    scenario?.id === 'metro'
      ? 'Prepare to accompany the commuter off the train as doors slide open at next station.'
      : scenario?.id === 'campus'
      ? 'Invite the student to walk into the populated reading room or toward library front desk.'
      : 'Maintain visual proximity and invite the commuter inside the lighted corner bodega.'
  );

  const critique = feedback?.actionCritique || (
    currentScene?.narrative?.slice(0, 150) + '...'
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Tactical Guidance Banner */}
      <div className="guidance-banner" role="region" aria-label="Scenario Tactical Guidance">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <Compass size={14} style={{ color: 'var(--color-emerald)' }} />
          <strong style={{ color: 'var(--text-primary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Tactical Guidance
          </strong>
        </div>
        <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '12.5px' }}>
          {nextStep}
        </p>
      </div>

      {/* Rationale & Risk Analysis Panel */}
      <section className="console-panel" style={{ padding: '14px' }} aria-labelledby="risk-heading">
        <div className="console-panel-header" style={{ marginBottom: '10px', paddingBottom: '8px' }}>
          <h3 id="risk-heading" className="console-panel-title">
            <HelpCircle size={15} />
            <span>Telemetry Rationale // Risk Analysis</span>
          </h3>
          {feedback?.recognizedD && (
            <span className="status-pill emerald font-mono">
              {feedback.recognizedD}
            </span>
          )}
        </div>

        {critique && (
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.5' }}>
            {critique}
          </p>
        )}

        <div className="risk-callout-box">
          {/* Benefits */}
          <div>
            <strong style={{ fontSize: '10.5px', textTransform: 'uppercase', color: 'var(--color-emerald)', display: 'block', marginBottom: '4px', letterSpacing: '0.05em' }}>
              Potential Protective Benefits
            </strong>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {benefits.map((b, i) => (
                <div key={i} className="risk-item benefit">
                  <CheckCircle2 size={13} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risks */}
          <div style={{ marginTop: '6px' }}>
            <strong style={{ fontSize: '10.5px', textTransform: 'uppercase', color: 'var(--color-amber)', display: 'block', marginBottom: '4px', letterSpacing: '0.05em' }}>
              Potential Friction / Downsides
            </strong>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {risks.map((r, i) => (
                <div key={i} className="risk-item risk">
                  <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Next Step */}
          <div style={{ marginTop: '6px' }}>
            <strong style={{ fontSize: '10.5px', textTransform: 'uppercase', color: 'var(--color-cyan)', display: 'block', marginBottom: '4px', letterSpacing: '0.05em' }}>
              Suggested Next Step
            </strong>
            <div className="risk-item next-step">
              <ArrowRightCircle size={13} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{nextStep}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
