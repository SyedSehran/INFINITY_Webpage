/**
 * INFINITY // 3-Step Registration Wizard & Attendee Management
 * Step 1: Delegate Identity -> Step 2: Track & Team -> Step 3: Motivation & Pitch
 * Real validation, async network simulation, duplicate checking, and persistent storage.
 */

import { apiRegisterAttendee, getAttendees, apiDeleteAttendee, exportAttendeesJSON } from './state.js';
import { playClick, playSuccess } from './audio.js';

let currentStep = 1;
const formData = {
  name: '',
  college: '',
  university: 'University of Delhi',
  email: '',
  track: 'Cognition AI Hackathon',
  teamSize: '1',
  members: '',
  github: '',
  motivation: '',
  consent: false
};

export function initRegistration() {
  const wizardForm = document.getElementById('wizard-form');
  const prevBtn = document.getElementById('wizard-prev-btn');
  const nextBtn = document.getElementById('wizard-next-btn');
  const submitBtn = document.getElementById('wizard-submit-btn');
  const passContainer = document.getElementById('registration-pass-view');
  const formContainer = document.getElementById('registration-form-view');

  if (!wizardForm || !nextBtn) return;

  // Real-time live attendee table updates
  renderAttendeeTable();
  window.addEventListener('infinity:attendees-updated', () => renderAttendeeTable());

  // Search filter input
  const searchInput = document.getElementById('search-attendees-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderAttendeeTable(e.target.value.trim().toLowerCase());
    });
  }

  // Print Pass Handler
  const printPassBtn = document.getElementById('print-pass-btn');
  if (printPassBtn) {
    printPassBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Next Step Handler
  nextBtn.addEventListener('click', () => {
    if (validateStep(currentStep)) {
      playClick(560, 0.03);
      currentStep++;
      updateWizardUI();
    }
  });

  // Previous Step Handler
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      playClick(460, 0.03);
      if (currentStep > 1) {
        currentStep--;
        updateWizardUI();
      }
    });
  }

  // Form Submission Handler
  wizardForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    // Collect Step 3 data
    formData.motivation = document.getElementById('reg-motivation').value.trim();
    formData.consent = document.getElementById('reg-consent').checked;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting Application...';

    try {
      const response = await apiRegisterAttendee(formData);
      playSuccess();
      renderPass(response.attendee);
      formContainer.style.display = 'none';
      passContainer.style.display = 'block';
      showAppToast(`Registration verified! Pass ${response.attendee.id} generated.`);
    } catch (err) {
      showAppToast(`Registration Notice: ${err.message}`);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Registration & Generate Pass';
    }
  });

  // Reset / Register Another
  const resetBtn = document.getElementById('register-another-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      wizardForm.reset();
      currentStep = 1;
      updateWizardUI();
      passContainer.style.display = 'none';
      formContainer.style.display = 'block';
    });
  }

  // Export Attendees JSON
  const exportBtn = document.getElementById('export-attendees-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const data = exportAttendeesJSON();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `INFINITY_SGGSCC_ATTENDEES_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showAppToast('Downloaded verified attendee dataset (.json)');
    });
  }
}

function validateStep(step) {
  clearErrors();

  if (step === 1) {
    const name = document.getElementById('reg-name').value.trim();
    const college = document.getElementById('reg-college').value.trim();
    const university = document.getElementById('reg-university').value.trim();
    const email = document.getElementById('reg-email').value.trim();

    let valid = true;
    if (name.length < 2) {
      showFieldError('reg-name', 'Name must be at least 2 characters.');
      valid = false;
    }
    if (college.length < 2) {
      showFieldError('reg-college', 'Institution / College name is required.');
      valid = false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFieldError('reg-email', 'Please provide a valid institutional or personal email address.');
      valid = false;
    }

    if (valid) {
      formData.name = name;
      formData.college = college;
      formData.university = university || 'University of Delhi';
      formData.email = email;
    }
    return valid;
  }

  if (step === 2) {
    formData.track = document.getElementById('reg-track').value;
    formData.teamSize = document.getElementById('reg-team-size').value;
    formData.members = document.getElementById('reg-members').value.trim() || formData.name;
    formData.github = document.getElementById('reg-github').value.trim();
    return true;
  }

  if (step === 3) {
    const motivation = document.getElementById('reg-motivation').value.trim();
    const consent = document.getElementById('reg-consent').checked;
    let valid = true;

    if (motivation.length < 10) {
      showFieldError('reg-motivation', 'Please provide a brief motivation statement (minimum 10 characters).');
      valid = false;
    }
    if (!consent) {
      showFieldError('reg-consent-wrapper', 'You must agree to the academic integrity declaration.');
      valid = false;
    }
    return valid;
  }

  return true;
}

