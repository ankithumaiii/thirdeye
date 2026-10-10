import React from 'react';
import { Radio, MapPin, Compass, Users } from 'lucide-react';
import NarrativeStream from './NarrativeStream.jsx';

export default function IncidentTheater({
  scenario,
  currentScene,
  events = []
}) {
  return (
    <section className="console-panel incident-theater-panel" aria-labelledby="theater-heading">
      <div className="console-panel-header">
        <h2 id="theater-heading" className="console-panel-title">
          <Radio size={16} />
          <span>Incident Theater // Chronological Feed</span>
        </h2>
        <span className="status-pill cyan font-mono">
          Scene: {currentScene ? currentScene.id : 'Active'}
        </span>
      </div>

      {/* Incident Metadata Banner */}
      <div className="incident-meta-banner">
        <div className="meta-field">
          <MapPin size={13} className="meta-field-label" />
          <span>{scenario ? scenario.location : 'Transit Sector'}</span>
        </div>

        <div className="meta-field">
          <Compass size={13} className="meta-field-label" />
          <span>{scenario ? scenario.environment : 'Public Zone'}</span>
        </div>

        <div className="meta-field">
          <Users size={13} className="meta-field-label" />
          <span>Proximity: {scenario ? scenario.bystanderProximity : '4 meters'}</span>
        </div>
      </div>

      {/* Event Stream */}
      <NarrativeStream events={events} />
    </section>
  );
}
