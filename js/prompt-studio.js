/**
 * INFINITY // AI Prompt Studio Engine
 * Supports real Gemini API streaming (when user provides API key)
 * and an intelligent multi-intent dynamic compiler for any query.
 */

import { getSavedApiKey, saveApiKey } from './state.js';
import { playClick, playSuccess } from './audio.js';

export const PROMPT_PRESETS = {
  cognition: {
    title: "Cognition '26 Hackathon Prototype",
    prompt: "Build an accessible, high-performance web dashboard for TechTonics '26 featuring real-time AI prompt telemetry, a matte black carbon aesthetic, and verified delegate registration.",
    model: "Gemini 2.5 Flash",
    category: "frontend"
  },
  'python-leak': {
    title: "Debug Python Memory Leak",
    prompt: "Diagnose and fix a high-concurrency memory leak in a FastAPI asynchronous web worker using tracemalloc and objgraph snapshots.",
    model: "Claude 3.7 Sonnet",
    category: "python-debug"
  },
  'rest-api': {
    title: "Design REST API for Memory Cards",
    prompt: "Design a REST API router for memory cards with CRUD operations, search filters, error handling, and validation.",
    model: "Gemini 2.5 Flash",
    category: "backend-api"
  },
  'posture-app': {
    title: "Posture Detection & Ergonomics AI",
    prompt: "Create an AI-driven posture detection component using MediaPipe and React Webcam to alert students of spinal slouching during coding hackathons.",
    model: "Gemini 2.5 Flash",
    category: "computer-vision"
  },
  'pixel-spec': {
    title: "Pass The Pixel Design Tokens",
    prompt: "Generate an accessible, high-contrast monochrome design token specification for the Pass The Pixel competition, adhering to WCAG AAA standards.",
    model: "Claude 3.7 Sonnet",
    category: "design-system"
  },
  'linkedin-recap': {
    title: "LinkedIn Society Announcement",
    prompt: "Draft an engaging LinkedIn announcement celebrating Infinity SGGSCC's Cognition hackathon countdown and opening of delegate registration passes.",
    model: "GPT-4o",
    category: "social-branding"
  }
};

/**
 * Deterministic Semantic Intent Classifier
 * Accurately routes user prompts to relevant code synthesizers with word boundary precision.
 */
export function classifyPromptIntent(promptText) {
  if (!promptText || typeof promptText !== 'string') return 'custom-synthesis';
  const lower = promptText.toLowerCase();

  // 1. Python Memory Leak Intent (Prioritize when leak/tracemalloc is explicitly targeted)
  const isLeak = lower.includes('tracemalloc') || (lower.includes('leak') && (lower.includes('memory') || lower.includes('python') || lower.includes('heap') || lower.includes('worker')));
  if (isLeak) {
    return 'python-leak';
  }

  // 2. REST API / Backend Endpoint Intent
  const hasApiKeyword = /\b(rest|crud|endpoint|endpoints|router)\b/i.test(lower) || /\bapi\b/i.test(lower) || (lower.includes('memory') && lower.includes('card'));
  if (hasApiKeyword) {
    return 'rest-api';
  }

  // 3. Posture / Computer Vision Intent
  if (
    lower.includes('posture') ||
    lower.includes('mediapipe') ||
    lower.includes('webcam') ||
    lower.includes('slouch') ||
    lower.includes('ergonomic')
  ) {
    return 'posture-vision';
  }

  // 4. Design Tokens / UI Specs Intent
  if (
    lower.includes('token') ||
    lower.includes('pixel') ||
    (lower.includes('design') && lower.includes('system')) ||
    (lower.includes('contrast') && lower.includes('wcag'))
  ) {
    return 'design-tokens';
  }

  // 5. LinkedIn / Social Branding Intent
  if (
    lower.includes('linkedin') ||
    lower.includes('instagram') ||
    lower.includes('announcement') ||
    (lower.includes('social') && lower.includes('post'))
  ) {
    return 'social-post';
  }

  return 'custom-synthesis';
}

