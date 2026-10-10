import React from 'react';
import { ShieldAlert, UserCheck, Activity, BarChart2 } from 'lucide-react';

export default function SafetyTelemetry({
  victimSafetyIndex = 58,
  bystanderExposure = 20,
  behavioralCounts = {},
  lastDeltas = null
}) {
  const safetyClamped = Math.max(0, Math.min(100, Math.round(victimSafetyIndex)));
  const exposureClamped = Math.max(0, Math.min(100, Math.round(bystanderExposure)));

  // Safety colors
  const safetyColor =
    safetyClamped >= 75
      ? 'var(--color-emerald)'
      : safetyClamped >= 45
      ? 'var(--color-amber)'
      : 'var(--color-crimson)';

  // Exposure colors (higher exposure = greater risk)
  const exposureColor =
    exposureClamped >= 65
      ? 'var(--color-crimson)'
      : exposureClamped >= 35
      ? 'var(--color-amber)'
      : 'var(--color-emerald)';

  const totalActions = Object.values(behavioralCounts).reduce((a, b) => a + b, 0);

  const getDDeltaText = (delta) => {
    if (!delta || delta === 0) return null;
    return delta > 0 ? `+${delta}%` : `${delta}%`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* 1. Victim Safety Index Card */}
      <section className="telemetry-metric-card" aria-label="Victim Safety Index Telemetry">
        <div className="telemetry-card-header">
          <div className="metric-title-group">
            <UserCheck size={16} style={{ color: 'var(--color-emerald)' }} />
            <span>Victim Safety Index</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {lastDeltas?.safetyDelta !== undefined && lastDeltas.safetyDelta !== 0 && (
              <span className={`status-pill ${lastDeltas.safetyDelta > 0 ? 'emerald' : 'crimson'}`}>
                {getDDeltaText(lastDeltas.safetyDelta)}
              </span>
            )}
            <span className="metric-value-display font-mono" style={{ color: safetyColor }}>
              {safetyClamped}%
            </span>
          </div>
        </div>

        <div className="metric-bar-track">
          <div
            className="metric-bar-fill"
            style={{
              width: `${safetyClamped}%`,
              backgroundColor: safetyColor
            }}
          />
        </div>

        <p className="metric-description">
          {safetyClamped >= 75
            ? 'The targeted individual has achieved clear physical distance, active community support, or an institutional exit.'
            : safetyClamped >= 45
            ? 'Intimidation is ongoing but contained. The affected person requires ongoing distraction or a safe departure pathway.'
            : 'Immediate danger. Intimidation is acute and unshielded in a confined environment.'}
        </p>
      </section>

      {/* 2. Bystander Exposure Metric Card */}
      <section className="telemetry-metric-card" aria-label="Bystander Simulated Exposure Telemetry">
        <div className="telemetry-card-header">
          <div className="metric-title-group">
            <ShieldAlert size={16} style={{ color: 'var(--color-amber)' }} />
            <span>Bystander Exposure</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {lastDeltas?.exposureDelta !== undefined && lastDeltas.exposureDelta !== 0 && (
              <span className={`status-pill ${lastDeltas.exposureDelta > 0 ? 'amber' : 'emerald'}`}>
                {getDDeltaText(lastDeltas.exposureDelta)}
              </span>
            )}
            <span className="metric-value-display font-mono" style={{ color: exposureColor }}>
              {exposureClamped}%
            </span>
          </div>
        </div>

        <div className="metric-bar-track">
          <div
            className="metric-bar-fill"
            style={{
              width: `${exposureClamped}%`,
              backgroundColor: exposureColor
            }}
          />
        </div>

        <p className="metric-description">
          Simulated personal friction and physical visibility.
          <em style={{ display: 'block', marginTop: '2px', color: 'var(--text-muted)' }}>
            Note: Educational model telemetry; does not represent a real-world statistical probability.
          </em>
        </p>
      </section>

      {/* 3. Behavioural Profile (5 Ds Breakdown) */}
      <section className="console-panel" style={{ padding: '14px' }} aria-labelledby="behavior-heading">
        <div className="console-panel-header" style={{ marginBottom: '10px', paddingBottom: '8px' }}>
          <h3 id="behavior-heading" className="console-panel-title">
            <BarChart2 size={15} />
            <span>Tactical Profile // 5-D Utilization</span>
          </h3>
          <span className="status-pill subtle font-mono">
            {totalActions} Moves
          </span>
        </div>

        <div className="behavioral-bars-list">
          {[
            { key: 'Distract', label: 'Distract', color: 'var(--color-cyan)' },
            { key: 'Delegate', label: 'Delegate', color: 'var(--color-emerald)' },
            { key: 'Document', label: 'Document', color: 'var(--color-amber)' },
            { key: 'Delay', label: 'Delay', color: 'var(--color-indigo)' },
            { key: 'Direct', label: 'Direct', color: 'var(--color-crimson)' }
          ].map(({ key, label, color }) => {
            const count = behavioralCounts[key] || 0;
            const pct = totalActions > 0 ? Math.round((count / totalActions) * 100) : 0;

            return (
              <div key={key} className="behavior-row">
                <span className="behavior-label">{label}</span>
                <div className="behavior-bar-track">
                  <div
                    className="behavior-bar-fill"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: color
                    }}
                  />
                </div>
                <span className="behavior-count">{count}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
