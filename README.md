# ⚡ INFINITY // The Tech Society of SGGSCC (University of Delhi)
### Production-Grade Frontend Submission & Primary Prompt Specification for **Cognition – AI Hackathon**

[![Live Demo](https://img.shields.io/badge/Live_Deployment-infinityfronted.netlify.app-00DC82?style=for-the-badge&logo=netlify&logoColor=white)](https://infinityfronted.netlify.app/)
[![Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/SyedSehran/INFINITY_Webpage)

---

## 🌐 Live Production Deployment
- **Official Live Website**: [**https://infinityfronted.netlify.app/**](https://infinityfronted.netlify.app/)
- **Repository**: [https://github.com/SyedSehran/INFINITY_Webpage](https://github.com/SyedSehran/INFINITY_Webpage)

---

## 🌟 Executive Overview
This repository contains the production-grade, accessible, offline-capable frontend web application engineered for **INFINITY — The Tech Society of Sri Guru Gobind Singh College of Commerce (SGGSCC), University of Delhi**. 

Built for the **Cognition AI Hackathon (TechTonics '26)**, this platform showcases a sleek, high-contrast cyber aesthetic with an interactive Three.js 3D WebGL Torus Knot, real local database persistence, a 3-step registration wizard, an AI Prompt Studio supporting live Gemini API streaming, and a hardened developer terminal.

---

## 🔗 Official Social Pages (Source of Inspiration)
- **LinkedIn**: [company/infinitysggscc](https://www.linkedin.com/company/infinitysggscc)  
  *Focus*: Academic governance, faculty mentorship, corporate sponsorships, alumni achievements, placement statistics, technical webinars.
- **Instagram**: [@infinity.sggscc](https://www.instagram.com/infinity.sggscc?mdxt=Z3RmejZ5NWM4NzR1)  
  *Focus*: Collegiate tech culture, TechTonics '26 announcements, Cognition 90-min AI Hackathon, Pass The Pixel design relay, member recruitment drives.

---

## 🚀 Key Architectural Features & Solutions

### 1. High-Contrast Modern Aesthetic & Self-Hosted Typography
- **Design Philosophy**: High-contrast, dark technical aesthetic with glassmorphic depth, refined luminous container accents, and high-readability typography hierarchy.
- **Self-Hosted Fonts**: Offline-first `@fontsource/space-grotesk` and `@fontsource/jetbrains-mono` `.woff2` font files hosted locally in `fonts/`. Zero dependency on external Google Fonts CDNs.
- **Theme Switcher**: Operates safely via `data-theme` attribute on the root element, preserving classes without wiping element classes.

### 2. Interactive Three.js 3D WebGL Torus Knot Canvas
- Authentic WebGL rendering using Three.js with perspective projection, directional/ambient lighting, and dual solid/wireframe mesh geometry (`p=2, q=3` Infinity Torus Knot).
- Real-time mouse coordinate tracking with smooth damping (lerp).
- Strictly respects `@media (prefers-reduced-motion: reduce)` by freezing rotation.

### 3. True 3-Step Registration Wizard & Attendee Registry
- **Step 1: Delegate Identity**: Name, institution, university, contact email with strict validation and duplicate prevention.
- **Step 2: Track & Team**: Cognition AI Hackathon, Pass The Pixel, CodeSprint, team composition (1–4 members), GitHub URL.
- **Step 3: Pitch & Motivation**: Motivation statement and academic integrity consent.
- **Real Database Persistence**: Asynchronous network simulation writing to `localStorage`. Includes live attendee registry table, attendee deletion, search filters, and one-click JSON dataset export.
- **Virtual Demo Delegate Pass**: Generates a printable delegate pass ticket with unique Pass ID.

### 4. Deterministic Countdown Clock
- Fixed ISO Target: **`2026-11-28T09:30:00+05:30`** (TechTonics '26 Grand Sprint).
- Calculates deterministic remaining time without resetting on reload.

### 5. AI Prompt Studio (Cognition Simulator & Real API Gateway)
- **Live Google Gemini API Gateway**: Allows users to enter an optional Gemini API key to execute real live LLM inference streaming from Google.
- **Semantic Intent Classifier (`classifyPromptIntent`)**: Accurately routes user prompts with word boundary precision:
  - *REST API Router*: Generates Express.js / Zod schema endpoints (e.g. for "Design a REST API for memory cards").
  - *Debug Python Memory Leak*: FastAPI middleware with `tracemalloc` snapshot differentials.
  - *Posture Detection AI*: MediaPipe pose estimation angle calculator.
  - *Pass The Pixel*: WCAG AAA monochrome design token specification.
  - *LinkedIn Society Announcement*: Structured executive thought-leadership post referencing upcoming sprint registrations.
  - *Arbitrary Custom Prompts*: Dynamically synthesizes architecture specifications for custom prompts.
- **Dynamic Simulated Model Binding**: Prepend `// [SIMULATED INFERENCE] • Model: <selectedModel>` dynamically to all simulated outputs.

### 6. Security-Hardened Developer Terminal (`infinity-cli`)
- Accessible via shortcut `Ctrl + ~` or HUD button.
- Strictly utilizes safe `textContent` rendering, eliminating Self-XSS vulnerabilities.
- Command suite: `help`, `events`, `about`, `cognition`, `socials`, `domains`, `attendees`, `prompt`, `register`, `clear`.

### 7. Full WAI-ARIA Accessibility
- Modals configured with `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and `aria-hidden`.
- Focus trapping inside modals via Tab/Shift+Tab.
- Global `Escape` key closes active modals and returns focus to the invoking element.

### 8. Transparent Community Benchmarks
| Metric | Benchmark Stat | Attribution Disclosure |
| :--- | :--- | :--- |
| **Active Tech Members** | 500+ | Society student membership roster (Demonstration metric) |
| **Workshops & Hackathons** | 35+ | TechTonics archive catalog (Demonstration metric) |
| **Fest Prize Pool** | ₹2,50,000+ | Estimated prize pool allocation (Demonstration metric) |
| **DU Collegiate Reach** | 12,000+ | Collegiate hackathon outreach benchmark (Demonstration metric) |
| **LinkedIn Community** | 1,900+ | Official handle `@infinitysggscc` (Estimated milestone) |
| **Instagram Engagements** | 800+ Likes | Official handle `@infinity.sggscc` (Estimated milestone) |

---

## 📝 Canonical Primary Prompt Used for Development

The canonical specification prompt utilized for the development of the application:

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
- **Design Philosophy**: High-contrast, dark technical aesthetic with glassmorphic depth, refined luminous container accents, and high-readability typography hierarchy. Prioritize clean layout structure, clear separation of containers, and subtle ambient glows.
- **Typography & Accessibility**: Clean geometric display and monospace typography (Space Grotesk and JetBrains Mono), full WAI-ARIA compliance (role="dialog", aria-modal="true", focus trapping, Escape key closing), and strict support for @media (prefers-reduced-motion: reduce).
- **Self-Sufficiency**: Self-hosted fonts, compiled stylesheets, and native ES6 modular architecture without requiring fragile runtime CDN compilers so the application functions flawlessly offline.

### KEY FUNCTIONAL MODULES TO DELIVER
1. **Interactive 3D WebGL Hero Canvas**: Native 3D geometric Torus Knot (Infinite Loop) rendered via WebGL/Three.js with perspective projection and real-time mouse coordinate tracking.
2. **Top Navigation & Audio HUD**: Built-in Web Audio API tone synthesizer (toggleable, persists state), theme switcher operating via data-theme attribute, and CLI launcher.
3. **Command Center Hero Section**: Fixed deterministic countdown clock targeting TechTonics '26 Grand Sprint (2026-11-28T09:30:00+05:30), dynamic typewriter, and transparent demonstration metrics.
4. **TechTonics '26 & Cognition AI Hackathon Hub**: Spotlight on Cognition '26 (90-min rapid prototype sprint), Pass The Pixel, CodeSprint, and 4 spot-reveal problem tracks.
5. **Interactive AI Prompt Studio**: Live prompt playground supporting both an intelligent multi-intent dynamic compiler and real Google Gemini API calls (via user-provided API key). Covers REST APIs, Python concurrency memory leaks, Posture AI, accessible design tokens, and arbitrary custom prompts.
6. **True Multi-Step Registration Wizard & Attendee Registry**: 3-step wizard with real asynchronous API call simulation, persistent localStorage database, duplicate checking, JSON export, and personalized Delegate Pass generation.
7. **Security-Hardened Developer Terminal (infinity-cli)**: Accessible via Ctrl+~ with textContent-based safe rendering, eliminating Self-XSS vulnerabilities.
8. **Past Hackathon Project Showcases**: Case study modals for CogniFlow AI, PixelCraft 2.0, and DU Transit AI.
9. **Curated Social Media Feedwall**: Interactive post cards mirroring Instagram (@infinity.sggscc) and LinkedIn (/company/infinitysggscc) with inspection modals.
10. **Canonical Primary Prompt Modal & One-Click Export**: Single source of truth for prompt specifications with verified copy and download.
```

---

## 🧪 Automated Unit Testing
Run the test suite using Node.js's native test runner:
```bash
npm test
```
Verifies real modules:
* `validateEmail` from `js/registration.js` across valid and invalid inputs.
* `classifyPromptIntent` from `js/prompt-studio.js` verifying keyword priority (e.g. "REST API for memory cards" correctly routing to `rest-api` rather than Python memory leak).
* `TECHTONICS_TARGET_DATE` and `DATA_PROVENANCE` integrity from `js/state.js`.
* `PROMPT_PRESETS` completeness across all presets.

---

## 💻 Running the Application

### Option A: Local Server
```bash
# Using Python
python -m http.server 3000
# Or using npm
npm start
```
Navigate to `http://localhost:3000`.

### Option B: Offline Direct Preview
Open `index.html` in any modern web browser. The entire application runs offline with zero external runtime dependencies.
