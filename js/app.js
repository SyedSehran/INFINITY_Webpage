/**
 * INFINITY // Main Application Bootstrap
 * Coordinates 3D Scene, Audio Engine, Terminal, AI Studio, Registration Wizard,
 * Deterministic Countdown, Accessible Modals, and Social Post Showcases.
 */

import { TECHTONICS_TARGET_DATE, DATA_PROVENANCE, getSavedTheme, saveTheme } from './state.js';
import { initAudio, toggleAudio, isSoundActive, playClick, playChime } from './audio.js';
import { init3DHeroScene } from './three-scene.js';
import { initModals, openModal, closeModal } from './modal.js';
import { initTerminal } from './terminal.js';
import { initPromptStudio } from './prompt-studio.js';
import { initRegistration } from './registration.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Initialization
  initTheme();

  // 2. Audio Engine
  initAudioControls();

  // 3. 3D WebGL Torus Knot Scene
  init3DHeroScene('three-canvas-container');

  // 4. Accessible Modal System
  initModals();

  // 5. Developer Terminal
  initTerminal();

  // 6. AI Prompt Studio
  initPromptStudio();

  // 7. 3-Step Registration Wizard
  initRegistration();

  // 8. Fixed Deterministic Countdown Timer
  initDeterministicCountdown();

  // 9. Typewriter Effect
  initTypewriter();

  // 10. Data Provenance & Stats
  initStatsAndProvenance();

  // 11. Social Post Inspection Modals
  initSocialModals();

  // 12. Past Projects Showcases
  initProjectModals();

  // 13. Canonical Primary Prompt Copy & Download
  initPromptActions();
});

/* ==========================================================
   1. THEME INITIALIZATION (Zero body class wiping)
   ========================================================== */
function initTheme() {
  const currentTheme = getSavedTheme();
  document.documentElement.setAttribute('data-theme', currentTheme);

  document.querySelectorAll('[data-theme-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme-btn');
      document.documentElement.setAttribute('data-theme', theme);
      saveTheme(theme);
      playChime(640, 0.05);
      showToast(`Theme updated to ${theme.toUpperCase()}`);
    });
  });
}

/* ==========================================================
   2. AUDIO CONTROLS
   ========================================================== */
function initAudioControls() {
  const soundBtn = document.getElementById('sound-toggle-btn');
  const soundLabel = document.getElementById('sound-status-label');
  if (!soundBtn || !soundLabel) return;

  const isActive = initAudio();
  updateSoundLabel(isActive);

  soundBtn.addEventListener('click', () => {
    const active = toggleAudio();
    updateSoundLabel(active);
    showToast(active ? 'Synthesizer Audio Enabled' : 'Audio Muted');
  });

  function updateSoundLabel(active) {
    soundLabel.textContent = active ? 'FX ON' : 'FX OFF';
    soundBtn.setAttribute('aria-pressed', String(active));
  }
}

/* ==========================================================
   3. DETERMINISTIC COUNTDOWN (Target: 2026-11-28T09:30:00)
   ========================================================== */
