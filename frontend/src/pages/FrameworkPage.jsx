import React, { useState } from 'react';
import {
  MessageCircle,
  Users2,
  FileCheck2,
  HeartHandshake,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Play,
  Shield
} from 'lucide-react';

export default function FrameworkPage({ onPlayScenario }) {
  const [activeD, setActiveD] = useState('distract');

  const dData = {
    distract: {
      name: 'DISTRACT',
      title: 'Indirect Deflection & Conversational Shields',
      color: 'var(--color-cyan)',
      summary: 'Distraction creates an everyday social interruption that breaks the harasser’s fixation without triggering immediate defensive retaliation.',
      tactics: [
        'Ask the targeted person for transit directions or train transfer points.',
        'Drop a pen, metal water bottle, or papers to cause a sudden audio-visual break.',
        'Pretend you are an old acquaintance: "Hey! Aren’t you from the bio lecture?"',
        'Invite the targeted person to move with you to check the schedule or cafe.'
      ],
      dos: [
        'Focus your verbal and visual attention on the targeted person, not the aggressor.',
        'Keep tone natural, calm, and conversational.',
        'Provide an immediate pretext for the victim to step away.'
      ],
      donts: [
        'Do not mock or antagonize the harasser while engaging.',
        'Do not invade the victim’s personal boundaries or demand they thank you.',
        'Avoid complex deceptions that could trap you in an obvious lie.'
      ],
      idealScenario: 'metro'
    },
    delegate: {
      name: 'DELEGATE',
      title: 'Institutional Authority & Allied Mobilization',
      color: 'var(--color-emerald)',
      summary: 'Delegation enlists third parties—trained staff, security, transit conductors, store owners, or nearby bystanders—to share the burden of crisis intervention.',
      tactics: [
        'Alert transit conductors, bus drivers, or station gate supervisors.',
        'Involve neighborhood storefront cashiers or corner bodega owners.',
        'Make eye contact with fellow passengers and agree on a collective watch.',
        'Call non-emergency campus safety dispatch or emergency services.'
      ],
      dos: [
        'State clearly and concisely what you observed: "A man is blocking her in Locker Bay B."',
        'Mobilize multiple bystanders together so you are not acting alone.',
        'Maintain visual contact until support arrives.'
      ],
      donts: [
        'Do not pull emergency train cords in subterranean tunnels (traps all passengers).',
        'Do not assume someone else has already called for help (the classic bystander effect).'
      ],
      idealScenario: 'campus'
    },
    document: {
      name: 'DOCUMENT',
      title: 'Verifiable Record & Objective Telemetry',
      color: 'var(--color-amber)',
      summary: 'Documentation captures timestamps, carriage numbers, physical identifiers, and badge details to enable formal institutional accountability.',
      tactics: [
        'Discreetly note carriage numbers (e.g., #4082), stop IDs, and exact time.',
        'Record cross streets and proximity landmarks.',
        'Capture video only when you are at a safe distance and someone is already assisting.',
        'Always ask the targeted person what they wish to do with the footage.'
      ],
      dos: [
        'Prioritize human physical safety over getting a viral video.',
        'Preserve metadata: date, time, and location.',
        'Offer the record directly to the victim first.'
      ],
      donts: [
        'NEVER post videos online without the explicit consent of the affected person.',
        'Do not shove your camera into an agitated aggressor’s face.'
      ],
      idealScenario: 'bus_stop'
    },
    delay: {
      name: 'DELAY',
      title: 'Supportive Aftercare & Restoring Autonomy',
      color: 'var(--color-indigo)',
      summary: 'Delay takes effect once the acute interaction dissipates. It centers on the emotional well-being and dignity of the targeted person.',
      tactics: [
        'Approach the commuter quietly: "Are you okay? That was really uncalled for."',
        'Ask if they would like someone to walk with them to their car, bus, or dorm.',
        'Offer a tissue, water bottle, or quiet companionship on a station bench.',
        'Respect their boundaries if they prefer solitude.'
      ],
      dos: [
        'Validate their experience: "You didn\'t do anything to cause that."',
        'Ask: "How can I support you right now?"',
        'Help them reconnect with a trusted friend or family member.'
      ],
      donts: [
        'Do not interrogate them about why they didn\'t fight back.',
        'Do not dismiss what happened as "just a harmless comment."'
      ],
      idealScenario: 'metro'
    },
    direct: {
      name: 'DIRECT',
      title: 'Clear Boundaries & Uncompromising Civil Norms',
      color: 'var(--netflix-red)',
      summary: 'Direct intervention involves clearly, firmly speaking up to state that the behavior is unacceptable. It requires high situational awareness.',
      tactics: [
        'Keep statements short, calm, and objective: "Leave her alone. That is not okay."',
        'State community rules: "We don\'t block corridors here."',
        'Keep palms visible at chest height; do not make aggressive fists.',
        'Immediately transition to assisting the victim once the boundary is set.'
      ],
      dos: [
        'Keep your distance (at least 2–3 meters).',
        'State what must stop, not personal insults.',
        'Be prepared to disengage or transition to Delegate if friction spikes.'
      ],
      donts: [
        'DO NOT use physical violence, shoves, or threats.',
        'Do not get drawn into an ego-driven street argument.',
        'Avoid cornering someone with no physical exit path.'
      ],
      idealScenario: 'campus'
    }
  };

  const current = dData[activeD];

  return (
    <div className="netflix-catalog-page" style={{ maxWidth: 'var(--content-max-width)', margin: '0 auto', padding: '36px 24px' }}>
      <div className="catalog-header-row" style={{ marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 700, color: 'var(--physio-plum)', letterSpacing: '-0.015em', margin: 0, fontFamily: 'var(--font-sans)' }}>
            The 5 Ds Tactical Playbook
          </h1>
          <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Comprehensive de-escalation methodology for bystander crisis response.
          </p>
        </div>

        {/* 5-D Tabs (Physiopedia Pill Style) */}
        <div className="catalog-filters-group">
          {Object.entries(dData).map(([key, item]) => (
            <button
              key={key}
              type="button"
              className={`physio-subnav-pill ${activeD === key ? 'active' : ''}`}
              onClick={() => setActiveD(key)}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Focus Card */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--border-subtle)',
          borderTop: `4px solid ${current.color}`,
          borderRadius: 'var(--radius-lg)',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(40, 16, 52, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: current.color, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              TACTICAL MODULE
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--physio-plum)', margin: '4px 0 0 0', fontFamily: 'var(--font-sans)' }}>
              {current.title}
            </h2>
          </div>

          <button
            type="button"
            className="btn-netflix-play red"
            onClick={() => onPlayScenario(current.idealScenario)}
            style={{ fontSize: '13px', padding: '8px 18px' }}
          >
            <Play size={14} fill="currentColor" />
            <span>Practice in Simulation</span>
          </button>
        </div>

        <p style={{ fontSize: '14.5px', color: '#e5e5e5', lineHeight: 1.6, margin: 0 }}>
          {current.summary}
        </p>

        {/* Tactics & Dos/Donts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Tactical Moves */}
          <div style={{ background: '#202020', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', marginBottom: '10px' }}>
              Key Interventions
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {current.tactics.map((t, idx) => (
                <li key={idx} style={{ fontSize: '12.5px', color: '#b3b3b3', display: 'flex', gap: '8px' }}>
                  <span style={{ color: current.color }}>•</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Dos */}
          <div style={{ background: '#202020', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-emerald)', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} />
              <span>Recommended Practices</span>
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {current.dos.map((d, idx) => (
                <li key={idx} style={{ fontSize: '12.5px', color: '#b3b3b3', display: 'flex', gap: '8px' }}>
                  <CheckCircle2 size={13} style={{ color: 'var(--color-emerald)', flexShrink: 0, marginTop: '2px' }} />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Donts */}
          <div style={{ background: '#202020', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--netflix-red)', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <XCircle size={14} />
              <span>Critical Hazards</span>
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {current.donts.map((d, idx) => (
                <li key={idx} style={{ fontSize: '12.5px', color: '#b3b3b3', display: 'flex', gap: '8px' }}>
                  <XCircle size={13} style={{ color: 'var(--netflix-red)', flexShrink: 0, marginTop: '2px' }} />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
