/**
 * INFINITY // Web Audio Engine
 * Pure Web Audio API tone synthesis with zero external assets.
 * Respects prefers-reduced-motion and persists mute state.
 */

import { getSavedAudioState, saveAudioState } from './state.js';

let audioCtx = null;
let isAudioEnabled = false;

export function initAudio() {
  isAudioEnabled = getSavedAudioState();

  // If user prefers reduced motion, default to disabled unless saved true
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches && !localStorage.getItem('infinity_audio_fx_v1')) {
    isAudioEnabled = false;
  }

  return isAudioEnabled;
}

export function toggleAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }

  isAudioEnabled = !isAudioEnabled;
  saveAudioState(isAudioEnabled);

  if (isAudioEnabled && audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  if (isAudioEnabled) {
    playChime(660, 0.08);
  }

  return isAudioEnabled;
}

export function isSoundActive() {
  return isAudioEnabled;
}

export function playClick(freq = 420, duration = 0.03) {
  if (!isAudioEnabled) return;
  try {
    ensureContext();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.4, audioCtx.currentTime + duration);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

export function playChime(freq = 580, duration = 0.12) {
  if (!isAudioEnabled) return;
  try {
    ensureContext();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + duration);
    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

export function playSuccess() {
  if (!isAudioEnabled) return;
  playChime(523.25, 0.08);
  setTimeout(() => playChime(659.25, 0.08), 80);
  setTimeout(() => playChime(783.99, 0.14), 160);
}

function ensureContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

