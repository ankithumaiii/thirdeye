import React from 'react';
import { Eye, RotateCcw, Settings, Volume2, VolumeX, Shield, Info } from 'lucide-react';
import TensionGauge from './TensionGauge.jsx';

export default function TopTelemetryBar({
  currentScenarioId,
  scenarios = [],
  onSelectScenario,
  tension = 40,
  isAiActive = false,
  isMuted = true,
  onToggleMute,
  onResetSimulation,
  onOpenSettings,
  activeTab = 'simulator',
  onSelectTab
}) {
  return (
    <header className="top-telemetry-header">
      {/* Brand Section */}
      <div className="brand-section">
        <div className="brand-logo-icon" aria-hidden="true">
          <Eye size={18} strokeWidth={2.2} />
        </div>
        <div className="brand-title-wrap">
          <div className="brand-name">
            <span>ThirdEye</span>
            <span className="status-pill emerald">
              <span className="pulse-dot emerald" />
              Engine Active
            </span>
          </div>
          <span className="brand-subtitle">
            BYSTANDER CRISIS ENGINE // {isAiActive ? 'GEMINI AI ENHANCED' : 'TACTICAL OFFLINE'}
          </span>
        </div>
      </div>

      {/* Center Live Tension Telemetry */}
      <div className="header-gauge-section">
        <TensionGauge tension={tension} />
      </div>

      {/* Right Controls */}
      <div className="header-actions-section">
        {/* Scenario Selector */}
        <select
          id="scenario-selector-dropdown"
          className="tactical-select font-mono"
          value={currentScenarioId}
          onChange={(e) => onSelectScenario(e.target.value)}
          aria-label="Select bystander crisis scenario"
        >
          {scenarios.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>

        {/* View Switcher: Simulator vs About */}
        <button
          type="button"
          className={`nav-tab-btn ${activeTab === 'simulator' ? 'active' : ''}`}
          onClick={() => onSelectTab('simulator')}
          title="Interactive Simulator Console"
        >
          <Shield size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px' }} />
          Sim
        </button>

        <button
          type="button"
          className={`nav-tab-btn ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => onSelectTab('about')}
          title="5-Ds Dossier & Safety Principles"
        >
          <Info size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px' }} />
          Dossier
        </button>

        {/* Audio Toggle */}
        <button
          type="button"
          className={`tactical-btn ${isMuted ? '' : 'primary'}`}
          onClick={onToggleMute}
          title={isMuted ? 'Unmute procedural audio cues' : 'Mute audio cues'}
          aria-label={isMuted ? 'Unmute audio cues' : 'Mute audio cues'}
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>

        {/* Reset Button */}
        <button
          type="button"
          className="tactical-btn danger"
          onClick={onResetSimulation}
          title="Reset current simulation scenario"
          aria-label="Reset current simulation"
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>

        {/* Settings Button */}
        <button
          type="button"
          className="tactical-btn"
          onClick={onOpenSettings}
          title="Engine Settings & Diagnostics"
          aria-label="Engine Settings"
        >
          <Settings size={15} />
        </button>
      </div>
    </header>
  );
}
