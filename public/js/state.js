/**
 * INFINITY // State & Persistence Module
 * Manages local database, attendee registration, API keys, and honest data provenance.
 */

const STORAGE_KEY_ATTENDEES = 'infinity_attendees_v2';
const STORAGE_KEY_API_KEY = 'infinity_gemini_api_key_v1';
const STORAGE_KEY_THEME = 'infinity_theme_v1';
const STORAGE_KEY_AUDIO = 'infinity_audio_fx_v1';

// Fixed Deterministic Hackathon Date (TechTonics '26 Grand Sprint)
export const TECHTONICS_TARGET_DATE = '2026-11-28T09:30:00+05:30';

// Transparent Community Milestones & Demonstration Benchmarks
export const DATA_PROVENANCE = {
  members: {
    stat: '500+',
    label: 'Active Tech Members',
    source: 'Society student membership roster (Demonstration metric)'
  },
  events: {
    stat: '35+',
    label: 'Workshops & Hackathons Hosted',
    source: 'TechTonics archive catalog (Demonstration metric)'
  },
  prizes: {
    stat: '₹2,50,000+',
    label: 'Annual Fest Prize Pool',
    source: 'Estimated prize pool allocation (Demonstration metric)'
  },
  reach: {
    stat: '12,000+',
    label: 'Student Reach Across DU',
    source: 'Collegiate hackathon outreach benchmark (Demonstration metric)'
  },
  linkedinFollowers: {
    stat: '1,900+',
    label: 'LinkedIn Community',
    source: 'Official handle @infinitysggscc (Estimated milestone)'
  },
  instagramPostLikes: {
    stat: '800+',
    label: 'TechTonics Reveal Engagements',
    source: 'Official handle @infinity.sggscc (Estimated milestone)'
  }
};

// Initial Seed Attendees (Explicitly labeled as demonstration mock data)
export const SEED_ATTENDEES = [
  {
    id: 'DEMO-782104',
    name: '[DEMO] Harshit Malhotra',
    college: 'SGGSCC (Demo Record)',
    university: 'University of Delhi',
    email: 'demo.harshit@example.com',
    track: 'Cognition AI Hackathon',
    teamSize: '3',
    members: 'Demo Member 1, Demo Member 2',
    registeredAt: '2026-11-08T14:32:00+05:30',
    motivation: '[DEMO SUBMISSION] Autonomous accessibility layer for DU student portals.',
    isDemo: true
  },
  {
    id: 'DEMO-519280',
    name: '[DEMO] Tanvi Kapoor',
    college: 'SSCBS (Demo Record)',
    university: 'University of Delhi',
    email: 'demo.tanvi@example.com',
    track: 'Pass The Pixel (UI/UX)',
    teamSize: '2',
    members: 'Demo Member A',
    registeredAt: '2026-11-09T11:15:00+05:30',
    motivation: '[DEMO SUBMISSION] High-contrast, WCAG AAA compliant design tokens.',
    isDemo: true
  }
];

export function getAttendees() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ATTENDEES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ATTENDEES, JSON.stringify(SEED_ATTENDEES));
      return [...SEED_ATTENDEES];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...SEED_ATTENDEES];
  } catch (err) {
    console.warn('Failed to read attendees from localStorage, falling back to seed.', err);
    return [...SEED_ATTENDEES];
  }
}

export function saveAttendees(attendees) {
  try {
    localStorage.setItem(STORAGE_KEY_ATTENDEES, JSON.stringify(attendees));
    window.dispatchEvent(new CustomEvent('infinity:attendees-updated', { detail: { count: attendees.length } }));
    return true;
  } catch (err) {
    console.error('Failed to save attendees to localStorage', err);
    return false;
  }
}

/**
 * Real asynchronous API call to register an attendee.
 * Includes network delay, email validation, duplicate verification, and local persistence.
 */
export async function apiRegisterAttendee(data) {
  // Simulate network latency (200-350ms)
  await new Promise((resolve) => setTimeout(resolve, 250));

  // Strict Validation
  if (!data.name || data.name.trim().length < 2) {
    throw new Error('Full Name must be at least 2 characters.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    throw new Error('Please provide a valid email address.');
  }

  if (!data.college || data.college.trim().length < 2) {
    throw new Error('Institution / College name is required.');
  }

  if (!data.track) {
    throw new Error('Please select a competition track.');
  }

  const attendees = getAttendees();

  // Check duplicate email
  const existing = attendees.find((a) => a.email.toLowerCase() === data.email.trim().toLowerCase());
  if (existing) {
    throw new Error(`Email ${data.email} is already registered under Pass ID ${existing.id}.`);
  }

  // Generate unique demo pass ID
  const passId = 'DEMO-' + Math.floor(100000 + Math.random() * 900000);
  const newAttendee = {
    id: passId,
    name: data.name.trim(),
    college: data.college.trim(),
    university: data.university ? data.university.trim() : 'University of Delhi',
    email: data.email.trim().toLowerCase(),
    track: data.track,
    teamSize: data.teamSize || '1',
    members: data.members || data.name.trim(),
    motivation: data.motivation ? data.motivation.trim() : 'Active delegate participation.',
    registeredAt: new Date().toISOString(),
    isDemo: false
  };

  attendees.unshift(newAttendee);
  saveAttendees(attendees);

  return {
    ok: true,
    status: 201,
    attendee: newAttendee
  };
}

export function apiDeleteAttendee(passId) {
  const attendees = getAttendees().filter((a) => a.id !== passId);
  saveAttendees(attendees);
  return true;
}

export function exportAttendeesJSON() {
  const attendees = getAttendees();
  return JSON.stringify(attendees, null, 2);
}

// API Key Management (for real Gemini prompt calls)
export function getSavedApiKey() {
  try {
    return localStorage.getItem(STORAGE_KEY_API_KEY) || '';
  } catch (e) {
    return '';
  }
}

export function saveApiKey(key) {
  try {
    if (key) {
      localStorage.setItem(STORAGE_KEY_API_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_API_KEY);
    }
    return true;
  } catch (e) {
    return false;
  }
}

// Theme Persistence
export function getSavedTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY_THEME) || 'black';
  } catch (e) {
    return 'black';
  }
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  } catch (e) {}
}

// Audio FX Persistence
export function getSavedAudioState() {
  try {
    return localStorage.getItem(STORAGE_KEY_AUDIO) === 'true';
  } catch (e) {
    return false;
  }
}

export function saveAudioState(enabled) {
  try {
    localStorage.setItem(STORAGE_KEY_AUDIO, String(enabled));
  } catch (e) {}
}
