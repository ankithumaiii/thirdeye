import React from 'react';
import {
  Settings,
  Server,
  Cpu,
  Volume2,
  VolumeX,
  Trash2,
  X,
  Play,
  Lock,
  CheckCircle2
} from 'lucide-react';

export default function SettingsModal({
  isOpen = false,
  config = null,
  isMuted = true,
  onToggleMute,
  onTestSound,
  onClearPreferences,
  onClose
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="settings-modal-title">
      <div className="modal-dialog">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title" id="settings-modal-title">
            <Settings size={18} />
            <span>Telemetry Console Settings & Diagnostics</span>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close settings modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* AI Architecture Status */}
          <section>
            <h4 className="debrief-section-title">AI & Intelligence Engine</h4>
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-primary)' }}>
                  <Cpu size={15} style={{ color: 'var(--color-cyan)' }} />
                  <span>Engine Architecture</span>
                </span>
                <span className={`status-pill ${config?.aiConfigured ? 'emerald' : 'cyan'}`}>
                  {config?.engineMode || 'Tactical Offline Engine'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Configured Model:</span>
                <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>
                  {config?.model || 'Local Heuristic Engine'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Automatic Fallback:</span>
                <span style={{ color: 'var(--color-emerald)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={12} />
                  <span>Enabled (Zero Crash Guarantee)</span>
                </span>
              </div>

              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, marginTop: '4px', borderTop: '1px solid var(--border-subtle)', paddingTop: '6px' }}>
                <Lock size={11} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '3px' }} />
                Gemini API keys are maintained securely in the backend environment. Keys are never exposed to or stored inside the client browser.
              </p>
            </div>
          </section>

          {/* Procedural Audio Feedback */}
          <section>
            <h4 className="debrief-section-title">Procedural Sound Feedback</h4>
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <span style={{ fontSize: '13px', color: 'var(--text-primary)', display: 'block', fontWeight: 500 }}>
                  Web Audio Synthesized Cues
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Subtle non-intrusive harmonic tones on moves & escalation
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  className="tactical-btn"
                  onClick={onTestSound}
                  title="Test synthesized tone"
                >
                  <Play size={12} /> Test
                </button>

                <button
                  type="button"
                  className={`tactical-btn ${isMuted ? '' : 'primary'}`}
                  onClick={onToggleMute}
                >
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  <span>{isMuted ? 'Muted' : 'Enabled'}</span>
                </button>
              </div>
            </div>
          </section>

          {/* Privacy & Storage */}
          <section>
            <h4 className="debrief-section-title">Data Privacy & Local Storage</h4>
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                ThirdEye does not persist personal narratives, location tracking, or real-world names.
                All simulation state is managed in-memory during training sessions.
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                <button
                  type="button"
                  className="tactical-btn danger"
                  onClick={onClearPreferences}
                  style={{ fontSize: '11.5px' }}
                >
                  <Trash2 size={13} />
                  <span>Reset Local Cache & Preferences</span>
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            type="button"
            className="tactical-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
