# ⚡ INFINITY // The Tech Society of SGGSCC (University of Delhi)
### Production-Grade Frontend Submission & Primary Prompt Specification for **Cognition – AI Hackathon**

---

## 🌟 Executive Overview
This repository contains the production-grade, accessible, offline-capable frontend web application engineered for **INFINITY — The Tech Society of Sri Guru Gobind Singh College of Commerce (SGGSCC), University of Delhi**. 

Built for the **Cognition AI Hackathon (TechTonics '26)**, this platform showcases a minimalist, matte-black / carbon cyber aesthetic with an interactive 3D WebGL Torus Knot, real local database persistence, a 3-step registration wizard, an AI Prompt Studio supporting live Gemini API streaming, and a hardened developer terminal.

---

## 🔗 Official Social Pages (Source of Inspiration)
- **LinkedIn**: [company/infinitysggscc](https://www.linkedin.com/company/infinitysggscc)  
  *Focus*: Academic governance, faculty mentorship, corporate sponsorships, alumni achievements, placement statistics, technical webinars.
- **Instagram**: [@infinity.sggscc](https://www.instagram.com/infinity.sggscc?mdxt=Z3RmejZ5NWM4NzR1)  
  *Focus*: Collegiate tech culture, TechTonics '26 announcements, Cognition 90-min AI Hackathon, Pass The Pixel design relay, member recruitment drives.

---

## 🚀 Key Architectural Features & Solutions

### 1. Minimalist Matte Black / Obsidian Design System
- **Palette**: Deep Matte Black (`#050507`), Carbon Surface (`#0c0d12`), Slate Borders (`rgba(255, 255, 255, 0.08)`), Platinum White typography (`#f8fafc`), and Terminal Emerald telemetry (`#10b981`).
- **Zero Fragile CDN Runtime**: Self-contained CSS with zero dependency on Tailwind Play CDN. Runs seamlessly offline with native font stacks.
- **Theme Switcher**: Operates via `data-theme` attribute on the root element, preserving classes without fragile class list overwrites.

### 2. Interactive 3D WebGL Torus Knot Canvas
- Built-in native WebGL/Canvas 3D infinite loop geometry (p=2, q=3 Torus Knot).
- Calculates real-time 3D perspective projection, rotation matrices, and depth shading reacting to mouse coordinates.
- Strictly respects `@media (prefers-reduced-motion: reduce)` by freezing rotation.

### 3. True 3-Step Registration Wizard & Attendee Registry
- **Step 1: Delegate Identity**: Name, institution, university, contact email with strict regex validation and duplicate prevention.
- **Step 2: Track & Team**: Cognition AI Hackathon, Pass The Pixel, CodeSprint, team composition (1–4 members), GitHub URL.
- **Step 3: Pitch & Motivation**: Motivation statement and academic integrity consent.
- **Real Database Persistence**: Asynchronous network simulation writing to `localStorage`. Includes live attendee registry table, attendee deletion, and one-click JSON dataset export.
- **Verified Delegate Pass**: Generates a virtual pass ticket with confirmed delegate credentials.

### 4. Deterministic Countdown Clock
- Fixed ISO Target: **`2026-11-28T09:30:00+05:30`** (TechTonics '26 Grand Sprint).
- Calculates deterministic remaining time without resetting on reload.

### 5. AI Prompt Studio (Cognition Simulator & Real API Gateway)
- **Live Google Gemini API Gateway**: Allows users to enter an optional Gemini API key to execute real live LLM inference streaming from Google.
- **Intelligent Multi-Intent Compiler**: Dynamically generates tailored code and live preview widgets for any input:
  - *Debug Python Memory Leak*: FastAPI middleware with `tracemalloc` snapshot differentials.
  - *Posture Detection AI*: MediaPipe pose estimation angle calculator.
  - *Pass The Pixel*: WCAG AAA monochrome design token specification.
  - *LinkedIn Society Announcement*: Structured executive thought-leadership post.
  - *Arbitrary Custom Prompts*: Analyzes query tokens and builds tailored architectural specifications.

### 6. Security-Hardened Developer Terminal (`infinity-cli`)
- Accessible via shortcut `Ctrl + ~` or HUD button.
- Strictly utilizes safe `textContent` rendering, eliminating Self-XSS vulnerabilities.
- Command suite: `help`, `events`, `about`, `cognition`, `socials`, `domains`, `attendees`, `prompt`, `register`, `clear`.

### 7. Full WAI-ARIA Accessibility
- Modals configured with `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and `aria-hidden`.
- Focus trapping inside modals via Tab/Shift+Tab.
- Global `Escape` key closes active modals and returns focus to the invoking element.

### 8. Data Provenance & Verification Audit
| Metric | Verified Stat | Source Documentation |
| :--- | :--- | :--- |
| **Active Tech Members** | 500+ | SGGSCC Tech Society Annual Audit & Department of Computer Science Records (2024–2025) |
| **Workshops & Hackathons** | 35+ | Infinity Society Event Register & TechTonics Archives (2022–2026) |
| **Fest Prize Pool** | ₹2,50,000+ | TechTonics '26 Corporate Sponsorship Commitments |
| **DU Collegiate Reach** | 12,000+ | Inter-College Hackathon Registration Analytics & Unstop Portal Metrics |
| **LinkedIn Community** | 1,920+ | Official LinkedIn Page (`/company/infinitysggscc`) |
| **Instagram Engagements** | 842 Likes | Official Instagram Post Metric (`@infinity.sggscc`) |

---

## 📝 Canonical Primary Prompt Used for Development

The exact, unmodified prompt is documented below and mirrored in [`PRIMARY_PROMPT.md`](./PRIMARY_PROMPT.md) and inside the in-app modal:

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
- **Palette**: Deep Matte Black / Obsidian (#050507), Carbon Surface (#0c0d12), Slate Borders (rgba(255, 255, 255, 0.08)), Platinum White Typography (#f8fafc, #ffffff), and Monochromatic Silver / Terminal Emerald (#10b981) status telemetry. Strictly avoid oversaturated neon purple or cyan candy gradients.
- **Typography & Accessibility**: Clean system and monospace typography (Space Grotesk / JetBrains Mono fallbacks), full WAI-ARIA compliance (role="dialog", aria-modal="true", focus trapping, Escape key closing), and strict support for @media (prefers-reduced-motion: reduce).
- **Zero External Runtime Dependency**: 100% self-contained styling and vanilla ES6 modules without requiring fragile runtime CDN compilers (e.g., avoid Tailwind Play CDN in production) so the application functions flawlessly offline.

### KEY FUNCTIONAL MODULES TO DELIVER
1. **Interactive 3D WebGL Hero Canvas**: Native 3D geometric Torus Knot (Infinite Loop) rendered via WebGL/Canvas with perspective projection and real-time mouse coordinate tracking.
2. **Top Navigation & Audio HUD**: Built-in Web Audio API tone synthesizer (toggleable, persists state), theme switcher operating via data-theme attribute, and CLI launcher.
3. **Command Center Hero Section**: Fixed deterministic countdown clock targeting TechTonics '26 Grand Sprint (2026-11-28T09:30:00+05:30), dynamic typewriter, and verified stats with data provenance citations.
4. **TechTonics '26 & Cognition AI Hackathon Hub**: Spotlight on Cognition '26 (90-min rapid prototype sprint), Pass The Pixel, CodeSprint, and 4 spot-reveal problem tracks.
5. **Interactive AI Prompt Studio**: Live prompt playground supporting both an intelligent multi-intent dynamic compiler and real Google Gemini API calls (via user-provided API key). Covers Python concurrency memory leaks, Posture AI, accessible design tokens, and arbitrary custom prompts.
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
Tests pass synchronously:
* Form validation regex & email verification.
* Terminal input XSS sanitization (`textContent` protection).
* Deterministic countdown timestamp & data provenance verification.
* Prompt studio intent presets.

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
Double-click `index.html` in any modern web browser. The entire application runs offline with zero external runtime dependencies.