export function initPromptStudio() {
  const promptInput = document.getElementById('ai-prompt-input');
  const modelSelect = document.getElementById('ai-model-select');
  const runBtn = document.getElementById('run-prompt-btn');
  const apiKeyInput = document.getElementById('gemini-api-key-input');
  const saveKeyBtn = document.getElementById('save-api-key-btn');
  const outputCode = document.getElementById('prompt-output-code');
  const outputPreview = document.getElementById('prompt-output-preview');
  const statusIndicator = document.getElementById('prompt-status-indicator');
  const presetBtns = document.querySelectorAll('[data-preset]');
  const tabBtns = document.querySelectorAll('[data-studio-tab]');

  if (!promptInput || !runBtn) return;

  // Load saved API Key
  if (apiKeyInput) {
    apiKeyInput.value = getSavedApiKey();
    if (saveKeyBtn) {
      saveKeyBtn.addEventListener('click', () => {
        saveApiKey(apiKeyInput.value.trim());
        showLocalToast('Gemini API Key saved locally in browser storage.');
      });
    }
  }

  // Presets Click Handler
  presetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-preset');
      const data = PROMPT_PRESETS[key];
      if (data) {
        promptInput.value = data.prompt;
        if (modelSelect) modelSelect.value = data.model;
        playClick(540, 0.04);
        showLocalToast(`Loaded preset: ${data.title}`);
      }
    });
  });

  // Tab Switching (Preview vs Code)
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const target = btn.getAttribute('data-studio-tab');
      if (target === 'preview') {
        outputPreview.style.display = 'block';
        outputCode.parentElement.style.display = 'none';
      } else {
        outputPreview.style.display = 'none';
        outputCode.parentElement.style.display = 'block';
      }
      playClick(480, 0.02);
    });
  });

  // Run Synthesis
  runBtn.addEventListener('click', async () => {
    const promptText = promptInput.value.trim();
    if (!promptText) {
      showLocalToast('Please enter a prompt or pick a preset above.');
      return;
    }

    const selectedModel = modelSelect ? modelSelect.value : 'Gemini 2.5 Flash';
    const apiKey = getSavedApiKey() || (apiKeyInput ? apiKeyInput.value.trim() : '');

    runBtn.disabled = true;
    runBtn.textContent = 'Synthesizing Response...';
    statusIndicator.textContent = `Inference in progress via ${selectedModel}...`;

    try {
      if (apiKey && selectedModel.startsWith('Gemini')) {
        // Real Live Gemini API Call
        await callRealGeminiAPI(apiKey, promptText, selectedModel, outputCode, outputPreview);
        statusIndicator.textContent = `Live inference completed via ${selectedModel} (Real Gemini API)`;
      } else {
        // Intelligent Multi-Intent Compiler
        await simulateIntelligentCompilation(promptText, selectedModel, outputCode, outputPreview);
        statusIndicator.textContent = `Simulated in 0.28s • Tokens: ~${Math.floor(promptText.length * 1.3 + 320)} • Model: ${selectedModel} [Simulated]`;
      }
      playSuccess();
    } catch (err) {
      statusIndicator.textContent = `Error: ${err.message}`;
      showLocalToast(`Inference Notice: ${err.message}`);
    } finally {
      runBtn.disabled = false;
      runBtn.textContent = 'Synthesize Prompt';
    }
  });
}

/**
 * Real Google Gemini REST API Call
 */
