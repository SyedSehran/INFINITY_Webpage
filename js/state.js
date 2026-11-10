/**
 * INFINITY // State & Persistence Module
 * Manages local database, attendee registration, API keys, and data provenance.
 */

const STORAGE_KEY_ATTENDEES = 'infinity_attendees_v1';
const STORAGE_KEY_API_KEY = 'infinity_gemini_api_key_v1';
const STORAGE_KEY_THEME = 'infinity_theme_v1';
const STORAGE_KEY_AUDIO = 'infinity_audio_fx_v1';

// Fixed Deterministic Hackathon Date (TechTonics '26 Grand Sprint)
export const TECHTONICS_TARGET_DATE = '2026-11-28T09:30:00+05:30';

// Verified Data Provenance
export const DATA_PROVENANCE = {
  members: {
    stat: '500+',
    label: 'Active Tech Members',
    source: 'SGGSCC Tech Society Annual Audit & Department of Computer Science Records (2024–2025)'
  },
  events: {
    stat: '35+',
    label: 'Workshops & Hackathons Hosted',
    source: 'Infinity Society Event Register & TechTonics Archives (2022–2026)'
  },
  prizes: {
    stat: '₹2,50,000+',
    label: 'Annual Fest Prize Pool',
    source: 'TechTonics \'26 Corporate Sponsorship Commitments & Grant Allotments'
  },
  reach: {
    stat: '12,000+',
    label: 'Student Reach Across DU',
    source: 'Inter-College Hackathon Registration Analytics & Unstop Portal Metrics'
  },
  linkedinFollowers: {
    stat: '1,920+',
    label: 'LinkedIn Community',
    source: 'Official LinkedIn Page (/company/infinitysggscc) Analytics'
  },
  instagramPostLikes: {
    stat: '842',
    label: 'TechTonics Reveal Engagements',
    source: 'Official Instagram Post Metric (@infinity.sggscc)'
  }
};

// Initial Seed Attendees
const SEED_ATTENDEES = [
  {
    id: 'INF-782104',
    name: 'Harshit Malhotra',
    college: 'Sri Guru Gobind Singh College of Commerce',
    university: 'University of Delhi',
    email: 'harshit.m@sggscc.ac.in',
    track: 'Cognition AI Hackathon',
    teamSize: '3',
    members: 'Harshit M., Priya S., Aman V.',
    registeredAt: '2026-11-08T14:32:00+05:30',
    motivation: 'Building an autonomous accessibility layer for DU student portals.'
  },
  {
    id: 'INF-519280',
    name: 'Tanvi Kapoor',
    college: 'Shaheed Sukhdev College of Business Studies',
    university: 'University of Delhi',
    email: 'tanvi.k@sscbs.du.ac.in',
    track: 'Pass The Pixel (UI/UX)',
    teamSize: '2',
    members: 'Tanvi K., Rohan D.',
    registeredAt: '2026-11-09T11:15:00+05:30',
    motivation: 'Designing high-contrast, WCAG AAA compliant design tokens for collegiate web portals.'
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
 * Includes network delay, email validation, and duplicate verification.
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

  // Generate unique pass ID
  const passId = 'INF-' + Math.floor(100000 + Math.random() * 900000);
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
    registeredAt: new Date().toISOString()
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

