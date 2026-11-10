/**
 * INFINITY // Test Suite
 * Directly tests real project functions from js/registration.js, js/prompt-studio.js, and js/state.js.
 * Executable via `npm test` using Node.js built-in test runner.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

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
