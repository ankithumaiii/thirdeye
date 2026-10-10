import React, { useEffect, useRef } from 'react';
import { AlertCircle, ArrowRight, ShieldCheck, Zap, Sparkles, Clock } from 'lucide-react';

export default function NarrativeStream({ events = [] }) {
  const containerRef = useRef(null);
  const userScrolledUpRef = useRef(false);

  // Monitor user scrolling to avoid forcing scroll down if reading older log entries
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 60;
    userScrolledUpRef.current = !isNearBottom;
  };

  useEffect(() => {
    if (!containerRef.current || userScrolledUpRef.current) return;
    if (typeof containerRef.current.scrollTo === 'function') {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    } else {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [events]);

  const getEventIcon = (type) => {
    switch (type) {
      case 'environment':
        return <AlertCircle size={14} className="narrative-icon" />;
      case 'intervention':
        return <Zap size={14} className="narrative-icon" />;
      case 'consequence':
        return <ArrowRight size={14} className="narrative-icon" />;
      case 'ending':
        return <ShieldCheck size={14} className="narrative-icon" />;
      default:
        return <Sparkles size={14} className="narrative-icon" />;
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="narrative-stream-container"
      role="log"
      aria-live="polite"
      aria-label="Incident Chronological Event Stream"
    >
      {events.map((evt) => (
        <article
          key={evt.id}
          className={`narrative-event-card ${evt.type}`}
          tabIndex={0}
        >
          <div className="narrative-event-header">
            <span className="narrative-event-tag">
              {getEventIcon(evt.type)}
              <span>{evt.tag}</span>
            </span>

            <span className="narrative-event-timestamp">
              <Clock size={11} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '3px' }} />
              {evt.timestampText || 'T+00:00'}
            </span>
          </div>

          <p className="narrative-event-body">{evt.text}</p>

          {evt.telemetrySnapshot && (
            <div className="narrative-event-telemetry-pill">
              <span>
                Tension: <strong>{evt.telemetrySnapshot.tension}%</strong>
              </span>
              <span>•</span>
              <span>
                Victim Safety: <strong>{evt.telemetrySnapshot.victimSafetyIndex}%</strong>
              </span>
              <span>•</span>
              <span>
                Exposure: <strong>{evt.telemetrySnapshot.bystanderExposure}%</strong>
              </span>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
