import '@testing-library/jest-dom';

// Polyfill scrollTo for jsdom
if (typeof Element !== 'undefined' && !Element.prototype.scrollTo) {
  Element.prototype.scrollTo = function() {};
}

// Mock Web Audio API for jsdom
window.AudioContext = window.AudioContext || class {
  constructor() {
    this.state = 'running';
    this.currentTime = 0;
    this.destination = {};
  }
  createOscillator() {
    return {
      type: 'sine',
      frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
      connect: () => {},
      start: () => {},
      stop: () => {}
    };
  }
  createGain() {
    return {
      gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
      connect: () => {}
    };
  }
  resume() { return Promise.resolve(); }
  close() { return Promise.resolve(); }
};

window.webkitAudioContext = window.AudioContext;

// Mock fetch
global.fetch = global.fetch || (() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({})
}));
