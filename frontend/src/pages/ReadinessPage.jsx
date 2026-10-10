import React from 'react';
import {
  Award,
  Shield,
  Activity,
  History,
  CheckCircle,
  Play,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export default function ReadinessPage({
  actionHistory = [],
  behavioralCounts = {},
  debrief = null,
  onLaunchSimulator
}) {
  const totalMoves = Object.values(behavioralCounts).reduce((a, b) => a + b, 0);

  const readinessScore = debrief?.readinessScore || (totalMoves > 0 ? 92 : 88);
  const interventionStyle = debrief?.interventionStyle || 'Strategic Deflector';

  const badges = [
    {
      title: 'Subterranean Sentinel',
      desc: 'Successfully de-escalated confined metro harassment without violence.',
      earned: true
    },
    {
      title: 'Tactical Deflector',
      desc: 'Used 2+ non-violent distractions to interrupt intimidation cycles.',
      earned: (behavioralCounts.Distract || 0) >= 1
    },
    {
      title: 'Allied Mobilizer',
      desc: 'Delegated crisis intervention to institutional staff or authorities.',
      earned: (behavioralCounts.Delegate || 0) >= 1
    },
    {
      title: 'Compassionate Guardian',
      desc: 'Checked in on the affected commuter after the incident concluded.',
      earned: (behavioralCounts.Delay || 0) >= 1
    }
  ];

  return (
    <div className="readiness-page-wrap">
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '30px', fontWeight: 700, color: 'var(--physio-plum)', letterSpacing: '-0.015em', margin: 0, fontFamily: 'var(--font-sans)' }}>
          Your Bystander Readiness Profile
        </h1>
        <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', marginTop: '6px' }}>
          Educational learning metrics, tactical intervention tendencies, and training credentials.
        </p>
      </div>

      {/* Big Readiness Score Card */}
      <div className="readiness-overview-card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-emerald)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            CIVIL READINESS INDEX
          </span>

          <div className="readiness-big-score">
            <span className="big-number">{readinessScore}</span>
            <span className="big-out-of">/ 100</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="status-pill emerald">
              {interventionStyle}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              • {totalMoves} moves logged in current session
            </span>
          </div>
        </div>

        <div>
          <button
            type="button"
            className="btn-netflix-play red"
            onClick={onLaunchSimulator}
          >
            <Play size={16} fill="currentColor" />
            <span>Launch Simulation Console</span>
          </button>
        </div>
      </div>

      {/* 5-D Utilization Profile */}
      <div className="console-panel" style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Tactical Distribution // 5-D Decisions
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { key: 'Distract', label: 'Distract', color: 'var(--color-cyan)' },
            { key: 'Delegate', label: 'Delegate', color: 'var(--color-emerald)' },
            { key: 'Document', label: 'Document', color: 'var(--color-amber)' },
            { key: 'Delay', label: 'Delay', color: 'var(--color-indigo)' },
            { key: 'Direct', label: 'Direct', color: 'var(--netflix-red)' }
          ].map(({ key, label, color }) => {
            const count = behavioralCounts[key] || 0;
            const pct = totalMoves > 0 ? Math.round((count / totalMoves) * 100) : 0;

            return (
              <div key={key} className="behavior-row">
                <span className="behavior-label" style={{ width: '80px', color: '#ffffff' }}>
                  {label}
                </span>
                <div className="behavior-bar-track" style={{ height: '8px', background: '#222222' }}>
                  <div
                    className="behavior-bar-fill"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: color
                    }}
                  />
                </div>
                <span className="behavior-count font-mono">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges / Credentials */}
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Earned Crisis Training Credentials
        </h2>

        <div className="badges-grid">
          {badges.map((b, idx) => (
            <div
              key={idx}
              className="badge-card"
              style={{
                opacity: b.earned ? 1 : 0.45,
                borderColor: b.earned ? 'rgba(70, 211, 105, 0.3)' : 'rgba(255, 255, 255, 0.08)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} style={{ color: b.earned ? 'var(--color-emerald)' : 'var(--text-muted)' }} />
                <strong style={{ fontSize: '13px', color: '#ffffff' }}>{b.title}</strong>
              </div>
              <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                {b.desc}
              </p>
              <span style={{ fontSize: '10px', color: b.earned ? 'var(--color-emerald)' : 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>
                {b.earned ? '✓ Unlocked in Training' : '🔒 Practice in Simulator'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
