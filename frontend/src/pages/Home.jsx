import React, { useState } from 'react';
import {
  Play,
  Info,
  ChevronRight,
  Plus,
  Minus,
  Sparkles,
  Shield,
  AlertTriangle,
  Compass,
  Users,
  MapPin,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { SCENARIOS } from '../data/scenarios.js';

export default function Home({
  onPlayScenario,
  onNavigateTab
}) {
  const [selectedScenarioInfo, setSelectedScenarioInfo] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const featured = SCENARIOS[0]; // Late Night Metro Car

  const faqs = [
    {
      q: 'What is ThirdEye and how does bystander simulation work?',
      a: 'ThirdEye is an interactive tactical crisis simulator modeled on the 5 Ds of bystander intervention (Distract, Delegate, Document, Delay, Direct). You enter realistic fictional harassment situations, make choices or type your own responses in natural language, and observe simulated consequences driven by a bounded telemetry engine.'
    },
    {
      q: 'Does ThirdEye claim to predict or prevent real-world violence?',
      a: 'No. ThirdEye is strictly an educational training tool. No intervention is universally safe. In real-world emergencies involving weapon threats or imminent physical violence, contacting emergency services (such as 911 / 112) and prioritizing human safety always supersede educational practice.'
    },
    {
      q: 'How does the AI evaluation with Google Gemini function?',
      a: 'When you submit a natural language intervention in the Freeform Responder, Google Gemini interprets your text on the server, identifies the relevant D, analyzes pros and cons, and passes the structured evaluation to our deterministic local simulation engine. If Gemini is unavailable, our transparent local heuristic engine takes over with zero crashes.'
    },
    {
      q: 'Does ThirdEye support Hinglish or colloquial expressions?',
      a: 'Yes! The local heuristic classifier recognizes everyday Hindi/Hinglish bystander expressions (such as "dhyan bhatkao", "police ko bulao", "dur reh usse") as well as standard English.'
    },
    {
      q: 'Is my personal data or simulation narrative saved?',
      a: 'No sensitive personal narratives, location telemetry, or names are ever stored or sold. All scenario sessions run securely in-memory for your privacy.'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* 1. CINEMATIC BILLBOARD HERO */}
      <section className="netflix-billboard" aria-label="Featured Crisis Scenario">
        <div className="netflix-billboard-backdrop" />
        <div className="billboard-grid-pattern" />

        <div className="netflix-billboard-content">
          <div className="billboard-top-badge">
            <span className="billboard-top-pill">TOP 1 TODAY</span>
            <span className="billboard-subtitle-tag">HIGH CONFINEMENT CRISIS</span>
          </div>

          <h1 className="billboard-title">{featured.title.toUpperCase()}</h1>

          <div className="billboard-meta-row">
            <span className="billboard-match">98% Tactical Match</span>
            <span className="billboard-rating-pill">16+</span>
            <span className="billboard-tag-pill">Transit Sector</span>
            <span className="status-pill amber font-mono">
              Initial Tension: {featured.initialState.tension}%
            </span>
          </div>

          <p className="billboard-synopsis">
            A passenger aggressively crowds a lone commuter in an underground subway carriage at 23:42 HRS.
            Four meters away, you are the only one looking up from your screen.
            Can you safely de-escalate using the 5 Ds before the next station?
          </p>

          <div className="billboard-action-buttons">
            <button
              type="button"
              className="btn-netflix-play red"
              onClick={() => onPlayScenario(featured.id)}
            >
              <Play size={20} fill="currentColor" />
              <span>Play Scenario</span>
            </button>

            <button
              type="button"
              className="btn-netflix-info"
              onClick={() => setSelectedScenarioInfo(featured)}
            >
              <Info size={20} />
              <span>More Details</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. PHYSIOPEDIA SUBHEADER ACTION BAR (Reference Screenshot Layout) */}
      <section className="physio-subnav-bar" aria-label="Crisis Intervention Systems Navigation">
        <h2 className="physio-subnav-title">Crisis Intervention Systems</h2>
        <div className="physio-subnav-pills">
          <button
            type="button"
            className="physio-subnav-pill active"
            onClick={() => onNavigateTab('home')}
          >
            <span>☰ Overview</span>
          </button>
          <button
            type="button"
            className="physio-subnav-pill"
            onClick={() => onNavigateTab('scenarios')}
          >
            <span>👥 Scenarios</span>
          </button>
          <button
            type="button"
            className="physio-subnav-pill"
            onClick={() => onNavigateTab('framework')}
          >
            <span>🏷 The 5 Ds Matrix</span>
          </button>
          <button
            type="button"
            className="physio-subnav-pill"
            onClick={() => onNavigateTab('readiness')}
          >
            <span>📊 Readiness Radar</span>
          </button>
        </div>
      </section>

      {/* 3. SCENARIOS GRID & ROWS */}
      <div className="netflix-rows-section">
        {/* ROW 1: TRENDING SCENARIOS (Physiopedia Card Grid) */}
        <div className="netflix-row-wrap">
          <div className="netflix-row-title-bar">
            <h2 className="netflix-row-title">
              <span>Trending Crisis Scenarios</span>
              <span className="status-pill subtle font-mono" style={{ fontSize: '10px' }}>
                LIVE BRANCHING
              </span>
            </h2>
            <button
              type="button"
              className="netflix-row-explore-link"
              onClick={() => onNavigateTab('scenarios')}
            >
              Explore All Scenarios <ChevronRight size={13} style={{ display: 'inline' }} />
            </button>
          </div>

          <div className="netflix-cards-grid">
            {SCENARIOS.map((s, idx) => {
              const matchPcts = ['98%', '95%', '92%'];
              const matchPct = matchPcts[idx] || '94%';

              return (
                <div
                  key={s.id}
                  className="netflix-card"
                  onClick={() => onPlayScenario(s.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Play ${s.title}`}
                >
                  <div
                    className="netflix-card-thumb"
                    style={{
                      backgroundImage:
                        idx === 0
                          ? 'radial-gradient(circle at 50% 50%, #3e1b4f 0%, #1e0928 100%)'
                          : idx === 1
                          ? 'radial-gradient(circle at 50% 50%, #2a1b4f 0%, #100928 100%)'
                          : 'radial-gradient(circle at 50% 50%, #4f251b 0%, #280f09 100%)'
                    }}
                  >
                    <span className="thumb-tag-badge">ONLINE SCENARIO</span>
                    <div className="thumb-overlay-play">
                      <div className="play-circle-icon">
                        <Play size={20} fill="currentColor" />
                      </div>
                    </div>
                  </div>

                  <div className="netflix-card-body">
                    <h3 className="netflix-card-title">{s.title}</h3>
                    <div className="netflix-card-meta">
                      <span className="billboard-match">{matchPct} Match</span>
                      <span className="billboard-rating-pill">Interactive</span>
                      <span className="status-pill subtle font-mono" style={{ fontSize: '10px' }}>
                        Tension: {s.initialState.tension}%
                      </span>
                    </div>
                    <p className="netflix-card-desc">{s.subtitle} • {s.location}</p>
                    <div style={{ marginTop: 'auto', paddingTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--physio-purple-pill)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>ThirdEye</span>
                        <strong style={{ color: 'var(--physio-coral)' }}>Plus</strong>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ROW 2: MASTER THE 5 Ds (INTERACTIVE FRAMEWORK) */}
        <div className="netflix-row-wrap">
          <div className="netflix-row-title-bar">
            <h2 className="netflix-row-title">
              <span>Master the 5 Ds // Tactical Intervention Modules</span>
            </h2>
            <button
              type="button"
              className="netflix-row-explore-link"
              onClick={() => onNavigateTab('framework')}
            >
              View Full Playbook <ChevronRight size={13} style={{ display: 'inline' }} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
            {[
              {
                id: 'distract',
                d: 'DISTRACT',
                tag: 'Indirect Deflection',
                desc: 'Interrupt momentum with casual inquiries (ask directions, drop a pen, transit stops).',
                colorClass: 'c-distract'
              },
              {
                id: 'delegate',
                d: 'DELEGATE',
                tag: 'Allied Mobilization',
                desc: 'Rally institutional personnel, bus drivers, security officers, or adjacent bystanders.',
                colorClass: 'c-delegate'
              },
              {
                id: 'document',
                d: 'DOCUMENT',
                tag: 'Verifiable Record',
                desc: 'Preserve carriage numbers, timestamps, and details without endangering yourself.',
                colorClass: 'c-document'
              },
              {
                id: 'delay',
                d: 'DELAY',
                tag: 'Supportive Aftercare',
                desc: 'Check in on the affected person once the acute tension passes. Validate their feelings.',
                colorClass: 'c-delay'
              },
              {
                id: 'direct',
                d: 'DIRECT',
                tag: 'Assertive Boundary',
                desc: 'Clearly and firmly state: "Leave them alone." Use when reasonably safe.',
                colorClass: 'c-direct'
              }
            ].map((mod) => (
              <div
                key={mod.id}
                className={`d-module-card ${mod.colorClass}`}
                onClick={() => onNavigateTab('framework')}
              >
                <div className="d-module-header">
                  <span className="d-module-name">{mod.d}</span>
                  <span className="d-module-tag">{mod.tag}</span>
                </div>
                <p className="d-module-body">{mod.desc}</p>
                <span className="d-module-footer">
                  <span>Learn Tactic</span>
                  <ChevronRight size={13} />
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 3: CRISIS TELEMETRY STATS CALLOUT BANNER */}
        <div className="netflix-stats-banner">
          <div className="stat-item">
            <span className="stat-value">87%</span>
            <span className="stat-label">De-escalation Impact</span>
            <span className="stat-desc">Harassment incidents diffuse when an attentive bystander intervenes safely.</span>
          </div>

          <div className="stat-item">
            <span className="stat-value">5 Ds</span>
            <span className="stat-label">Civil Safety Protocol</span>
            <span className="stat-desc">Universal, evidence-based crisis intervention framework taught globally.</span>
          </div>

          <div className="stat-item">
            <span className="stat-value">0%</span>
            <span className="stat-label">Confrontational Ego</span>
            <span className="stat-desc">Our engine rewards de-escalation and target dignity—not physical combat.</span>
          </div>

          <div className="stat-item">
            <span className="stat-value">100%</span>
            <span className="stat-label">Zero Crash Autonomy</span>
            <span className="stat-desc">Seamlessly transitions between Gemini AI and local heuristic engine.</span>
          </div>
        </div>

        {/* ROW 4: INSTITUTIONAL CRISIS SERIES */}
        <div className="netflix-row-wrap">
          <div className="netflix-row-title-bar">
            <h2 className="netflix-row-title">
              <span>Campus & Community Safety Series</span>
            </h2>
          </div>

          <div className="netflix-cards-grid">
            <div
              className="netflix-card"
              onClick={() => onPlayScenario('campus')}
            >
              <div
                className="netflix-card-thumb"
                style={{ background: 'radial-gradient(circle at 50% 50%, #2b1f3a 0%, #141414 100%)' }}
              >
                <span className="thumb-tag-badge">CAMPUS SERIES</span>
                <div className="thumb-overlay-play">
                  <div className="play-circle-icon">
                    <Play size={20} fill="currentColor" />
                  </div>
                </div>
              </div>
              <div className="netflix-card-body">
                <h3 className="netflix-card-title">Library Corridor Obstruction</h3>
                <div className="netflix-card-meta">
                  <span className="billboard-match">96% Match</span>
                  <span className="billboard-tag-pill">Academic Zone</span>
                </div>
                <p className="netflix-card-desc">Practice non-confrontational peer extraction in a semi-quiet study area.</p>
              </div>
            </div>

            <div
              className="netflix-card"
              onClick={() => onPlayScenario('bus_stop')}
            >
              <div
                className="netflix-card-thumb"
                style={{ background: 'radial-gradient(circle at 50% 50%, #1f332b 0%, #141414 100%)' }}
              >
                <span className="thumb-tag-badge">NIGHT SERIES</span>
                <div className="thumb-overlay-play">
                  <div className="play-circle-icon">
                    <Play size={20} fill="currentColor" />
                  </div>
                </div>
              </div>
              <div className="netflix-card-body">
                <h3 className="netflix-card-title">Street Bus Stop Haven</h3>
                <div className="netflix-card-meta">
                  <span className="billboard-match">93% Match</span>
                  <span className="billboard-tag-pill">Urban Sidewalk</span>
                </div>
                <p className="netflix-card-desc">Mobilize corner merchants and shared umbrellas during nighttime badgering.</p>
              </div>
            </div>

            <div
              className="netflix-card"
              onClick={() => onNavigateTab('framework')}
            >
              <div
                className="netflix-card-thumb"
                style={{ background: 'radial-gradient(circle at 50% 50%, #3a2b1f 0%, #141414 100%)' }}
              >
                <span className="thumb-tag-badge">MASTERCLASS</span>
                <div className="thumb-overlay-play">
                  <div className="play-circle-icon">
                    <Play size={20} fill="currentColor" />
                  </div>
                </div>
              </div>
              <div className="netflix-card-body">
                <h3 className="netflix-card-title">The 5 Ds Tactical Dossier</h3>
                <div className="netflix-card-meta">
                  <span className="billboard-match">100% Theory</span>
                  <span className="billboard-tag-pill">Self-Paced</span>
                </div>
                <p className="netflix-card-desc">In-depth guide with safety principles, legal boundaries, and real examples.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 5: NETFLIX FAQ ACCORDION */}
        <section className="netflix-faq-section" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="faq-section-title">
            Frequently Asked Questions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;

              return (
                <div key={idx} className="faq-accordion-item">
                  <button
                    type="button"
                    className="faq-accordion-trigger"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <Minus size={22} /> : <Plus size={22} />}
                  </button>

                  {isOpen && (
                    <div className="faq-accordion-content">
                      <p style={{ margin: 0 }}>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* 3. NETFLIX FOOTER */}
      <footer className="netflix-footer">
        <div className="footer-content-wrap">
          <div style={{ color: '#ffffff', fontSize: '14px', fontWeight: 700 }}>
            Questions? Contact ThirdEye Campus Safety & Student Welfare Division
          </div>

          <div className="footer-grid-links">
            <button type="button" className="footer-link-item" style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }} onClick={() => onNavigateTab('framework')}>
              The 5 Ds Framework
            </button>
            <button type="button" className="footer-link-item" style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }} onClick={() => onNavigateTab('scenarios')}>
              All Crisis Scenarios
            </button>
            <button type="button" className="footer-link-item" style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }} onClick={() => onNavigateTab('readiness')}>
              Readiness Telemetry
            </button>
            <button type="button" className="footer-link-item" style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }} onClick={() => onNavigateTab('about')}>
              Safety Mandate & Helplines
            </button>
          </div>

          <div className="footer-disclaimer-note">
            ThirdEye is an interactive training simulation platform. It does not predict or guarantee real-world outcomes.
            In acute emergencies or imminent physical threat, immediately contact local emergency response (911 / 112 / Campus Security).
          </div>

          <div style={{ fontSize: '11px', color: '#555555' }}>
            © 2026 ThirdEye Crisis Engine. Built for civil de-escalation training.
          </div>
        </div>
      </footer>

      {/* DETAIL MODAL (WHEN MORE INFO IS CLICKED ON BILLBOARD) */}
      {selectedScenarioInfo && (
        <div className="modal-overlay" onClick={() => setSelectedScenarioInfo(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <Shield size={18} style={{ color: 'var(--netflix-red)' }} />
                <span>{selectedScenarioInfo.title}</span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedScenarioInfo(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="status-pill crimson font-mono">
                  Initial Tension: {selectedScenarioInfo.initialState.tension}%
                </span>
                <span className="status-pill emerald font-mono">
                  Victim Safety: {selectedScenarioInfo.initialState.victimSafetyIndex}%
                </span>
                <span className="status-pill subtle font-mono">
                  Proximity: {selectedScenarioInfo.bystanderProximity}
                </span>
              </div>

              <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#e5e5e5' }}>
                {selectedScenarioInfo.scenes.metro_entry?.narrative ||
                  selectedScenarioInfo.scenes.campus_entry?.narrative ||
                  selectedScenarioInfo.scenes.bus_entry?.narrative}
              </p>

              <div>
                <strong style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                  5-D Tactical Adaptations For This Scenario:
                </strong>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', padding: 0 }}>
                  {Object.entries(selectedScenarioInfo.contextLabels).map(([d, label]) => (
                    <li key={d} style={{ fontSize: '12px', color: '#b3b3b3' }}>
                      <strong style={{ color: '#ffffff' }}>{d}:</strong> {label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-netflix-play red"
                style={{ fontSize: '14px', padding: '8px 20px' }}
                onClick={() => {
                  const id = selectedScenarioInfo.id;
                  setSelectedScenarioInfo(null);
                  onPlayScenario(id);
                }}
              >
                <Play size={16} fill="currentColor" />
                <span>Launch Simulation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
