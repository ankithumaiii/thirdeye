import React, { useState } from 'react';
import { Play, Filter, Compass, AlertTriangle, ShieldCheck, MapPin, Users } from 'lucide-react';
import { SCENARIOS } from '../data/scenarios.js';

export default function ScenariosPage({
  onPlayScenario,
  searchQuery = ''
}) {
  const [filterType, setFilterType] = useState('all');

  const filtered = SCENARIOS.filter((s) => {
    // Search query matching
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      s.title.toLowerCase().includes(query) ||
      s.location.toLowerCase().includes(query) ||
      s.subtitle.toLowerCase().includes(query);

    if (!matchesSearch) return false;

    if (filterType === 'all') return true;
    if (filterType === 'transit') return s.id === 'metro';
    if (filterType === 'campus') return s.id === 'campus';
    if (filterType === 'street') return s.id === 'bus_stop';
    return true;
  });

  return (
    <div className="netflix-catalog-page" style={{ maxWidth: 'var(--content-max-width)', margin: '0 auto', padding: '36px 24px' }}>
      <div className="catalog-header-row" style={{ marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 700, color: 'var(--physio-plum)', letterSpacing: '-0.015em', margin: 0, fontFamily: 'var(--font-sans)' }}>
            Crisis Simulation Library
          </h1>
          <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Choose a crisis scenario to test your de-escalation skills in real-time.
          </p>
        </div>

        {/* Filter Pills (Physiopedia Style) */}
        <div className="catalog-filters-group">
          {[
            { id: 'all', label: 'All Scenarios' },
            { id: 'transit', label: 'Public Transit' },
            { id: 'campus', label: 'Campus & Education' },
            { id: 'street', label: 'Street & Public' }
          ].map((btn) => (
            <button
              key={btn.id}
              type="button"
              className={`physio-subnav-pill ${filterType === btn.id ? 'active' : ''}`}
              onClick={() => setFilterType(btn.id)}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          No scenarios found matching "{searchQuery}".
        </div>
      ) : (
        <div className="netflix-cards-grid">
          {filtered.map((s, idx) => (
            <div
              key={s.id}
              className="netflix-card"
              onClick={() => onPlayScenario(s.id)}
              role="button"
              tabIndex={0}
            >
              <div
                className="netflix-card-thumb"
                style={{
                  height: '180px',
                  backgroundImage:
                    s.id === 'metro'
                      ? 'radial-gradient(circle at 50% 50%, #2b1d1d 0%, #141414 100%)'
                      : s.id === 'campus'
                      ? 'radial-gradient(circle at 50% 50%, #1d252b 0%, #141414 100%)'
                      : 'radial-gradient(circle at 50% 50%, #2b251d 0%, #141414 100%)'
                }}
              >
                <span className="thumb-tag-badge">SCENARIO {idx + 1}</span>
                <div className="thumb-overlay-play">
                  <div className="play-circle-icon">
                    <Play size={22} fill="currentColor" />
                  </div>
                </div>
              </div>

              <div className="netflix-card-body">
                <h3 className="netflix-card-title">{s.title}</h3>
                <div className="netflix-card-meta">
                  <span className="billboard-match">96% Match</span>
                  <span className="billboard-rating-pill">16+</span>
                  <span className="status-pill subtle font-mono" style={{ fontSize: '10px' }}>
                    Tension: {s.initialState.tension}%
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span><MapPin size={11} style={{ display: 'inline', marginRight: '4px' }} />{s.location}</span>
                  <span><Users size={11} style={{ display: 'inline', marginRight: '4px' }} />Proximity: {s.bystanderProximity}</span>
                </div>

                <p className="netflix-card-desc" style={{ marginTop: '4px' }}>
                  {s.subtitle}
                </p>

                <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
                  <button
                    type="button"
                    className="btn-netflix-play red"
                    style={{ width: '100%', padding: '8px 12px', fontSize: '13px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayScenario(s.id);
                    }}
                  >
                    <Play size={14} fill="currentColor" />
                    <span>Launch Scenario</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
