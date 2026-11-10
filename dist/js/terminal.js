/**
 * INFINITY // Terminal CLI Engine
 * Zero Self-XSS vulnerability: strictly uses textContent and safe DOM nodes.
 * Implements full command suite: help, events, about, cognition, socials, domains, attendees, prompt, register, clear.
 */

import { getAttendees } from './state.js';
import { openModal } from './modal.js';
import { playClick } from './audio.js';

export function initTerminal() {
  const terminalModal = document.getElementById('terminal-modal');
  const inputEl = document.getElementById('terminal-input');
  const screenEl = document.getElementById('terminal-screen');
  const openBtn = document.getElementById('open-terminal-btn');

  if (!inputEl || !screenEl) return;

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      openModal(terminalModal);
      inputEl.focus();
    });
  }

  // Global Ctrl + ~ or Ctrl + ` shortcut
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && (e.key === '`' || e.key === '~')) {
      e.preventDefault();
      if (terminalModal.classList.contains('is-open')) {
        terminalModal.querySelector('[data-close-modal]')?.click();
      } else {
        openModal(terminalModal);
        inputEl.focus();
      }
    }
  });

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const rawInput = inputEl.value.trim();
      inputEl.value = '';
      if (!rawInput) return;

      playClick(500, 0.03);

      // Safe Echo User Command using textContent (Fixes Self-XSS)
      const userLine = document.createElement('div');
      userLine.className = 'terminal-line text-muted';
      const promptSpan = document.createElement('span');
      promptSpan.className = 'terminal-prompt';
      promptSpan.textContent = 'guest@infinity-sggscc:~$ ';
      const commandSpan = document.createElement('span');
      commandSpan.textContent = rawInput; // Pure textContent prevents HTML/script injection
      userLine.appendChild(promptSpan);
      userLine.appendChild(commandSpan);
      screenEl.appendChild(userLine);

      // Process Command
      const parts = rawInput.toLowerCase().split(' ');
      const cmd = parts[0];

      handleCommand(cmd, screenEl);

      screenEl.scrollTop = screenEl.scrollHeight;
    }
  });
}

function handleCommand(cmd, screenEl) {
  const outputLine = document.createElement('div');
  outputLine.className = 'terminal-line';

  switch (cmd) {
    case 'help': {
      outputLine.innerHTML = `
        <div class="text-white font-bold mb-1">INFINITY CLI v3.0 // COMMAND MANUAL:</div>
        <div class="text-secondary pl-2 space-y-0.5">
          <div><strong class="text-white">help</strong>        : Displays this command index</div>
          <div><strong class="text-white">events</strong>      : Lists all upcoming and archived TechTonics events</div>
          <div><strong class="text-white">about</strong>       : Society mission and SGGSCC collegiate heritage</div>
          <div><strong class="text-white">cognition</strong>   : Rules, tracks, and format for the AI Hackathon</div>
          <div><strong class="text-white">socials</strong>     : Official LinkedIn and Instagram profiles</div>
          <div><strong class="text-white">domains</strong>     : Society technical and creative wings</div>
          <div><strong class="text-white">attendees</strong>   : Lists currently registered delegates from database</div>
          <div><strong class="text-white">prompt</strong>      : Opens the canonical Primary Prompt specification</div>
          <div><strong class="text-white">register</strong>    : Launches the 3-step delegate registration wizard</div>
          <div><strong class="text-white">clear</strong>       : Clears the terminal output buffer</div>
        </div>
      `;
      break;
    }

    case 'events': {
      outputLine.innerHTML = `
        <div class="text-white font-bold mb-1">TECHTONICS '26 &amp; INFINITY EVENT CALENDAR:</div>
        <div class="text-secondary pl-2 space-y-1">
          <div>• <strong class="text-white">Cognition '26</strong>: Flagship 90-min AI Hackathon [Upcoming: Nov 28, 2026]</div>
          <div>• <strong class="text-white">Pass The Pixel '26</strong>: Speed UI/UX &amp; Design Relay [Upcoming: Nov 28, 2026]</div>
          <div>• <strong class="text-white">CodeSprint '26</strong>: Rapid DSA Algorithmic Arena [Upcoming: Nov 29, 2026]</div>
          <div>• <strong class="text-white">Prompt Engineering Summit</strong>: Hands-on GenAI Masterclass [Past: Oct 2026]</div>
          <div>• <strong class="text-white">LinkedIn Personal Branding</strong>: Career Webinar Series [Past: Sep 2026]</div>
        </div>
      `;
      break;
    }

    case 'about': {
      outputLine.textContent =
        'INFINITY is The Official Technology Society of Sri Guru Gobind Singh College of Commerce (SGGSCC), University of Delhi. Founded to cultivate software engineering excellence, artificial intelligence research, and collegiate tech leadership.';
      break;
    }

    case 'cognition': {
      outputLine.innerHTML = `
        <div class="text-white font-bold">COGNITION // AI SPRINT PROTOCOL:</div>
        <div class="text-secondary pl-2">
          Format: 90-minute time-boxed rapid development sprint.<br/>
          Tools Permitted: Gemini, Claude, GPT, Web APIs, Tailwind, Modern JS.<br/>
          Evaluation: Prompt Architecture (30%), Functionality (30%), UI/UX Originality (25%), Feasibility (15%).
        </div>
      `;
      break;
    }

    case 'socials': {
      outputLine.innerHTML = `
        <div class="text-white font-bold">OFFICIAL DIGITAL CHANNELS:</div>
        <div class="text-secondary pl-2">
          • LinkedIn: <a href="https://www.linkedin.com/company/infinitysggscc" target="_blank" class="text-white underline">linkedin.com/company/infinitysggscc</a><br/>
          • Instagram: <a href="https://www.instagram.com/infinity.sggscc?mdxt=Z3RmejZ5NWM4NzR1" target="_blank" class="text-white underline">@infinity.sggscc</a>
        </div>
      `;
      break;
    }

    case 'domains': {
      outputLine.textContent =
        '1. Technical & AI Development  2. UI/UX & Visual Design  3. Public Relations & Social Media  4. Corporate Relations & Sponsorships  5. Research & Tech Gazette  6. Event Operations & Logistics';
      break;
    }

    case 'attendees': {
      const attendees = getAttendees();
      let list = `<div class="text-white font-bold mb-1">REGISTERED DELEGATES (${attendees.length} Verified):</div>`;
      attendees.forEach((a, idx) => {
        list += `<div class="text-secondary pl-2">${idx + 1}. [${a.id}] ${escapeHTML(a.name)} — ${escapeHTML(a.track)} (${escapeHTML(a.college)})</div>`;
      });
      outputLine.innerHTML = list;
      break;
    }

    case 'prompt': {
      outputLine.textContent = 'Launching canonical Primary Prompt specification...';
      const promptModal = document.getElementById('prompt-modal');
      openModal(promptModal);
      break;
    }

    case 'register': {
      outputLine.textContent = 'Launching 3-step registration wizard...';
      const regModal = document.getElementById('register-modal');
      openModal(regModal);
      break;
    }

    case 'clear': {
      screenEl.innerHTML = '';
      return;
    }

    default: {
      outputLine.className = 'terminal-line text-red-400';
      outputLine.textContent = `Command not recognized: '${cmd}'. Type 'help' for available commands.`;
      break;
    }
  }

  screenEl.appendChild(outputLine);
}

function escapeHTML(str) {
  const p = document.createElement('p');
  p.textContent = str;
  return p.innerHTML;
}