function initDeterministicCountdown() {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  if (!daysEl) return;

  const target = new Date(TECHTONICS_TARGET_DATE).getTime();

  function update() {
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(d).padStart(2, '0');
    hoursEl.textContent = String(h).padStart(2, '0');
    minsEl.textContent = String(m).padStart(2, '0');
    secsEl.textContent = String(s).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================
   4. ACCESSIBLE TYPEWRITER EFFECT
   ========================================================== */
function initTypewriter() {
  const target = document.getElementById('hero-typewriter');
  if (!target) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    target.textContent = 'The Premier Technology Society of Sri Guru Gobind Singh College of Commerce, University of Delhi.';
    return;
  }

  const phrases = [
    'The Premier Tech Society of SGGSCC (University of Delhi)',
    'Host of TechTonics \'26: Annual Collegiate Tech Festival',
    'Cognition \'26: Flagship 90-Minute AI Prototyping Hackathon',
    'Bridging Academic Theory with Production-Grade Engineering',
    'Empowering 500+ Student Developers Across Delhi University'
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function tick() {
    const current = phrases[phraseIdx];
    if (isDeleting) {
      target.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      target.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    if (!isDeleting && charIdx === current.length) {
      isDeleting = true;
      setTimeout(tick, 2200);
      return;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(tick, 400);
      return;
    }

    setTimeout(tick, isDeleting ? 30 : 55);
  }

  tick();
}

/* ==========================================================
   5. DATA PROVENANCE & VERIFIED STATS
   ========================================================== */
function initStatsAndProvenance() {
  const provenanceModal = document.getElementById('provenance-modal');
  const triggerBtn = document.getElementById('view-provenance-btn');
  const provenanceList = document.getElementById('provenance-list');

  if (triggerBtn && provenanceModal && provenanceList) {
    triggerBtn.addEventListener('click', () => {
      provenanceList.innerHTML = '';
      Object.entries(DATA_PROVENANCE).forEach(([key, item]) => {
        const div = document.createElement('div');
        div.className = 'p-3 bg-black rounded border border-subtle';
        div.innerHTML = `
          <div class="flex justify-between items-center mb-1">
            <span class="text-white font-bold font-mono">${item.stat}</span>
            <span class="text-xs text-secondary font-medium">${item.label}</span>
          </div>
          <p class="text-[11px] text-muted font-mono leading-relaxed">Source: ${item.source}</p>
        `;
        provenanceList.appendChild(div);
      });
      openModal(provenanceModal);
    });
  }
}

/* ==========================================================
   6. SOCIAL POST INSPECTION MODALS
   ========================================================== */
function initSocialModals() {
  const socialModal = document.getElementById('social-post-modal');
  const modalImg = document.getElementById('social-modal-banner');
  const modalPlatform = document.getElementById('social-modal-platform');
  const modalHandle = document.getElementById('social-modal-handle');
  const modalCaption = document.getElementById('social-modal-caption');
  const modalStats = document.getElementById('social-modal-stats');
  const modalLink = document.getElementById('social-modal-link');

  document.querySelectorAll('[data-social-card]').forEach((card) => {
    card.addEventListener('click', () => {
      const platform = card.getAttribute('data-platform');
      const handle = card.getAttribute('data-handle');
      const caption = card.getAttribute('data-caption');
      const stats = card.getAttribute('data-stats');
      const url = card.getAttribute('data-url');
      const headline = card.getAttribute('data-headline');

      if (modalPlatform) modalPlatform.textContent = platform;
      if (modalHandle) modalHandle.textContent = handle;
      if (modalCaption) modalCaption.textContent = caption;
      if (modalStats) modalStats.textContent = stats;
      if (modalLink) modalLink.href = url;
      if (modalImg) modalImg.textContent = headline || 'INFINITY SGGSCC HIGHLIGHT';

      openModal(socialModal);
      playClick(520, 0.03);
    });
  });
}

/* ==========================================================
   7. PAST PROJECTS SHOWCASE MODAL
   ========================================================== */
const PAST_PROJECTS = {
  cogniflow: {
    title: 'CogniFlow AI // Intelligent Workflow Automation',
    award: '1st Place • Cognition \'25',
    team: 'Team NeuralByte (SGGSCC & CIC)',
    tech: 'FastAPI, LangChain, React, ChromaDB, Tailwind CSS',
    description: 'An autonomous multi-agent pipeline designed for collegiate faculty to automate grading rubrics and summarize student project submissions with full provenance tracking.',
    github: 'https://github.com/infinitysggscc'
  },
  pixelcraft: {
    title: 'PixelCraft 2.0 // Accessible Design Engine',
    award: 'Winner • Pass The Pixel \'25',
    team: 'Studio Infinite (SSCBS & SGGSCC)',
    tech: 'TypeScript, Web Audio API, Canvas, Figma REST API',
    description: 'An automated design auditor that scans web wireframes in real-time, enforcing WCAG AAA color contrast ratios and dyslexic-friendly typography hierarchies.',
    github: 'https://github.com/infinitysggscc'
  },
  dutransit: {
    title: 'DU Transit AI // Smart Campus Mobility',
    award: 'Best GreenTech Innovation • TechTonics \'25',
    team: 'MetroMinds (Dept of Computer Science)',
    tech: 'React Native, Python, Graphhopper API, SQLite',
    description: 'Crowdsourced micro-transit and inter-college shuttle routing optimizing carbon footprints for 15,000+ daily Delhi University commuters.',
    github: 'https://github.com/infinitysggscc'
  }
};

function initProjectModals() {
  const projectModal = document.getElementById('project-modal');
  const titleEl = document.getElementById('project-modal-title');
  const awardEl = document.getElementById('project-modal-award');
  const teamEl = document.getElementById('project-modal-team');
  const techEl = document.getElementById('project-modal-tech');
  const descEl = document.getElementById('project-modal-desc');

  document.querySelectorAll('[data-project-key]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const key = btn.getAttribute('data-project-key');
      const data = PAST_PROJECTS[key];
      if (!data) return;

      if (titleEl) titleEl.textContent = data.title;
      if (awardEl) awardEl.textContent = data.award;
      if (teamEl) teamEl.textContent = `Engineered by: ${data.team}`;
      if (techEl) techEl.textContent = `Tech Stack: ${data.tech}`;
      if (descEl) descEl.textContent = data.description;

      openModal(projectModal);
      playClick(580, 0.03);
    });
  });
}

/* ==========================================================
   8. CANONICAL PRIMARY PROMPT COPY & DOWNLOAD
   ========================================================== */
function initPromptActions() {
  const copyBtn = document.getElementById('copy-prompt-btn');
  const downloadBtn = document.getElementById('download-prompt-btn');
  const promptTextBlock = document.getElementById('prompt-text-block');

  if (copyBtn && promptTextBlock) {
    copyBtn.addEventListener('click', () => {
      const text = promptTextBlock.innerText;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(text)
          .then(() => handleCopySuccess(copyBtn))
          .catch(() => fallbackCopy(text, copyBtn));
      } else {
        fallbackCopy(text, copyBtn);
      }
    });
  }

  if (downloadBtn && promptTextBlock) {
    downloadBtn.addEventListener('click', () => {
      const text = promptTextBlock.innerText;
      const blob = new Blob([text], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'PRIMARY_PROMPT.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Downloaded canonical PRIMARY_PROMPT.md');
    });
  }
}

function handleCopySuccess(btn) {
  playChime(880, 0.08);
  showToast('Primary Prompt copied to clipboard.');
  btn.textContent = 'Copied ✓';
  setTimeout(() => (btn.textContent = 'Copy Prompt'), 2200);
}

function fallbackCopy(text, btn) {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    handleCopySuccess(btn);
  } catch (err) {
    showToast('Failed to copy. Please select text manually.');
  }
}

function showToast(msg) {
  const shelf = document.getElementById('toast-shelf');
  if (!shelf) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="badge badge-emerald">•</span><span>${msg}</span>`;
  shelf.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

