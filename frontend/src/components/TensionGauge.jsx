import React from 'react';

export default function TensionGauge({ tension = 40, size = 'compact' }) {
  const clampedTension = Math.max(0, Math.min(100, Math.round(tension)));

  // Color tokens based on tension level
  let statusColor = 'emerald';
  let statusLabel = 'CONTROLLED';

  if (clampedTension >= 70) {
    statusColor = 'crimson';
    statusLabel = 'CRITICAL TENSION';
  } else if (clampedTension >= 35) {
    statusColor = 'amber';
    statusLabel = 'HEIGHTENED FRICTION';
  }

  // SVG parameters
  const radius = 17;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedTension / 100) * circumference;

  const strokeColor =
    statusColor === 'crimson'
      ? 'var(--color-crimson)'
      : statusColor === 'amber'
      ? 'var(--color-amber)'
      : 'var(--color-emerald)';

  return (
    <div
      className="tension-gauge-compact"
      role="meter"
      aria-valuenow={clampedTension}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label={`Crisis Tension Level: ${clampedTension}%, Status: ${statusLabel}`}
    >
      <div className="gauge-svg-wrap">
        <svg className="gauge-svg" viewBox="0 0 44 44">
          <circle
            className="gauge-track"
            cx="22"
            cy="22"
            r={radius}
          />
          <circle
            className="gauge-value-bar"
            cx="22"
            cy="22"
            r={radius}
            stroke={strokeColor}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <span className="gauge-center-text">{clampedTension}%</span>
      </div>

      <div className="gauge-meta-info">
        <div className="gauge-label-row">
          <span className="gauge-title">Crisis Tension</span>
          <span className={`gauge-status-text ${statusColor}`}>
            {statusLabel}
          </span>
        </div>
        
        {/* Segmented meter for accessible multi-channel representation */}
        <div className="gauge-segments" aria-hidden="true">
          <div
            className={`gauge-segment-block ${
              clampedTension > 0 ? (clampedTension >= 70 ? 'active-crimson' : clampedTension >= 35 ? 'active-amber' : 'active-emerald') : ''
            }`}
          />
          <div
            className={`gauge-segment-block ${
              clampedTension >= 35 ? (clampedTension >= 70 ? 'active-crimson' : 'active-amber') : ''
            }`}
          />
          <div
            className={`gauge-segment-block ${
              clampedTension >= 70 ? 'active-crimson' : ''
            }`}
          />
        </div>
      </div>
    </div>
  );
}