async function callRealGeminiAPI(apiKey, prompt, modelName, codeEl, previewEl) {
  const modelEndpoint = modelName.includes('2.5') ? 'gemini-2.5-flash' : 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelEndpoint}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 1200, temperature: 0.4 }
    })
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    throw new Error(errorJson.error?.message || `API request failed with status ${response.status}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '// No response content returned.';

  codeEl.textContent = rawText;
  previewEl.innerHTML = `
    <div class="surface-card p-4">
      <div class="badge badge-emerald mb-2">LIVE GEMINI API RESPONSE • ${escapeHTML(modelName)}</div>
      <div class="text-sm text-secondary whitespace-pre-wrap">${escapeHTML(rawText.substring(0, 600))}...</div>
    </div>
  `;
}

/**
 * Intelligent Multi-Intent Synthesizer
 * Accurately adapts output according to user input semantics (REST APIs, Python leaks, posture detection, UI components, etc.)
 * Dynamically binds selectedModel and explicitly labels output as simulated.
 */
async function simulateIntelligentCompilation(prompt, model, codeEl, previewEl) {
  await new Promise((resolve) => setTimeout(resolve, 280));

  const intent = classifyPromptIntent(prompt);

  // 1. REST API / Backend Endpoint Intent
  if (intent === 'rest-api') {
    codeEl.textContent = `// [SIMULATED INFERENCE] • Model: ${model} • Mode: Local Dynamic Synthesizer
// Express.js REST API Router: Memory Cards Service
import express from 'express';
import { z } from 'zod';

const router = express.Router();

// Memory Card Schema Validation
const MemoryCardSchema = z.object({
  title: z.string().min(2).max(120),
  category: z.string().default('General'),
  capacityMB: z.number().positive(),
  readSpeedMBs: z.number().positive(),
  tags: z.array(z.string()).default([])
});

const cardsDatabase = new Map();

// GET /api/memory-cards
router.get('/', (req, res) => {
  const { category, minCapacity } = req.query;
  let items = Array.from(cardsDatabase.values());
  
  if (category) {
    items = items.filter(c => c.category.toLowerCase() === String(category).toLowerCase());
  }
  if (minCapacity) {
    items = items.filter(c => c.capacityMB >= Number(minCapacity));
  }
  
  res.status(200).json({ count: items.length, data: items });
});

// POST /api/memory-cards
router.post('/', (req, res) => {
  const result = MemoryCardSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Validation failed', issues: result.error.issues });
  }
  
  const id = 'card_' + Math.random().toString(36).substring(2, 9);
  const newCard = { id, ...result.data, createdAt: new Date().toISOString() };
  cardsDatabase.set(id, newCard);
  
  res.status(201).json({ message: 'Memory card registered', card: newCard });
});

export default router;`;

    previewEl.innerHTML = `
      <div class="surface-card p-4">
        <div class="flex items-center justify-between pb-2 mb-3 border-b border-subtle">
          <span class="badge badge-emerald">SIMULATED INFERENCE • ${escapeHTML(model)}</span>
          <span class="font-mono text-xs text-secondary">REST API ROUTER (Express / Zod)</span>
        </div>
        <div class="space-y-2 text-xs font-mono">
          <div class="p-2 bg-black rounded flex justify-between items-center">
            <span class="text-emerald-400 font-bold">GET /api/memory-cards</span>
            <span class="text-muted">200 OK • Filter by category</span>
          </div>
          <div class="p-2 bg-black rounded flex justify-between items-center">
            <span class="text-sky-400 font-bold">POST /api/memory-cards</span>
            <span class="text-muted">201 Created • Zod Schema</span>
          </div>
          <p class="text-muted text-[11px] mt-2">Validated CRUD endpoints with memory card telemetry and schema enforcement.</p>
        </div>
      </div>
    `;
    return;
  }

  // 2. Python Memory Leak / Profiling Intent
  if (intent === 'python-leak') {
    codeEl.textContent = `// [SIMULATED INFERENCE] • Model: ${model} • Mode: Local Dynamic Synthesizer
# Diagnostics: High-Concurrency Memory Leak Isolation
import tracemalloc
import gc
from fastapi import FastAPI, Request

app = FastAPI(title="Infinity Concurrency Sentinel")
tracemalloc.start(25)
snapshot_baseline = None

@app.middleware("http")
async def memory_profiling_middleware(request: Request, call_next):
    global snapshot_baseline
    if snapshot_baseline is None:
        snapshot_baseline = tracemalloc.take_snapshot()
    
    response = await call_next(request)
    
    current_snapshot = tracemalloc.take_snapshot()
    top_diffs = current_snapshot.compare_to(snapshot_baseline, 'lineno')
    
    # Identify unbounded object retention
    for stat in top_diffs[:3]:
        if stat.size_diff > 1024 * 1024:  # > 1MB growth
            print(f"[MEMORY LEAK ALERT] {stat.traceback}: +{stat.size_diff / 1024:.2f} KB")
            
    return response`;

    previewEl.innerHTML = `
      <div class="surface-card p-4">
        <div class="flex items-center justify-between pb-2 mb-3 border-b border-subtle">
          <span class="badge badge-emerald">SIMULATED INFERENCE • ${escapeHTML(model)}</span>
          <span class="font-mono text-xs text-muted">SNAPSHOT DIFF: +14.2 MB</span>
        </div>
        <div class="space-y-2 text-xs font-mono">
          <div class="p-2 bg-black rounded flex justify-between">
            <span class="text-secondary">fastapi/middleware.py:42</span>
            <span class="text-red-400 font-bold">+8,420 KB</span>
          </div>
          <div class="p-2 bg-black rounded flex justify-between">
            <span class="text-secondary">asyncio/runners.py:118</span>
            <span class="text-amber-400 font-bold">+4,110 KB</span>
          </div>
          <p class="text-muted text-[11px] mt-2">Unbounded closure retention identified in background async worker queue.</p>
        </div>
      </div>
    `;
    return;
  }

  // 3. Posture Detection / Computer Vision Intent
  if (intent === 'posture-vision') {
    codeEl.textContent = `// [SIMULATED INFERENCE] • Model: ${model} • Mode: Local Dynamic Synthesizer
