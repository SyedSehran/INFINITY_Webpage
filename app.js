/* ==========================================================
   INFINITY - The Tech Society of SGGSCC
   Main Interactive Application Engine
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initTypingEffect();
  initCountdown();
  initAudioEngine();
  initThemeSwitcher();
  initPromptStudio();
  initTerminal();
  initModals();
  initRecruitmentForm();
  initSocialInteractions();
  initStatsCounter();
});

/* ==========================================================
   1. PARTICLES & NEURAL MATRIX CANVAS
   ========================================================== */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: null, y: null, radius: 140 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  const particleCount = Math.min(Math.floor((width * height) / 12000), 85);
  const particles = [];

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.8;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.color = Math.random() > 0.4 ? '#00f2fe' : '#8a2be2';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactivity
      if (mouse.x && mouse.y) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 3;
          this.y -= (dy / dist) * force * 3;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 242, 254, ${0.2 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.75;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================
   2. AUDIO SYNTHESIZER ENGINE (Web Audio API)
   ========================================================== */
let audioCtx = null;
let soundEnabled = false;

function initAudioEngine() {
  const toggleBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');
  const soundStatus = document.getElementById('sound-status');

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    soundEnabled = !soundEnabled;

    if (soundEnabled) {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      playChimeSound(660, 0.08);
      soundIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />`;
      soundStatus.textContent = 'FX ON';
      showToast('Cyber Audio FX Enabled ⚡');
    } else {
      soundIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />`;
      soundStatus.textContent = 'FX OFF';
      showToast('Audio Muted');
    }
  });

  // Attach sound to interactive buttons
  document.querySelectorAll('button, a.btn-cyber, .interactive-card').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (soundEnabled) playClickSound(440, 0.03);
    });
  });
}

function playClickSound(freq = 440, duration = 0.04) {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, audioCtx.currentTime + duration);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Audio context handle
  }
}

function playChimeSound(freq = 587.33, duration = 0.15) {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + duration);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

/* ==========================================================
   3. DYNAMIC HERO TYPING EFFECT
   ========================================================== */
function initTypingEffect() {
  const target = document.getElementById('typing-text');
  if (!target) return;

  const phrases = [
    'The Official Tech Society of SGGSCC (University of Delhi)',
    'Host of TechTonics \'26: The Premier Collegiate Tech Festival',
    'Cognition: Flagship AI & Generative Prompt Hackathon',
    'Bridging Classroom Code with Industry-Grade Innovation',
    'Empowering 500+ Developers, Designers & Tech Leaders'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 60;
  const deleteSpeed = 30;
  const holdTime = 2200;

  function type() {
    const current = phrases[phraseIndex];
    if (isDeleting) {
      target.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      target.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === current.length) {
      isDeleting = true;
      setTimeout(type, holdTime);
      return;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(type, 400);
      return;
    }

    const delay = isDeleting ? deleteSpeed : typeSpeed;
    setTimeout(type, delay);
  }
  type();
}

/* ==========================================================
   4. COUNTDOWN TIMER TO TECHTONICS '26
   ========================================================== */
function initCountdown() {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  if (!daysEl) return;

  // Target date set for TechTonics '26 Grand Finale
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 14);
  targetDate.setHours(10, 0, 0, 0);

  function update() {
    const now = new Date().getTime();
    const diff = targetDate.getTime() - now;

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
   5. THEME SWITCHER
   ========================================================== */
function initThemeSwitcher() {
  const themeBtns = document.querySelectorAll('.theme-btn');
  themeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      document.body.className = '';
      if (theme !== 'cyan') {
        document.body.classList.add(`theme-${theme}`);
      }
      playChimeSound(700, 0.08);
      showToast(`Switched theme to ${theme.toUpperCase()}`);
    });
  });
}

/* ==========================================================
   6. AI PROMPT STUDIO SIMULATOR (COGNITION SPOTLIGHT)
   ========================================================== */
