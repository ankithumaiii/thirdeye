import React from 'react';
import {
  ShieldAlert,
  Compass,
  MessageCircle,
  Users2,
  FileCheck2,
  HeartHandshake,
  AlertTriangle,
  Cpu,
  CheckCircle,
  AlertOctagon
} from 'lucide-react';

export default function About({ onBackToSimulator }) {
  return (
    <main className="console-panel" style={{ maxWidth: '1000px', margin: '20px auto', padding: '28px', gap: '24px', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Compass size={22} style={{ color: 'var(--color-emerald)' }} />
            <span>ThirdEye Operational Dossier // Bystander Intervention</span>
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Pedagogical Framework, De-escalation Telemetry, and Crisis Training Principles
          </p>
        </div>

        <button
          type="button"
          className="tactical-btn primary"
          onClick={onBackToSimulator}
        >
          Return to Console
        </button>
      </div>

      {/* Critical Safety Notice */}
      <div
        style={{
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid var(--color-crimson-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '16px',
          display: 'flex',
          gap: '12px'
        }}
      >
        <AlertOctagon size={22} style={{ color: 'var(--color-crimson)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong style={{ color: 'var(--color-crimson)', fontSize: '13px', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Primary Safety Mandate & Educational Disclaimer
          </strong>
          <p style={{ color: 'var(--text-primary)', fontSize: '12.5px', lineHeight: '1.5', margin: 0 }}>
            ThirdEye is strictly an educational crisis simulation platform designed for interactive skill-building and scenario debriefing.
            It does <strong>NOT</strong> claim to predict or prevent real-world harassment, nor is it a substitute for emergency services
            (such as dialing 911 / 112 or contacting professional law enforcement in genuine danger).
            In real encounters, your physical safety and the targeted person’s wishes supersede any tactical methodology.
          </p>
        </div>
      </div>

      {/* The 5 Ds Framework */}
      <section>
        <h2 style={{ fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-primary)', marginBottom: '14px' }}>
          The 5 Ds of Bystander Intervention
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {/* Distract */}
          <div className="telemetry-metric-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-cyan)', fontWeight: 700 }}>
              <MessageCircle size={18} />
              <span>1. DISTRACT (Indirect Deflection)</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Create an everyday interruption that gives the affected person an opportunity to disengage.
              Ask for directions, drop a pen, or initiate casual conversation. De-escalates without overt confrontation.
            </p>
          </div>

          {/* Delegate */}
          <div className="telemetry-metric-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-emerald)', fontWeight: 700 }}>
              <Users2 size={18} />
              <span>2. DELEGATE (Allied Mobilization)</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Mobilize institutional staff, bus drivers, store cashiers, security, or fellow bystanders.
              Spreads responsibility and leverages trained authority when lone intervention carries high personal risk.
            </p>
          </div>

          {/* Document */}
          <div className="telemetry-metric-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-amber)', fontWeight: 700 }}>
              <FileCheck2 size={18} />
              <span>3. DOCUMENT (Verifiable Record)</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Record timestamps, carriage numbers, cross streets, or physical descriptions.
              Always ask the affected individual before sharing evidence. Never prioritize filming over active human safety.
            </p>
          </div>

          {/* Delay */}
          <div className="telemetry-metric-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-indigo)', fontWeight: 700 }}>
              <HeartHandshake size={18} />
              <span>4. DELAY (Supportive Aftercare)</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Check in with the targeted person once the acute tension passes. Ask: "Are you okay? Can I walk with you?"
              Restores autonomy and emotional dignity after distressing encounters.
            </p>
          </div>

          {/* Direct */}
          <div className="telemetry-metric-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-crimson)', fontWeight: 700 }}>
              <AlertTriangle size={18} />
              <span>5. DIRECT (Clear Boundaries)</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Firmly and clearly speak up to set a boundary: "Leave them alone."
              Use only when reasonably safe and keep hands visible. Direct intervention in confined spaces can trigger volatile escalation.
            </p>
          </div>
        </div>
      </section>

      {/* Engine Architecture & Scoring */}
      <section style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={16} style={{ color: 'var(--color-cyan)' }} />
          <span>The Deterministic Simulation & Readiness Index Model</span>
        </h3>
        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
          Unlike black-box AI generators that hallucinate numbers, ThirdEye utilizes a deterministic crisis simulation engine.
          While Google Gemini evaluates natural language interventions, the simulation state (Tension, Victim Safety, Bystander Exposure)
          is managed via mathematical transition matrices clamped strictly between 0 and 100.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '12px' }}>
          <div style={{ background: 'var(--bg-panel)', padding: '10px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
            <strong style={{ color: 'var(--color-emerald)', fontSize: '11px', display: 'block' }}>TARGET SAFETY (40%)</strong>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Measures the affected person's protection and exit options.</span>
          </div>

          <div style={{ background: 'var(--bg-panel)', padding: '10px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
            <strong style={{ color: 'var(--color-cyan)', fontSize: '11px', display: 'block' }}>TENSION CONTAINMENT (30%)</strong>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Rewards keeping environmental aggression from erupting.</span>
          </div>

          <div style={{ background: 'var(--bg-panel)', padding: '10px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
            <strong style={{ color: 'var(--color-amber)', fontSize: '11px', display: 'block' }}>EXPOSURE CONTROL (20%)</strong>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Evaluates prudence and self-preservation under crisis.</span>
          </div>

          <div style={{ background: 'var(--bg-panel)', padding: '10px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
            <strong style={{ color: 'var(--color-indigo)', fontSize: '11px', display: 'block' }}>TACTICAL BALANCE (10%)</strong>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Assesses use of aftercare, allied support, and distraction.</span>
          </div>
        </div>
      </section>
    </main>
  );
}