function updateWizardUI() {
  // Step Sections
  for (let s = 1; s <= 3; s++) {
    const stepEl = document.getElementById(`step-pane-${s}`);
    const nodeEl = document.getElementById(`step-node-${s}`);
    if (stepEl) {
      stepEl.style.display = s === currentStep ? 'block' : 'none';
    }
    if (nodeEl) {
      const parent = nodeEl.closest('.wizard-step');
      if (parent) {
        parent.classList.remove('is-active', 'is-complete');
        if (s < currentStep) parent.classList.add('is-complete');
        if (s === currentStep) parent.classList.add('is-active');
      }
    }
  }

  // Navigation Buttons
  const prevBtn = document.getElementById('wizard-prev-btn');
  const nextBtn = document.getElementById('wizard-next-btn');
  const submitBtn = document.getElementById('wizard-submit-btn');

  if (prevBtn) prevBtn.style.display = currentStep > 1 ? 'inline-flex' : 'none';
  if (nextBtn) nextBtn.style.display = currentStep < 3 ? 'inline-flex' : 'none';
  if (submitBtn) submitBtn.style.display = currentStep === 3 ? 'inline-flex' : 'none';
}

function renderPass(attendee) {
  document.getElementById('pass-name').textContent = attendee.name;
  document.getElementById('pass-college').textContent = `${attendee.college} (${attendee.university})`;
  document.getElementById('pass-track').textContent = attendee.track;
  document.getElementById('pass-id').textContent = attendee.id;
  document.getElementById('pass-team').textContent = attendee.members || attendee.name;
  document.getElementById('pass-motivation').textContent = `"${attendee.motivation}"`;
  document.getElementById('pass-timestamp').textContent = new Date(attendee.registeredAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function renderAttendeeTable(query = '') {
  const tableBody = document.getElementById('attendees-table-body');
  const countBadge = document.getElementById('live-attendees-counter');
  if (!tableBody) return;

  const allAttendees = getAttendees();
  const attendees = query
    ? allAttendees.filter(
        (a) =>
          a.name.toLowerCase().includes(query) ||
          a.college.toLowerCase().includes(query) ||
          a.track.toLowerCase().includes(query) ||
          a.id.toLowerCase().includes(query)
      )
    : allAttendees;

  if (countBadge) countBadge.textContent = `${allAttendees.length} Registered`;

  tableBody.innerHTML = '';
  if (attendees.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="5" class="p-4 text-center text-muted font-mono text-xs">No matching delegate records found for "${escapeHTML(query)}".</td>`;
    tableBody.appendChild(tr);
    return;
  }

  attendees.slice(0, 15).forEach((a) => {
    const tr = document.createElement('tr');
    tr.className = 'border-b border-subtle text-xs hover:bg-zinc-900/60';
    tr.innerHTML = `
      <td class="p-3 font-mono font-bold text-white">${escapeHTML(a.id)}</td>
      <td class="p-3 text-secondary font-medium">${escapeHTML(a.name)}</td>
      <td class="p-3 text-muted">${escapeHTML(a.college)}</td>
      <td class="p-3"><span class="badge ${a.track.includes('AI') ? 'badge-emerald' : 'badge-white'} text-[10px]">${escapeHTML(a.track)}</span></td>
      <td class="p-3 text-right">
        <button class="text-xs text-red-400 hover:text-red-300 delete-attendee-btn font-mono" data-id="${a.id}">Delete</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  tableBody.querySelectorAll('.delete-attendee-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      apiDeleteAttendee(id);
      showAppToast(`Removed registration record ${id}`);
    });
  });
}

function showFieldError(fieldId, msg) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  const parent = field.closest('.form-group') || field.parentElement;
  if (parent) {
    parent.classList.add('has-error');
    const errEl = parent.querySelector('.form-error');
    if (errEl) errEl.textContent = msg;
  }
}

function clearErrors() {
  document.querySelectorAll('.has-error').forEach((el) => el.classList.remove('has-error'));
}

function showAppToast(msg) {
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