const promptPresets = {
  cognition: {
    title: 'Cognition Hackathon AI Web App Generator',
    prompt: `You are an expert AI Frontend Engineer. Build a high-impact, futuristic web dashboard for TechTonics '26 featuring real-time AI prompt telemetry, a dark cyberpunk visual language, and interactive team registration with zero external dependencies.`,
    model: 'Gemini 2.5 Flash',
    code: `// Prompt Engineering Output generated via Gemini 2.5 Flash
const HackathonDashboard = () => {
  const [activeSprint, setActiveSprint] = useState('Cognition-AI-Track');
  const [telemetry, setTelemetry] = useState({ latency: '18ms', accuracy: '99.4%' });

  return (
    <div className="bg-slate-950 p-6 rounded-2xl border border-cyan-500/30">
      <h2 className="text-xl font-bold text-cyan-400">⚡ Cognition '26 Dashboard</h2>
      <p className="text-slate-400 text-sm mt-1">Live AI Hackathon Telemetry Stream</p>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="p-3 bg-slate-900 rounded-lg">
          <span className="text-xs text-slate-500">Latency</span>
          <p className="text-lg font-mono text-emerald-400">{telemetry.latency}</p>
        </div>
        <div className="p-3 bg-slate-900 rounded-lg">
          <span className="text-xs text-slate-500">Model Accuracy</span>
          <p className="text-lg font-mono text-purple-400">{telemetry.accuracy}</p>
        </div>
      </div>
    </div>
  );
};`,
    previewHtml: `
      <div class="p-5 bg-slate-950 rounded-xl border border-cyan-500/40 shadow-lg text-left">
        <div class="flex items-center justify-between pb-3 border-b border-slate-800">
          <div class="flex items-center space-x-2">
            <span class="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></span>
            <span class="font-mono text-xs font-bold text-cyan-400">COGNITION AI PROTOCOL</span>
          </div>
          <span class="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono">STATUS: OPTIMAL</span>
        </div>
        <div class="mt-4 space-y-3">
          <div class="p-3 bg-slate-900/90 rounded-lg border border-slate-800 flex justify-between items-center">
            <span class="text-xs text-slate-300">Active AI Model Engine:</span>
            <span class="text-xs font-mono text-cyan-300 font-bold">GEMINI-2.5-FLASH-PREVIEW</span>
          </div>
          <div class="grid grid-cols-2 gap-3 text-center">
            <div class="p-3 bg-slate-900/60 rounded-lg border border-cyan-500/20">
              <span class="text-[10px] text-slate-400 uppercase tracking-widest">Inference Time</span>
              <p class="text-base font-mono font-bold text-emerald-400 mt-1">18.2 ms</p>
            </div>
            <div class="p-3 bg-slate-900/60 rounded-lg border border-purple-500/20">
              <span class="text-[10px] text-slate-400 uppercase tracking-widest">Context Window</span>
              <p class="text-base font-mono font-bold text-purple-400 mt-1">1M Tokens</p>
            </div>
          </div>
        </div>
      </div>
    `
  },
  pixel: {
    title: 'Pass The Pixel - Design System Generator',
    prompt: `Generate an accessible, glassmorphic design token specification for the Pass The Pixel competition at Infinity SGGSCC, emphasizing neon glow contrast and fluid typography.`,
    model: 'Claude 3.7 Sonnet',
    code: `:root {
  --neon-glow-primary: 0 0 25px rgba(0, 242, 254, 0.4);
  --glass-surface: rgba(13, 17, 39, 0.75);
  --blur-spec: blur(20px);
  --font-fluid-heading: clamp(2rem, 5vw + 1rem, 4.5rem);
}
.pixel-card {
  backdrop-filter: var(--blur-spec);
  box-shadow: var(--neon-glow-primary);
  border: 1px solid rgba(255, 255, 255, 0.12);
}`,
    previewHtml: `
      <div class="p-5 bg-gradient-to-br from-indigo-950/80 to-purple-950/80 backdrop-blur-xl rounded-xl border border-purple-500/40 text-left">
        <span class="text-xs font-mono text-pink-400 uppercase font-semibold">Pass The Pixel '26 UI Spec</span>
        <h4 class="text-lg font-bold text-white mt-1">Glassmorphic Design Blueprint</h4>
        <div class="mt-3 flex space-x-2">
          <span class="w-8 h-8 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50 inline-block"></span>
          <span class="w-8 h-8 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50 inline-block"></span>
          <span class="w-8 h-8 rounded-full bg-pink-500 shadow-lg shadow-pink-500/50 inline-block"></span>
        </div>
        <p class="text-xs text-slate-300 mt-3">Synthesized visual balance with AA contrast ratio approved for judging.</p>
      </div>
    `
  },
  linkedin: {
    title: 'LinkedIn Tech Branding & Optimization Prompt',
    prompt: `Write a viral, authentic LinkedIn post recap celebrating Infinity SGGSCC's Cognition Hackathon, highlighting participant ingenuity, mentor support, and student-driven tech leadership.`,
    model: 'GPT-4o',
    code: `// LinkedIn Content Architecture
Headline: "🚀 90 Minutes. 50+ Teams. Countless AI Breakthroughs at Cognition '26!"
Hook: "When the problem statements were revealed, the energy inside SGGSCC's tech arena was electric..."
Key Takeaways:
1. Rapid AI Prompt Engineering isn't just about speed; it's about architectural clarity.
2. The future belongs to cross-functional creators who bridge design, code, and ethics.
Hashtags: #InfinitySGGSCC #TechTonics #AIHackathon #PromptEngineering #DelhiUniversity`,
    previewHtml: `
      <div class="p-4 bg-slate-900 rounded-xl border border-blue-500/40 text-left space-y-2">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">IN</div>
          <div>
            <p class="text-xs font-bold text-white">Infinity – The Tech Society, SGGSCC</p>
            <p class="text-[10px] text-slate-400">1,850+ followers • Promoted Post</p>
          </div>
        </div>
        <p class="text-xs text-slate-200">🚀 90 Minutes. 50+ Teams. Infinite Possibilities at <strong>Cognition '26</strong>! Honored to host the sharpest minds across Delhi University.</p>
        <div class="pt-2 flex items-center justify-between text-slate-400 text-[11px] border-t border-slate-800">
          <span>👍 428 Likes</span>
          <span>💬 64 Comments</span>
        </div>
      </div>
    `
  }
};

