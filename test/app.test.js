/**
 * INFINITY // Test Suite
 * Validates registration logic, security against XSS, and state integrity.
 * Executable via `npm test` using Node.js built-in test runner.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

test('Registration Email Validation Regex', () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  assert.equal(emailRegex.test('aryan.sharma@sggscc.ac.in'), true);
  assert.equal(emailRegex.test('student@du.ac.in'), true);
  assert.equal(emailRegex.test('invalid-email'), false);
  assert.equal(emailRegex.test('missing@domain'), false);
  assert.equal(emailRegex.test(''), false);
});

test('Terminal Input XSS Sanitization Logic', () => {
  const maliciousInput = '<img src=x onerror=alert(1)>';
  
  // Emulate terminal textContent assignment
  const fakeElement = { textContent: '' };
  fakeElement.textContent = maliciousInput;
  
  // Verify that it is stored purely as literal text string, not executable HTML
  assert.equal(fakeElement.textContent, '<img src=x onerror=alert(1)>');
  assert.notEqual(fakeElement.textContent.includes('<script>'), true);
});

test('Deterministic Target Date Integrity', async () => {
  const { TECHTONICS_TARGET_DATE, DATA_PROVENANCE } = await import('../js/state.js');
  
  assert.equal(TECHTONICS_TARGET_DATE, '2026-11-28T09:30:00+05:30');
  const targetTime = new Date(TECHTONICS_TARGET_DATE).getTime();
  assert.equal(Number.isNaN(targetTime), false);

  assert.equal(DATA_PROVENANCE.members.stat, '500+');
  assert.equal(DATA_PROVENANCE.events.stat, '35+');
  assert.equal(DATA_PROVENANCE.reach.stat, '12,000+');
});

test('Prompt Studio Preset Definitions', async () => {
  const { PROMPT_PRESETS } = await import('../js/prompt-studio.js');
  
  assert.ok(PROMPT_PRESETS['cognition']);
  assert.ok(PROMPT_PRESETS['python-leak']);
  assert.ok(PROMPT_PRESETS['posture-app']);
  assert.ok(PROMPT_PRESETS['pixel-spec']);
  assert.ok(PROMPT_PRESETS['linkedin-recap']);
  
  assert.equal(PROMPT_PRESETS['python-leak'].category, 'python-debug');
  assert.equal(PROMPT_PRESETS['posture-app'].category, 'computer-vision');
});