// Ergonomics & Posture Sentinel Component
import React, { useRef, useEffect, useState } from 'react';
import { Pose, POSE_LANDMARKS } from '@mediapipe/pose';

export const PostureGuardian = () => {
  const [postureScore, setPostureScore] = useState(94);
  const [alertSlouch, setAlertSlouch] = useState(false);

  const calculateCervicalAngle = (ear, shoulder, hip) => {
    const radians = Math.atan2(hip.y - shoulder.y, hip.x - shoulder.x) -
                    Math.atan2(ear.y - shoulder.y, ear.x - shoulder.x);
    return Math.abs((radians * 180.0) / Math.PI);
  };

  return (
    <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
      <div className="flex justify-between items-center">
        <h4 className="text-white font-bold">Ergonomics Telemetry</h4>
        <span className={postureScore > 80 ? 'text-emerald-400' : 'text-red-400'}>
          {postureScore}% Optimal
        </span>
      </div>
      {alertSlouch && <div className="mt-2 text-red-400 text-xs font-bold">⚠️ Warning: Spinal Slouch Detected</div>}
    </div>
  );
};`;

    previewEl.innerHTML = `
      <div class="surface-card p-4">
        <div class="flex items-center justify-between mb-3 pb-2 border-b border-subtle">
          <span class="badge badge-emerald">SIMULATED INFERENCE • ${escapeHTML(model)}</span>
          <span class="text-xs font-mono text-emerald-400 font-bold">96% OPTIMAL</span>
        </div>
        <div class="grid grid-cols-2 gap-2 text-xs font-mono mb-2">
          <div class="p-2 bg-black rounded">
            <span class="text-muted block text-[10px]">CERVICAL ANGLE</span>
            <span class="text-white font-bold">14.2° (Target &lt; 20°)</span>
          </div>
          <div class="p-2 bg-black rounded">
            <span class="text-muted block text-[10px]">SHOULDER DELTA</span>
            <span class="text-emerald-400 font-bold">Symmetric</span>
          </div>
        </div>
        <p class="text-muted text-[11px]">Real-time video inference tracking cranial alignment during sprints.</p>
      </div>
    `;
    return;
  }

  // 4. Design Tokens / UI Specs Intent
  if (intent === 'design-tokens') {
    codeEl.textContent = `// [SIMULATED INFERENCE] • Model: ${model} • Mode: Local Dynamic Synthesizer
/* Pass The Pixel // High-Contrast Monochrome Design Tokens */
:root {
  --color-canvas-black: #050507;
  --color-surface-elevated: #0f1016;
  --color-border-high-contrast: #e4e4e7;
  --color-text-platinum: #f8fafc;
  --color-accent-emerald: #10b981;
  --font-display: 'Space Grotesk', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --shadow-matte: 0 16px 36px -10px rgba(0, 0, 0, 0.95);
}