function initPromptStudio() {
  const promptInput = document.getElementById('ai-prompt-input');
  const modelSelect = document.getElementById('ai-model-select');
  const runBtn = document.getElementById('run-prompt-btn');
  const presetBtns = document.querySelectorAll('.prompt-preset-btn');
  const outputCode = document.getElementById('prompt-output-code');
  const outputPreview = document.getElementById('prompt-output-preview');
  const promptStatus = document.getElementById('prompt-status-indicator');
  const tabBtns = document.querySelectorAll('.studio-tab-btn');

  if (!promptInput || !runBtn) return;

  // Preset loading
  presetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const presetKey = btn.getAttribute('data-preset');
      const data = promptPresets[presetKey];
      if (data) {
        promptInput.value = data.prompt;
        modelSelect.value = data.model;
        playClickSound(520, 0.05);
        showToast(`Loaded preset: ${data.title}`);
      }
    });
  });

  // Tab switching (Preview vs Code)
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('active', 'border-cyan-400', 'text-cyan-400'));
      btn.classList.add('active', 'border-cyan-400', 'text-cyan-400');

      const targetTab = btn.getAttribute('data-tab');
      if (targetTab === 'preview') {
        outputPreview.classList.remove('hidden');
        outputCode.parentElement.classList.add('hidden');
      } else {
        outputPreview.classList.add('hidden');
        outputCode.parentElement.classList.remove('hidden');
      }
      playClickSound(480, 0.03);
    });
  });

  // Run Synthesis simulation
  runBtn.addEventListener('click', () => {
    const promptText = promptInput.value.trim();
    if (!promptText) {
      showToast('Please enter or select a prompt statement!');
      return;
    }

    runBtn.disabled = true;
    runBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      Synthesizing with AI...
    `;

    promptStatus.innerHTML = `<span class="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping mr-2"></span>Inference running...`;
    playChimeSound(600, 0.1);

    setTimeout(() => {
      // Determine match or dynamic template
      let matched = promptPresets.cognition;
      if (promptText.toLowerCase().includes('pixel') || promptText.toLowerCase().includes('design')) {
        matched = promptPresets.pixel;
      } else if (promptText.toLowerCase().includes('linkedin') || promptText.toLowerCase().includes('post')) {
        matched = promptPresets.linkedin;
      }

      outputCode.textContent = matched.code;
      outputPreview.innerHTML = matched.previewHtml;

      promptStatus.innerHTML = `<span class="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-2"></span>Completed in 0.42s (428 tokens)`;
      runBtn.disabled = false;
      runBtn.innerHTML = `
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Synthesize Prompt Response
      `;

      playChimeSound(880, 0.15);
      showToast('AI Simulation Synthesis Complete! 🎯');
    }, 900);
  });
}

/* ==========================================================
   7. INTERACTIVE TERMINAL (`infinity-cli`)
   ========================================================== */
function initTerminal() {
  const terminalModal = document.getElementById('terminal-modal');
  const openBtn = document.getElementById('open-terminal-btn');
  const closeBtn = document.getElementById('close-terminal-btn');
  const inputEl = document.getElementById('terminal-input');
  const bodyEl = document.getElementById('terminal-body');

  if (!terminalModal || !inputEl) return;

  function openTerminal() {
    terminalModal.classList.remove('hidden');
    terminalModal.classList.add('flex');
    inputEl.focus();
    playChimeSound(550, 0.08);
  }

  function closeTerminal() {
    terminalModal.classList.add('hidden');
    terminalModal.classList.remove('flex');
  }

  if (openBtn) openBtn.addEventListener('click', openTerminal);
  if (closeBtn) closeBtn.addEventListener('click', closeTerminal);

  // Keyboard shortcut Ctrl + ~ or Ctrl + `
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && (e.key === '`' || e.key === '~')) {
      e.preventDefault();
      if (terminalModal.classList.contains('hidden')) {
        openTerminal();
      } else {
        closeTerminal();
      }
    }
  });

  const commands = {
    help: () => `
Available Commands:
  • <span class="text-cyan-400">help</span>        : Displays this command manual
  • <span class="text-cyan-400">about</span>       : Overview of Infinity, The Tech Society of SGGSCC
  • <span class="text-cyan-400">techtonics</span>  : Details on TechTonics '26 Annual Fest
  • <span class="text-cyan-400">cognition</span>   : Cognition AI Hackathon tracks, rules & prizes
  • <span class="text-cyan-400">socials</span>     : Official LinkedIn and Instagram links
  • <span class="text-cyan-400">domains</span>     : Wings & recruitment departments
  • <span class="text-cyan-400">prompt</span>      : View the primary prompt used for this frontend
  • <span class="text-cyan-400">register</span>    : Launch team registration portal
  • <span class="text-cyan-400">matrix</span>      : Trigger visual green matrix burst
  • <span class="text-cyan-400">clear</span>       : Clears terminal screen
    `,
    about: () => `
<span class="text-cyan-300 font-bold">INFINITY — The Tech Society</span>
Sri Guru Gobind Singh College of Commerce (SGGSCC), University of Delhi.
• Founded to bridge theoretical learning with practical tech innovation.
• Organizes hackathons, coding sprints, UI/UX challenges, and masterclasses.
• Address: Pitampura, New Delhi, Delhi 110034.
    `,
    techtonics: () => `
<span class="text-purple-400 font-bold">TECHTONICS '26: Annual Tech Extravaganza</span>
Flagship competitive events:
1. <span class="text-cyan-300">Cognition</span> : AI & Generative Prompt Hackathon
2. <span class="text-pink-300">Pass The Pixel</span> : Speed UI/UX & Visual Design Challenge
3. <span class="text-emerald-300">CodeSprint</span> : Rapid Algorithmic & Data Structures Arena
Prize Pool: ₹2,50,000+ in cash, credits, and sponsor rewards.
    `,
    cognition: () => `
<span class="text-cyan-400 font-bold">⚡ COGNITION — AI HACKATHON</span>
• Format: Rapid on-spot prompt & frontend sprint
• Tools Permitted: Gemini, Claude, GPT, v0, Tailwind, Web APIs
• Criteria: Prompt Quality, UI Execution, Originality, Accessibility
Type <span class="text-emerald-300">register</span> to register your team.
    `,
    socials: () => `
<span class="text-cyan-300 font-bold">Official Infinity Digital Footprint:</span>
• LinkedIn : <a href="https://www.linkedin.com/company/infinitysggscc" target="_blank" class="underline text-blue-400">linkedin.com/company/infinitysggscc</a>
• Instagram: <a href="https://www.instagram.com/infinity.sggscc?mdxt=Z3RmejZ5NWM4NzR1" target="_blank" class="underline text-pink-400">instagram.com/infinity.sggscc</a>
    `,
    domains: () => `
<span class="text-cyan-400 font-bold">Infinity Core Wings:</span>
1. Technical (Full-stack, AI/ML, Cloud)
2. UI/UX & Creative Media (Figma, Motion Graphics)
3. Public Relations & Social Media (@infinity.sggscc)
4. Corporate Relations & Sponsorships
5. Research & Content Curation
    `,
    prompt: () => {
      document.getElementById('prompt-modal').classList.remove('hidden');
      document.getElementById('prompt-modal').classList.add('flex');
      return `[SYSTEM] Opening Primary Prompt Specification Modal...`;
    },
    register: () => {
      document.getElementById('register-modal').classList.remove('hidden');
      document.getElementById('register-modal').classList.add('flex');
      return `[SYSTEM] Opening Registration & Pass Generator...`;
    },
    matrix: () => {
      document.body.classList.add('theme-emerald');
      setTimeout(() => document.body.classList.remove('theme-emerald'), 4000);
      return `<span class="text-emerald-400 font-mono">Wake up, Neo... The Matrix has you. Theme shifted to Emerald Matrix!</span>`;
    },
    clear: () => {
      bodyEl.innerHTML = '';
      return '';
    }
  };

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const raw = inputEl.value.trim().toLowerCase();
      inputEl.value = '';

      if (!raw) return;

      const cmdLine = document.createElement('div');
      cmdLine.className = 'mt-2 text-slate-400 font-mono text-xs';
      cmdLine.innerHTML = `<span class="text-cyan-400">guest@infinity-sggscc:~$</span> ${raw}`;
      bodyEl.appendChild(cmdLine);

      const respLine = document.createElement('div');
      respLine.className = 'text-xs font-mono text-slate-200 mt-1 pl-2';

      if (commands[raw]) {
        const result = commands[raw]();
        if (raw !== 'clear') {
          respLine.innerHTML = result;
          bodyEl.appendChild(respLine);
        }
      } else {
        respLine.innerHTML = `<span class="text-red-400">Command not recognized: '${raw}'. Type '<span class="text-cyan-400">help</span>' for available commands.</span>`;
        bodyEl.appendChild(respLine);
      }

      bodyEl.scrollTop = bodyEl.scrollHeight;
      playClickSound(500, 0.04);
    }
  });
}

