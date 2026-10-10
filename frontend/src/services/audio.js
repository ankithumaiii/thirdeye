/**
 * Web Audio API Sound Synthesizer
 * Generates lightweight, non-intrusive procedural audio cues.
 * Disabled by default. Only activates after explicit user interaction.
 */

class SoundController {
  constructor() {
    this.ctx = null;
    this.muted = true; // Disabled by default
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.initialized = true;
      }
    } catch (e) {
      console.warn('Web Audio API not supported on this device');
    }
  }

  setMuted(mute) {
    this.muted = mute;
    if (!mute && !this.initialized) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended' && !mute) {
      this.ctx.resume();
    }
  }

  isMuted() {
    return this.muted;
  }

  playDeescalation() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now); // A4
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.18); // E5

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (err) {
      // Audio error suppressed silently
    }
  }

  playEscalation() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.exponentialRampToValueAtTime(164.81, now + 0.22); // E3

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (err) {
      // Audio error suppressed silently
    }
  }

  playActionClick() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (err) {
      // Audio error suppressed silently
    }
  }
}

export const soundFx = new SoundController();