.pixel-pass-card {
  background-color: var(--color-surface-elevated);
  border: 1px solid var(--color-border-high-contrast);
  color: var(--color-text-platinum);
  box-shadow: var(--shadow-matte);
}`;

    previewEl.innerHTML = `
      <div class="surface-card p-4">
        <span class="badge badge-white mb-2">SIMULATED INFERENCE • ${escapeHTML(model)}</span>
        <h4 class="text-sm font-bold text-white">Monochrome Contrast Specifications</h4>
        <div class="flex gap-2 mt-3">
          <div class="w-8 h-8 rounded bg-black border border-white flex items-center justify-center text-[9px] font-bold">#000</div>
          <div class="w-8 h-8 rounded bg-zinc-800 border border-zinc-600 flex items-center justify-center text-[9px]">#222</div>
          <div class="w-8 h-8 rounded bg-white text-black font-bold flex items-center justify-center text-[9px]">#FFF</div>
          <div class="w-8 h-8 rounded bg-emerald-600 text-black font-bold flex items-center justify-center text-[9px]">#EMR</div>
        </div>
        <p class="text-muted text-[11px] mt-2">WCAG AAA compliant: 14.8:1 contrast ratio against deep obsidian canvas.</p>
      </div>
    `;
    return;
  }

  // 5. LinkedIn / Social Post Intent (Refers forward to upcoming Cognition '26)
  if (intent === 'social-post') {
    codeEl.textContent = `// [SIMULATED INFERENCE] • Model: ${model} • Mode: Local Dynamic Synthesizer
// LinkedIn Strategic Tech Leadership Update
Headline: "🚀 90 Minutes. Infinite Breakthroughs. Cognition '26 Hackathon Registrations are Officially Live!"

Hook:
When engineering at the collegiate frontier, velocity without architectural clarity is noise.

Key Details for Collegiate Innovators:
1. 90-Minute Rapid Prototyping Sprint — evaluate ideas, not slide decks.
2. AI Toolkits explicitly permitted and encouraged with full provenance tracking.
3. Sri Guru Gobind Singh College of Commerce, University of Delhi welcomes delegating teams.

Countdown to TechTonics '26 Grand Sprint is active. Claim your delegate pass now!

Hashtags: #InfinitySGGSCC #TechTonics #DelhiUniversity #AIHackathon #SoftwareEngineering`;

    previewEl.innerHTML = `
      <div class="surface-card p-4">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-7 h-7 rounded bg-white text-black font-bold flex items-center justify-center text-xs">IN</div>
          <div>
            <p class="text-xs font-bold text-white">Infinity – The Tech Society, SGGSCC</p>
            <p class="text-[10px] text-muted">Simulated Inference • Model: ${escapeHTML(model)}</p>
          </div>
        </div>
        <p class="text-xs text-secondary leading-relaxed">
          🚀 90 Minutes. Infinite Breakthroughs. Cognition '26 delegate registrations are officially live for University of Delhi students!
        </p>
      </div>
    `;
    return;
  }

  // 6. Default General Contextual Synthesis for Any Custom Prompt
  const cleanTitle = prompt.split(' ').slice(0, 5).join(' ');
  codeEl.textContent = `// [SIMULATED INFERENCE] • Model: ${model} • Mode: Local Dynamic Synthesizer
// Synthesized Architecture Specification
// Prompt: "${prompt}"

export const ArchitectureModule = {
  specification: "${cleanTitle}",
  compiler: "Infinity Contextual Engine v3.0",
  targetRuntime: "Node.js 24+ / Modern ES6+",
  simulatedModel: "${model}",
  
  execute: async (context) => {
    const telemetry = {
      timestamp: new Date().toISOString(),
      latency: "18.4ms",
      status: "OPTIMAL",
      resolvedParameters: ${JSON.stringify(prompt.split(' ').slice(0, 4))}
    };
    return telemetry;
  }
};`;

  previewEl.innerHTML = `
    <div class="surface-card p-4">
      <div class="flex items-center justify-between pb-2 mb-2 border-b border-subtle">
        <span class="badge badge-emerald">SIMULATED INFERENCE</span>
        <span class="text-[10px] font-mono text-muted">Model: ${escapeHTML(model)}</span>
      </div>
      <h4 class="text-xs font-bold text-white mb-1">${escapeHTML(prompt)}</h4>
      <p class="text-xs text-secondary mt-1">
        Architecture generated with tailored parameters matching your exact prompt statement.
      </p>
    </div>
  `;
}

function showLocalToast(msg) {
  const shelf = document.getElementById('toast-shelf');
  if (!shelf) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="badge badge-emerald">•</span><span>${escapeHTML(msg)}</span>`;
  shelf.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

function escapeHTML(str) {
  const p = document.createElement('p');
  p.textContent = str;
  return p.innerHTML;
}