/* ==========================================================
   8. MODALS & SUBMISSION PROMPT DRAWER
   ========================================================== */
function initModals() {
  const promptModal = document.getElementById('prompt-modal');
  const openPromptBtns = document.querySelectorAll('.open-prompt-btn');
  const closePromptBtn = document.getElementById('close-prompt-btn');
  const copyPromptBtn = document.getElementById('copy-prompt-btn');
  const downloadPromptBtn = document.getElementById('download-prompt-btn');

  const regModal = document.getElementById('register-modal');
  const openRegBtns = document.querySelectorAll('.open-reg-btn');
  const closeRegBtn = document.getElementById('close-reg-btn');

  // Open Prompt Modal
  openPromptBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      promptModal.classList.remove('hidden');
      promptModal.classList.add('flex');
      playChimeSound(620, 0.06);
    });
  });

  if (closePromptBtn) {
    closePromptBtn.addEventListener('click', () => {
      promptModal.classList.add('hidden');
      promptModal.classList.remove('flex');
    });
  }

  // Open Register Modal
  openRegBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      regModal.classList.remove('hidden');
      regModal.classList.add('flex');
      playChimeSound(620, 0.06);
    });
  });

  if (closeRegBtn) {
    closeRegBtn.addEventListener('click', () => {
      regModal.classList.add('hidden');
      regModal.classList.remove('flex');
    });
  }

  // Close modals on backdrop click
  [promptModal, regModal].forEach((modal) => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
          modal.classList.remove('flex');
        }
      });
    }
  });

  // Copy Prompt to Clipboard
  if (copyPromptBtn) {
    copyPromptBtn.addEventListener('click', () => {
      const promptContent = document.getElementById('prompt-text-block').innerText;
      navigator.clipboard.writeText(promptContent).then(() => {
        playChimeSound(880, 0.1);
        showToast('Primary Prompt Copied to Clipboard! 📋');
        copyPromptBtn.innerHTML = `
          <svg class="w-4 h-4 mr-1 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        `;
        setTimeout(() => {
          copyPromptBtn.innerHTML = `
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Prompt
          `;
        }, 2500);
      });
    });
  }

  // Download Primary Prompt as Markdown
  if (downloadPromptBtn) {
    downloadPromptBtn.addEventListener('click', () => {
      const promptContent = document.getElementById('prompt-text-block').innerText;
      const blob = new Blob([promptContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'INFINITY_PRIMARY_PROMPT_SGGSCC.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Downloaded PRIMARY_PROMPT.md! 🚀');
    });
  }
}

