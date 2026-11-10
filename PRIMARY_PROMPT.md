# PRIMARY PROMPT — INFINITY // THE TECH SOCIETY OF SGGSCC (UNIVERSITY OF DELHI)

Below is the canonical primary prompt formulated and utilized for the architectural engineering, UI design, and end-to-end development of the **INFINITY** web application for the **Cognition – AI Hackathon** (TechTonics '26, Sri Guru Gobind Singh College of Commerce, University of Delhi).

---

```markdown
### SYSTEM ROLE & ARCHITECTURAL OBJECTIVE
You are a Principal Frontend Architect and Creative Technologist specializing in ultra-modern, high-performance, accessible web applications for premier collegiate technology societies and hackathons.

Your task is to build a fully functional, production-ready, accessible, and visually captivating frontend web application for:
**INFINITY — The Tech Society of Sri Guru Gobind Singh College of Commerce (SGGSCC), University of Delhi**.

### SOCIAL MEDIA BRANDING & INSPIRATION
Incorporate the identity, tone, initiatives, and visual aesthetics from the official social handles:
- **LinkedIn**: https://www.linkedin.com/company/infinitysggscc
  (Focus: Academic credibility, faculty governance, placement achievements, corporate sponsorships, alumni networks, webinars)
- **Instagram**: https://www.instagram.com/infinity.sggscc?mdxt=Z3RmejZ5NWM4NzR1
  (Focus: Collegiate tech culture, TechTonics '26 flagship festival announcements, Cognition 90-min AI Hackathon, Pass The Pixel design relay, member recruitment drives, byte-sized technology insights)

### CORE THEME & DESIGN SYSTEM
- **Palette**: Deep Matte Black / Obsidian (`#050507`), Carbon Surface (`#0c0d12`), Slate Borders (`rgba(255, 255, 255, 0.08)`), Platinum White Typography (`#f8fafc`, `#ffffff`), and Monochromatic Silver / Terminal Emerald (`#10b981`) status telemetry. Strictly avoid oversaturated neon purple or cyan candy gradients.
- **Typography & Accessibility**: Clean system and monospace typography (Space Grotesk / JetBrains Mono fallbacks), full WAI-ARIA compliance (`role="dialog"`, `aria-modal="true"`, focus trapping, Escape key closing), and strict support for `@media (prefers-reduced-motion: reduce)`.
- **Zero External Runtime Dependency**: 100% self-contained styling and vanilla ES6 modules without requiring fragile runtime CDN compilers (e.g., avoid Tailwind Play CDN in production) so the application functions flawlessly offline.

### KEY FUNCTIONAL MODULES TO DELIVER

1. **Interactive 3D WebGL Hero Canvas**:
   - Native 3D geometric Torus Knot (Infinite Loop) rendered via WebGL/Canvas with perspective projection and real-time mouse coordinate tracking.
   - Respects user motion preferences by freezing rotation under reduced-motion mode.

2. **Top Navigation & Audio HUD**:
   - Society emblem with infinity glyph (`∞`) and college credentials.
   - Built-in Web Audio API tone synthesizer (toggleable, persists state).
   - Theme switcher operating safely via `data-theme` attribute (without wiping element classes).
   - Quick triggers for CLI Terminal, Primary Prompt, and Registration Pass.

3. **Command Center Hero Section**:
   - Fixed deterministic countdown clock targeting TechTonics '26 Grand Sprint (2026-11-28T09:30:00+05:30) that does not reset on page reload.
   - Dynamic typewriter cycling through verified collegiate initiatives.
   - Real-time verified stats counter with transparent data provenance citations.

4. **TechTonics '26 & Cognition AI Hackathon Hub**:
   - Comprehensive spotlight on **Cognition '26**: 90-minute time-boxed rapid prototype sprint, 2–4 member teams, AI toolkits permitted, and judging criteria.
   - Spotlights on **Pass The Pixel** (UI/UX design relay) and **CodeSprint** (DSA speed arena).
   - Spot-reveal problem statement tracks: Autonomous Campus AI, Accessible UI/UX Systems, Social Branding AI, and Decentralized Society Ledger.

5. **Interactive AI Prompt Studio (Cognition Simulator & Real API Gateway)**:
   - Live prompt playground supporting both an intelligent multi-intent dynamic compiler and real Google Gemini API calls (via user-provided API key).
   - Covers distinct domain intents:
     * Python Concurrency & Memory Leak Diagnostics (with `tracemalloc` and diff profiling).
     * Posture & Ergonomics Detection (MediaPipe pose tracking component).
     * Accessible Design Tokens (WCAG AAA monochrome contrast tokens).
     * LinkedIn Leadership Announcements.
     * Dynamic synthesis for any arbitrary custom prompt.

6. **True Multi-Step Registration Wizard & Attendee Registry**:
   - Step 1: Delegate Identity & Institution (Name, College, University, validated Email with duplicate verification).
   - Step 2: Track Selection & Team Composition (Track, Team Size 1–4, Team Member Names, GitHub URL).
   - Step 3: Motivation Statement & Integrity Declaration.
   - Real asynchronous API call simulation with persistent `localStorage` database, exportable attendee dataset (.json), and generation of a personalized, verified virtual Delegate Pass Ticket.

7. **Security-Hardened Developer Terminal (`infinity-cli`)**:
   - Interactive shell accessible via `Ctrl + ~` with commands: `help`, `events`, `about`, `cognition`, `socials`, `domains`, `attendees`, `prompt`, `register`, `clear`.
   - Strictly utilizes `textContent` and safe DOM manipulation, eliminating Self-XSS vulnerabilities.

8. **Past Hackathon Project Showcases**:
   - Interactive modal showcases for past award-winning solutions: CogniFlow AI, PixelCraft 2.0, and DU Transit AI.

9. **Curated Social Media Feedwall**:
   - Interactive post cards mirroring Instagram (@infinity.sggscc) and LinkedIn (/company/infinitysggscc) with post inspection modals and engagement counters.

10. **Canonical Primary Prompt Modal & One-Click Export**:
    - One single source of truth for prompt specifications with verified copy-to-clipboard and file download.
```

---

### VERIFICATION & COMPLIANCE
- **Deterministic Chronology**: Past event showcases explicitly reference Cognition '25 / past archives, while active countdowns and registrations reference the upcoming Cognition '26 / TechTonics '26 sprint.
- **Security**: All dynamic content insertions are sanitized against DOM-based XSS attacks.
- **Self-Sufficiency**: Fully functional locally, offline, or statically hosted via Vercel, Netlify, or GitHub Pages.
