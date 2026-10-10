import React, { useState } from 'react';
import {
  Eye,
  Search,
  Bell,
  Volume2,
  VolumeX,
  Settings,
  Menu,
  X,
  Play,
  RotateCcw,
  Shield,
  Activity,
  Heart,
  Globe,
  UserCheck
} from 'lucide-react';

export default function NetflixNavbar({
  activeTab = 'home',
  onSelectTab,
  tension = 42,
  isMuted = true,
  onToggleMute,
  onOpenSettings,
  onQuickPlay,
  searchQuery = '',
  onSearchChange
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'simulator', label: 'Simulator' },
    { id: 'scenarios', label: 'Scenarios' },
    { id: 'framework', label: 'The 5 Ds' },
    { id: 'readiness', label: 'Readiness' },
    { id: 'about', label: 'Dossier' }
  ];

  const handleNavClick = (tabId) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
  };

  const tensionColor =
    tension >= 70 ? 'var(--color-crimson)' : tension >= 35 ? 'var(--color-amber)' : 'var(--color-emerald)';

  return (
    <header className="physio-navbar" role="banner">
      {/* Left: Physiopedia Style Brand & Nav Links */}
      <div className="physio-nav-left">
        <div
          className="physio-logo-wrap"
          onClick={() => handleNavClick('home')}
          title="ThirdEye Crisis Intervention Simulator"
        >
          <div className="physio-logo-badge">
            <Eye size={18} strokeWidth={2.4} />
          </div>
          <span className="physio-brand-title">ThirdEye</span>
        </div>

        <nav aria-label="Main Navigation">
          <ul className="physio-nav-links">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <li key={link.id}>
                  <button
                    type="button"
                    className={`physio-nav-item ${isActive ? 'active-pill' : ''}`}
                    onClick={() => handleNavClick(link.id)}
                  >
                    {link.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Right: Search, Login, Language, Audio, and White Pill CTA Button */}
      <div className="physio-nav-right">
        {/* Search Box / Icon */}
        <div className="physio-search-box">
          <Search size={15} className="physio-search-icon" />
          <input
            type="text"
            className="physio-search-input"
            placeholder="Search scenarios..."
            value={searchQuery}
            onChange={(e) => {
              if (onSearchChange) onSearchChange(e.target.value);
              if (activeTab !== 'scenarios' && activeTab !== 'home') {
                onSelectTab('scenarios');
              }
            }}
            aria-label="Search scenarios and tactics"
          />
        </div>

        {/* Live Tension Meter Pill */}
        <button
          type="button"
          onClick={() => handleNavClick('simulator')}
          className="physio-tension-pill"
          title="Click to open Crisis Simulator"
        >
          <Activity size={13} style={{ color: tensionColor }} />
          <span>Tension:</span>
          <strong style={{ color: tensionColor }}>{tension}%</strong>
        </button>

        {/* Audio Toggle */}
        <button
          type="button"
          className="physio-icon-btn"
          onClick={onToggleMute}
          title={isMuted ? 'Unmute procedural sound cues' : 'Mute sound cues'}
          aria-label={isMuted ? 'Unmute procedural sound cues' : 'Mute sound cues'}
        >
          {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} style={{ color: '#ffffff' }} />}
        </button>

        {/* Settings */}
        <button
          type="button"
          className="physio-icon-btn"
          onClick={onOpenSettings}
          title="Engine Diagnostics & Settings"
          aria-label="Engine Settings"
        >
          <Settings size={17} />
        </button>

        {/* Profile / Login */}
        <button
          type="button"
          className="physio-login-btn"
          onClick={() => handleNavClick('readiness')}
          title="View Your Bystander Readiness Profile"
        >
          <span>Profile</span>
        </button>

        {/* Language Pill (matching Physiopedia "🇬🇧 EN ▾") */}
        <div className="physio-lang-pill" title="English Interface">
          <span className="physio-flag">🇬🇧</span>
          <span>EN ▾</span>
        </div>

        {/* White Rounded Pill CTA Button (matching Physiopedia "Support Physiopedia") */}
        <button
          type="button"
          className="physio-cta-pill"
          onClick={() => handleNavClick('simulator')}
          title="Enter Bystander Crisis Intervention Simulator"
        >
          <div className="physio-cta-icon">
            <Shield size={14} />
          </div>
          <span>Support ThirdEye</span>
        </button>

        {/* Mobile Hamburger Menu Toggle */}
        <button
          type="button"
          className="physio-icon-btn physio-mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Drawer"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="physio-mobile-drawer">
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              className={`physio-nav-item ${activeTab === link.id ? 'active-pill' : ''}`}
              style={{ textAlign: 'left', padding: '10px 16px', borderRadius: '8px' }}
              onClick={() => handleNavClick(link.id)}
            >
              {link.label}
            </button>
          ))}
          <button
            type="button"
            className="physio-cta-pill"
            style={{ marginTop: '8px', width: '100%', justifyContent: 'center' }}
            onClick={() => handleNavClick('simulator')}
          >
            <Shield size={14} />
            <span>Support ThirdEye</span>
          </button>
        </div>
      )}
    </header>
  );
}