/* ==========================================================
   9. RECRUITMENT & HACKATHON PASS GENERATOR
   ========================================================== */
function initRecruitmentForm() {
  const form = document.getElementById('registration-form');
  const formSection = document.getElementById('reg-form-section');
  const passSection = document.getElementById('reg-pass-section');

  if (!form || !passSection) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('reg-name').value.trim() || 'Innovator';
    const email = document.getElementById('reg-email').value.trim();
    const college = document.getElementById('reg-college').value.trim() || 'Delhi University';
    const track = document.getElementById('reg-track').value;

    const passId = 'INF-' + Math.floor(100000 + Math.random() * 900000);

    document.getElementById('ticket-name').textContent = name;
    document.getElementById('ticket-college').textContent = college;
    document.getElementById('ticket-track').textContent = track;
    document.getElementById('ticket-id').textContent = passId;
    document.getElementById('ticket-time').textContent = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    formSection.classList.add('hidden');
    passSection.classList.remove('hidden');

    playChimeSound(950, 0.2);
    showToast(`Registration Successful! Pass ${passId} generated.`);
  });

  const resetBtn = document.getElementById('reset-reg-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      passSection.classList.add('hidden');
      formSection.classList.remove('hidden');
    });
  }
}

/* ==========================================================
   10. SOCIAL MEDIA FEED INTERACTIONS
   ========================================================== */
