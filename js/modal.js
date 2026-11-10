/**
 * INFINITY // Accessible Modal Dialog Manager
 * WAI-ARIA compliant: role="dialog", aria-modal="true", Focus Trap, Escape Key Handler.
 */

let activeModal = null;
let lastActiveElement = null;

export function initModals() {
  // Global Escape key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeModal) {
      e.preventDefault();
      closeModal(activeModal);
    }
  });

  // Global Tab key focus trap listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && activeModal) {
      trapFocus(e, activeModal);
    }
  });

  // Close buttons and backdrop clicks
  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });

    const closeBtn = overlay.querySelector('[data-close-modal]');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(overlay));
    }
  });
}

export function openModal(modalEl) {
  if (!modalEl) return;
  lastActiveElement = document.activeElement;

  modalEl.classList.add('is-open');
  modalEl.setAttribute('aria-hidden', 'false');
  activeModal = modalEl;

  // Prevent background scrolling
  document.body.style.overflow = 'hidden';

  // Focus the first visible interactive element (prefer input/select/textarea)
  requestAnimationFrame(() => {
    const focusable = getFocusableElements(modalEl);
    if (focusable.length > 0) {
      const firstInput = focusable.find((el) => ['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName));
      if (firstInput) {
        firstInput.focus();
      } else {
        focusable[0].focus();
      }
    }
  });
}

export function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove('is-open');
  modalEl.setAttribute('aria-hidden', 'true');

  if (activeModal === modalEl) {
    activeModal = null;
  }

  document.body.style.overflow = '';

  // Restore focus
  if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
    lastActiveElement.focus();
  }
}

export function trapFocus(e, container) {
  const focusables = getFocusableElements(container);
  if (focusables.length === 0) {
    e.preventDefault();
    return;
  }

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  // If focus wandered outside or is on an invalid target, wrap back
  if (!container.contains(document.activeElement)) {
    e.preventDefault();
    first.focus();
    return;
  }

  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

export function getFocusableElements(container) {
  if (!container) return [];
  const candidates = container.querySelectorAll(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  return Array.from(candidates).filter((el) => {
    // Filter out elements hidden via .hidden or style="display: none"
    if (el.closest('.hidden') || el.closest('[style*="display: none"]')) {
      return false;
    }
    if (typeof window !== 'undefined' && window.getComputedStyle) {
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') {
        return false;
      }
    }
    // Filter out zero-dimension hidden elements if in browser
    if (el.getClientRects && el.getClientRects().length === 0 && el.offsetWidth === 0 && el.offsetHeight === 0) {
      return false;
    }
    return true;
  });
}
