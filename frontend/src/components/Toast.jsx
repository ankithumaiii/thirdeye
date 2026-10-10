import React, { useEffect } from 'react';
import { Info, CheckCircle2, AlertTriangle, X } from 'lucide-react';

export default function Toast({ toasts = [], onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((t) => {
        const Icon =
          t.type === 'success' ? CheckCircle2 : t.type === 'warning' ? AlertTriangle : Info;
        const colorClass =
          t.type === 'success' ? 'var(--color-emerald)' : t.type === 'warning' ? 'var(--color-amber)' : 'var(--color-cyan)';

        return (
          <div key={t.id} className="toast-item" role="status">
            <Icon size={15} style={{ color: colorClass, flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{t.message}</span>
            <button
              type="button"
              onClick={() => onDismiss(t.id)}
              style={{ color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              aria-label="Dismiss notification"
            >
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
