import React from 'react';
import { History, ChevronRight } from 'lucide-react';

export default function ActionHistory({ actionHistory = [] }) {
  if (!actionHistory || actionHistory.length === 0) {
    return (
      <div className="console-panel" style={{ padding: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '11.5px' }}>
          <History size={14} />
          <span>No actions logged yet. Select a tactic or submit freeform intervention.</span>
        </div>
      </div>
    );
  }

  const getDColor = (d) => {
    switch (d) {
      case 'Distract': return 'cyan';
      case 'Delegate': return 'emerald';
      case 'Document': return 'amber';
      case 'Delay': return 'indigo';
      case 'Direct': return 'crimson';
      default: return 'subtle';
    }
  };

  return (
    <div className="console-panel" style={{ padding: '14px' }}>
      <div className="console-panel-header" style={{ marginBottom: '8px', paddingBottom: '6px' }}>
        <h4 className="console-panel-title" style={{ fontSize: '12px' }}>
          <History size={14} />
          <span>Action Log History ({actionHistory.length})</span>
        </h4>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
        {actionHistory.slice().reverse().map((act, idx) => (
          <div
            key={act.id || idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 8px',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xs)',
              fontSize: '11px',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
              <span className={`status-pill ${getDColor(act.d)}`} style={{ padding: '1px 6px', fontSize: '10px' }}>
                {act.d}
              </span>
              <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px' }}>
                {act.actionText}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
              <span>T:{act.resultingTelemetry?.tension}%</span>
              <span>S:{act.resultingTelemetry?.victimSafetyIndex}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
