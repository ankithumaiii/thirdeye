import React from 'react';
import {
  MessageCircle,
  Users2,
  FileCheck2,
  HeartHandshake,
  AlertTriangle,
  Loader2
} from 'lucide-react';

const D_CONFIG = {
  Distract: {
    name: 'DISTRACT',
    tag: 'Indirect Deflection',
    colorClass: 'd-distract',
    icon: MessageCircle,
    tooltip: 'Create an interruption that breaks the harasser’s momentum and offers the target an exit without direct conflict.'
  },
  Delegate: {
    name: 'DELEGATE',
    tag: 'Institutional Backup',
    colorClass: 'd-delegate',
    icon: Users2,
    tooltip: 'Enlist a third party, staff member, security, transit driver, or nearby bystander to intervene or observe.'
  },
  Document: {
    name: 'DOCUMENT',
    tag: 'Evidentiary Record',
    colorClass: 'd-document',
    icon: FileCheck2,
    tooltip: 'Record timestamps, carriage/room numbers, and descriptions. Never prioritize recording over immediate human safety.'
  },
  Delay: {
    name: 'DELAY',
    tag: 'Supportive Aftercare',
    colorClass: 'd-delay',
    icon: HeartHandshake,
    tooltip: 'Check in on the affected person after the immediate threat passes. Ask if they need assistance or someone to walk with.'
  },
  Direct: {
    name: 'DIRECT',
    tag: 'Assertive Boundary',
    colorClass: 'd-direct',
    icon: AlertTriangle,
    tooltip: 'Directly address the harasser with clear, firm boundaries. Use caution in confined or isolated settings.'
  }
};

export default function InterventionMatrix({
  scenario,
  currentScene,
  onSelectD,
  isProcessing = false
}) {
  const contextLabels = scenario?.contextLabels || {};
  const sceneOptions = currentScene?.options || {};

  const handleActionClick = (d) => {
    if (isProcessing) return;
    onSelectD(d);
  };

  return (
    <section className="console-panel intervention-matrix-panel" aria-labelledby="matrix-heading">
      <div className="console-panel-header">
        <h2 id="matrix-heading" className="console-panel-title">
          <span>Intervention Matrix // The 5 Ds</span>
        </h2>
        <span className="status-pill subtle font-mono">
          {isProcessing ? 'ENGINE COMPUTING MOVE...' : 'SELECT TACTIC'}
        </span>
      </div>

      <div className="matrix-grid" role="group" aria-label="5 Ds Intervention Options">
        {Object.entries(D_CONFIG).map(([dKey, config]) => {
          const Icon = config.icon;
          const specificOption = sceneOptions[dKey];
          const contextualMicroLabel =
            specificOption?.label ||
            contextLabels[dKey] ||
            `Initiate ${config.name} response`;

          return (
            <button
              key={dKey}
              id={`btn-intervention-${dKey.toLowerCase()}`}
              type="button"
              className={`matrix-card-btn ${config.colorClass}`}
              onClick={() => handleActionClick(dKey)}
              disabled={isProcessing}
              title={config.tooltip}
              aria-label={`${config.name}: ${contextualMicroLabel}. ${config.tooltip}`}
            >
              <div className="matrix-top-row">
                <span className="matrix-d-title">{config.name}</span>
                <span className="matrix-icon">
                  {isProcessing ? (
                    <Loader2 size={16} className="spin-icon" />
                  ) : (
                    <Icon size={16} />
                  )}
                </span>
              </div>

              <span className="matrix-context-label">
                {contextualMicroLabel}
              </span>

              <span className="matrix-footer-tag font-mono">
                {config.tag}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