function initSocialInteractions() {
  const instaLikeBtns = document.querySelectorAll('.insta-like-btn');
  instaLikeBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const countSpan = btn.querySelector('.like-count');
      const isLiked = btn.getAttribute('data-liked') === 'true';

      let count = parseInt(countSpan.textContent.replace(/,/g, ''), 10);
      if (isLiked) {
        count--;
        btn.setAttribute('data-liked', 'false');
        btn.querySelector('svg').setAttribute('fill', 'none');
        btn.classList.remove('text-pink-500');
      } else {
        count++;
        btn.setAttribute('data-liked', 'true');
        btn.querySelector('svg').setAttribute('fill', 'currentColor');
        btn.classList.add('text-pink-500');
        playChimeSound(840, 0.08);
      }
      countSpan.textContent = count.toLocaleString();
    });
  });
}

/* ==========================================================
   11. ANIMATED STATS COUNTER
   ========================================================== */
function initStatsCounter() {
  const counters = document.querySelectorAll('.stat-counter');
  let hasAnimated = false;

  function runCounters() {
    counters.forEach((counter) => {
      const target = +counter.getAttribute('data-target');
      const speed = 40;
      let count = 0;

      const inc = Math.max(1, Math.ceil(target / speed));
      const timer = setInterval(() => {
        count += inc;
        if (count >= target) {
          counter.textContent = target.toLocaleString() + '+';
          clearInterval(timer);
        } else {
          counter.textContent = count.toLocaleString();
        }
      }, 35);
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !hasAnimated) {
        hasAnimated = true;
        runCounters();
      }
    },
    { threshold: 0.3 }
  );

  const heroStats = document.getElementById('hero-stats');
  if (heroStats) observer.observe(heroStats);
}

/* ==========================================================
   12. TOAST NOTIFICATIONS
   ========================================================== */
function showToast(message) {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className =
    'px-4 py-2.5 rounded-lg bg-slate-900/95 border border-cyan-500/40 text-cyan-300 font-mono text-xs shadow-2xl backdrop-blur-md transform transition-all duration-300 translate-y-3 opacity-0 pointer-events-auto flex items-center space-x-2';
  toast.innerHTML = `
    <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-y-3', 'opacity-0');
  }, 10);

  // Animate out
  setTimeout(() => {
    toast.classList.add('translate-y-3', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

