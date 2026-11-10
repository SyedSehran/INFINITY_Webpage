/**
 * INFINITY // Test Suite
 * Directly tests real project functions from js/registration.js, js/prompt-studio.js, and js/state.js.
 * Executable via `npm test` using Node.js built-in test runner.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

import { validateEmail } from '../js/registration.js';
import { classifyPromptIntent, PROMPT_PRESETS } from '../js/prompt-studio.js';
import { TECHTONICS_TARGET_DATE, DATA_PROVENANCE, SEED_ATTENDEES, apiRegisterAttendee, getAttendees } from '../js/state.js';

test('Real Registration Email Validation (validateEmail)', () => {
  assert.equal(validateEmail('aryan.sharma@sggscc.ac.in'), true);
  assert.equal(validateEmail('student@du.ac.in'), true);
  assert.equal(validateEmail('dev@infinity.org'), true);

  // Invalid cases
  assert.equal(validateEmail('invalid-email'), false);
  assert.equal(validateEmail('missing@domain'), false);
  assert.equal(validateEmail(''), false);
  assert.equal(validateEmail(null), false);
  assert.equal(validateEmail(undefined), false);
  assert.equal(validateEmail('   '), false);
});

test('Prompt Intent Classifier (Keyword Priority & False Positive Immunity)', () => {
  // Critical regression test: "memory cards" + "API" must resolve to REST API, not Python leak!
  const apiIntent = classifyPromptIntent('Design a REST API for memory cards');
  assert.equal(apiIntent, 'rest-api', 'REST API intent should prioritize over single word memory');

  const crudIntent = classifyPromptIntent('Create a CRUD endpoint router for user profiles');
  assert.equal(crudIntent, 'rest-api');

  // Python leak requires compound matching (leak + memory / python / tracemalloc)
  const leakIntent = classifyPromptIntent('Diagnose and fix a high-concurrency memory leak in a FastAPI worker');
  assert.equal(leakIntent, 'python-leak');

  const tracemallocIntent = classifyPromptIntent('Run tracemalloc snapshots to isolate memory growth');
  assert.equal(tracemallocIntent, 'python-leak');

  // Posture / Computer vision intent
  const postureIntent = classifyPromptIntent('Create an AI-driven posture detection component using MediaPipe');
  assert.equal(postureIntent, 'posture-vision');

  // Design tokens intent
  const tokenIntent = classifyPromptIntent('Generate high-contrast monochrome design tokens adhering to WCAG AAA');
  assert.equal(tokenIntent, 'design-tokens');

  // Social branding intent
  const socialIntent = classifyPromptIntent('Draft an engaging LinkedIn society announcement for Cognition');
  assert.equal(socialIntent, 'social-post');

  // Unclassified arbitrary query
  const customIntent = classifyPromptIntent('Build a custom smart contract ledger');
  assert.equal(customIntent, 'custom-synthesis');
});

test('Deterministic Target Date & Honest Data Provenance', () => {
  assert.equal(TECHTONICS_TARGET_DATE, '2026-11-28T09:30:00+05:30');
  const targetTime = new Date(TECHTONICS_TARGET_DATE).getTime();
  assert.equal(Number.isNaN(targetTime), false);

  // Honest source attributions (demonstration benchmark disclosures)
  assert.ok(DATA_PROVENANCE.members.source.includes('Demonstration metric'));
  assert.ok(DATA_PROVENANCE.reach.source.includes('Demonstration metric'));

  // Seed data explicitly disclosed as demo data
  assert.ok(SEED_ATTENDEES.length >= 2);
  SEED_ATTENDEES.forEach((attendee) => {
    assert.equal(attendee.isDemo, true);
    assert.ok(attendee.id.startsWith('DEMO-'));
  });
});

test('Prompt Studio Presets Completeness', () => {
  const presetKeys = ['cognition', 'python-leak', 'rest-api', 'posture-app', 'pixel-spec', 'linkedin-recap'];
  presetKeys.forEach((key) => {
    assert.ok(PROMPT_PRESETS[key], `Preset ${key} must exist`);
    assert.ok(PROMPT_PRESETS[key].title.length > 0);
    assert.ok(PROMPT_PRESETS[key].prompt.length > 0);
    assert.ok(PROMPT_PRESETS[key].model.length > 0);
  });
});

test('CI Asset Integrity & 404 Smoke Test', () => {
  // 1. Verify index.html local references
  const htmlPath = path.join(ROOT_DIR, 'index.html');
  assert.ok(fs.existsSync(htmlPath), 'index.html must exist');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  // Match href="..." and src="..."
  const assetRegex = /(?:src|href)=["']([^"']+)["']/g;
  let match;
  const localAssets = new Set();
  while ((match = assetRegex.exec(htmlContent)) !== null) {
    const uri = match[1].trim();
    // Exclude anchors, external protocols, inline data URIs
    if (!uri || uri.startsWith('#') || uri.startsWith('http://') || uri.startsWith('https://') || uri.startsWith('mailto:') || uri.startsWith('tel:') || uri.startsWith('data:')) {
      continue;
    }
    const cleanUri = uri.split('?')[0].split('#')[0];
    if (cleanUri) {
      localAssets.add(cleanUri);
    }
  }

  assert.ok(localAssets.size > 0, 'index.html should have local asset references');
  for (const asset of localAssets) {
    const fullPath = path.resolve(ROOT_DIR, asset);
    assert.ok(
      fs.existsSync(fullPath),
      `404 Error: Local asset referenced in index.html does not exist on disk: ${asset}`
    );
    const stat = fs.statSync(fullPath);
    assert.ok(stat.size > 0, `Empty asset file: ${asset}`);
  }

  // 2. Verify all local font url(...) references in style.css
  const cssPath = path.join(ROOT_DIR, 'style.css');
  assert.ok(fs.existsSync(cssPath), 'style.css must exist');
  const cssContent = fs.readFileSync(cssPath, 'utf8');

  const fontUrlRegex = /url\(["']?([^"')]+)["']?\)/g;
  const localFonts = new Set();
  while ((match = fontUrlRegex.exec(cssContent)) !== null) {
    const fontUri = match[1].trim();
    if (!fontUri.startsWith('http://') && !fontUri.startsWith('https://') && !fontUri.startsWith('data:')) {
      const cleanFontUri = fontUri.split('?')[0].split('#')[0];
      localFonts.add(cleanFontUri);
    }
  }

  assert.ok(localFonts.size > 0, 'style.css should reference local self-hosted fonts');
  for (const font of localFonts) {
    const fullFontPath = path.resolve(ROOT_DIR, font);
    assert.ok(
      fs.existsSync(fullFontPath),
      `404 Error: Font referenced in style.css does not exist on disk: ${font}`
    );
    assert.ok(fs.statSync(fullFontPath).size > 0, `Empty font file: ${font}`);
  }

  // 3. Verify all local JS module imports exist
  const jsDir = path.join(ROOT_DIR, 'js');
  const jsFiles = fs.readdirSync(jsDir).filter((f) => f.endsWith('.js'));
  assert.ok(jsFiles.length >= 7, 'All core JS modules must be present');

  const importRegex = /(?:import|export)\s+(?:.*?from\s+)?['"](\.\/[^'"]+)['"]/g;
  for (const jsFile of jsFiles) {
    const filePath = path.join(jsDir, jsFile);
    const content = fs.readFileSync(filePath, 'utf8');
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      const resolvedImport = path.resolve(jsDir, importPath);
      assert.ok(
        fs.existsSync(resolvedImport),
        `404 Error: Import "${importPath}" in ${jsFile} does not resolve to an existing file.`
      );
    }
  }
});
