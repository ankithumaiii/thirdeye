import React, { useState } from 'react';
import { Send, Sparkles, Loader2, RefreshCw, AlertCircle } from 'lucide-react';

export default function FreeformResponder({
  onSubmitFreeform,
  isProcessing = false,
  lastFeedbackSource = null,
  errorMessage = null,
  onRetry = null
}) {
  const [text, setText] = useState('');
  const maxLength = 600;

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (isProcessing) return;
    const trimmed = text.trim();
    if (trimmed.length < 5) return;

    onSubmitFreeform(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="freeform-panel">
      <div className="freeform-header-row">
        <label htmlFor="freeform-input" className="freeform-label">
          <Sparkles size={14} className="text-cyan" />
          <span>Natural Language Intervention // Freeform Responder</span>
        </label>

        {lastFeedbackSource && (
          <span className={`status-pill ${lastFeedbackSource === 'gemini' ? 'emerald' : 'cyan'}`}>
            {lastFeedbackSource === 'gemini' ? 'Evaluated by Gemini AI' : 'Evaluated by Heuristic Engine'}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <textarea
          id="freeform-input"
          className="freeform-textarea"
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, maxLength))}
          onKeyDown={handleKeyDown}
          placeholder="Describe your tactical intervention in your own words (e.g. 'I step into the aisle, apologize for interrupting, and ask the commuter if she knows what stop Central is...')"
          rows={3}
          disabled={isProcessing}
          aria-label="Enter your own intervention strategy in natural language"
        />

        {errorMessage && (
          <div className="status-pill crimson" style={{ width: '100%', justifyContent: 'space-between', padding: '6px 10px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={14} />
              <span>{errorMessage}</span>
            </span>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="tactical-btn"
                style={{ padding: '2px 8px', fontSize: '11px' }}
              >
                <RefreshCw size={11} /> Retry
              </button>
            )}
          </div>
        )}

        <div className="freeform-bottom-row">
          <span className="freeform-hints">
            <span>Press <strong>Enter</strong> to send • <strong>Shift+Enter</strong> for newline</span>
          </span>

          <div className="freeform-submit-group">
            <span className="char-counter">
              {text.length}/{maxLength}
            </span>

            <button
              id="btn-submit-freeform"
              type="submit"
              className="tactical-btn primary"
              disabled={isProcessing || text.trim().length < 5}
            >
              {isProcessing ? (
                <>
                  <Loader2 size={14} className="spin-icon" />
                  <span>Evaluating...</span>
                </>
              ) : (
                <>
                  <Send size={14} />
                  <span>Submit Action</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
