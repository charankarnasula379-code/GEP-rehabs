/**
 * ============================================================================
 * GEP REHABS — MASTER CLIENT JAVASCRIPT ARCHITECTURE
 * ============================================================================
 * Clean, vanilla JS architecture organized into 9 logical modules:
 *
 * 1. CONFIGURATION AND MOTION PREFERENCES
 *    - prefersReducedMotion detection, global timing constants
 * 2. NAVIGATION AND SCROLL BEHAVIOR
 *    - Mobile off-canvas drawer (open/close, focus trapping, aria states)
 *    - Sticky glassmorphic header on scroll
 *    - Accessible smooth scroll with dynamic header height offset
 *    - GEP sliding pill navigation indicator and active link tracking
 * 3. APPOINTMENT VALIDATION AND SUBMISSION
 *    - 3 clinical pathways (In-Clinic, Online Video, Home Physiotherapy)
 *    - Accessible HTML5 <dialog> modal controller with focus restoration
 *    - Per-field validation, WhatsApp appointment demo (wa.me link), error fallback
 * 4. HERO ANIMATIONS AND SCROLL REVEAL SYSTEM
 *    - Daylight aperture hero intro sequence
 *    - Directional scroll reveal observer (data-anim: from-left, from-bottom, etc.)
 *    - Subtle hero photography scroll depth scaling
 * 5. SERVICE CONDITIONS MODAL CONTROLLER
 *    - Dynamic population of 10 conditions per clinical specialty
 *    - Cross-linking into appointment booking modal with preselected service
 * 6. PRIVACY MODAL CONTROLLER
 *    - Patient data protection notice disclosure modal
 * 7. REVIEW CAROUSEL
 *    - Interactive one-by-one carousel for 8 verified patient reviews
 *    - Autoplay timer with pause-on-hover, touch gestures, keyboard accessibility
 * 8. FAQ ACCORDION
 *    - Accessible accordion disclosure with keyboard support
 * 9. REVIEW SUBMISSION CONTROLLER
 *    - Verified review submission form, client-side validation
 *    - FormSubmit.co moderation queue (protects public reviews from unverified spam)
 * ============================================================================
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. CONFIGURATION AND MOTION PREFERENCES
     ========================================================================== */
  const prefersReducedMotion = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  // ========== Mobile Navigation ==========
  const mobileNav = document.getElementById('mobileNav');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavClose = document.getElementById('mobileNavClose');

  function openMobileMenu() {
    if (!mobileNav) return;
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (mobileNavClose) mobileNavClose.focus();
  }

  function closeMobileMenu() {
    if (!mobileNav) return;
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (mobileMenuBtn && typeof mobileMenuBtn.focus === 'function') {
      mobileMenuBtn.focus();
    }
  }

  window.openMobileMenu = openMobileMenu;
  window.closeMobileMenu = closeMobileMenu;

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openMobileMenu);
  }
  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMobileMenu);
  }
  if (mobileNav) {
    mobileNav.addEventListener('click', (e) => {
      if (e.target === mobileNav) closeMobileMenu();
    });
    mobileNav.querySelectorAll('.mobile-nav-panel a').forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // ========== Sticky Header – Glassmorphism on Scroll ==========
  const header = document.getElementById('siteHeader');
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.pageYOffset;
        if (scrollY > 30) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ========== Smooth Scroll with Header Offset ==========
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = header ? (header.offsetHeight + 36) : 100;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: targetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
      }
    });
  });

  // ========== Appointment Modal Flow ==========
  let lastFocusedApptTrigger = null;

  const apptModal = document.getElementById('appointmentModal');
  const apptModalCloseBtn = document.getElementById('apptModalCloseBtn');
  const modalSuccessScreen = document.getElementById('modalSuccessScreen');
  const modalSuccessDoneBtn = document.getElementById('modalSuccessDoneBtn');
  const modalClinicSection = document.getElementById('modalClinicSection');
  const modalCustomerForm = document.getElementById('modalCustomerForm');
  const modalCustomerSubmitBtn = document.getElementById('modalCustomerSubmitBtn');
  const modalFormErrorAlert = document.getElementById('modalFormErrorAlert');
  const modalFormErrorMessage = document.getElementById('modalFormErrorMessage');
  const modalRetryBtn = document.getElementById('modalRetryBtn');
  const modalWhatsAppFallbackBtn = document.getElementById('modalWhatsAppFallbackBtn');
  const modalEmailFallbackBtn = document.getElementById('modalEmailFallbackBtn');
  const modalOpenPrivacyBtn = document.getElementById('modalOpenPrivacyBtn');

  const modalCustomerName = document.getElementById('modalCustomerName');
  const modalCustomerPhone = document.getElementById('modalCustomerPhone');
  const modalCustomerEmail = document.getElementById('modalCustomerEmail');
  const modalCustomerService = document.getElementById('modalCustomerService');
  const modalCustomerConsultType = document.getElementById('modalCustomerConsultType');
  const modalCustomerClinic = document.getElementById('modalCustomerClinic');
  const modalCustomerProblem = document.getElementById('modalCustomerProblem');
  const modalCustomerConsent = document.getElementById('modalCustomerConsent');
  const modalProblemCharCounter = document.getElementById('modalProblemCharCounter');

  const modalNameError = document.getElementById('modalNameError');
  const modalPhoneError = document.getElementById('modalPhoneError');
  const modalEmailError = document.getElementById('modalEmailError');
  const modalServiceError = document.getElementById('modalServiceError');
  const modalConsultTypeError = document.getElementById('modalConsultTypeError');
  const modalClinicError = document.getElementById('modalClinicError');
  const modalBranchSelectError = document.getElementById('modalBranchSelectError');
  const modalClinicRequiredBadge = document.getElementById('modalClinicRequiredBadge');
  const modalProblemError = document.getElementById('modalProblemError');
  const modalConsentError = document.getElementById('modalConsentError');

  // Inline validation UI helpers with accessibility states (aria-invalid)
  function setFieldValid(input, wrap, errorSpan) {
    if (input) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      input.setAttribute('aria-invalid', 'false');
    }
    if (wrap) {
      wrap.classList.remove('is-invalid');
      wrap.classList.add('is-valid');
    }
    if (errorSpan) {
      errorSpan.textContent = '';
    }
  }

  function setFieldInvalid(input, wrap, errorSpan, message) {
    if (input) {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      input.setAttribute('aria-invalid', 'true');
    }
    if (wrap) {
      wrap.classList.remove('is-valid');
      wrap.classList.add('is-invalid');
    }
    if (errorSpan) {
      errorSpan.textContent = message;
    }
  }

  function clearFieldState(input, wrap, errorSpan) {
    if (input) {
      input.classList.remove('is-valid', 'is-invalid');
      input.removeAttribute('aria-invalid');
    }
    if (wrap) {
      wrap.classList.remove('is-valid', 'is-invalid');
    }
    if (errorSpan) {
      errorSpan.textContent = '';
    }
  }

  function openAppointmentModal(consultType, defaultClinic = '', defaultService = '') {
    if (!apptModal) return;
    lastFocusedApptTrigger = document.activeElement;

    // Reset view states
    if (modalCustomerForm) modalCustomerForm.style.display = 'block';
    if (modalSuccessScreen) modalSuccessScreen.style.display = 'none';
    if (modalFormErrorAlert) modalFormErrorAlert.style.display = 'none';
    if (modalBranchSelectError) modalBranchSelectError.textContent = '';

    // Set consultation type
    if (modalCustomerConsultType && consultType) {
      modalCustomerConsultType.value = consultType;
      modalCustomerConsultType.dispatchEvent(new Event('change'));
    }

    // Set service if passed
    if (modalCustomerService && defaultService) {
      for (let i = 0; i < modalCustomerService.options.length; i++) {
        if (modalCustomerService.options[i].text.toLowerCase().includes(defaultService.toLowerCase().slice(0, 10))) {
          modalCustomerService.selectedIndex = i;
          modalCustomerService.dispatchEvent(new Event('change'));
          break;
        }
      }
    }

    // Branch section visibility & conditional clinic requirement
    if (consultType === 'Clinic Visit') {
      if (modalClinicSection) modalClinicSection.style.display = 'block';
      if (modalClinicRequiredBadge) modalClinicRequiredBadge.style.display = 'inline';
      updateModalBranchButtons(defaultClinic);
      if (modalCustomerClinic) {
        modalCustomerClinic.value = defaultClinic;
        modalCustomerClinic.dispatchEvent(new Event('change'));
      }
    } else {
      if (modalClinicSection) modalClinicSection.style.display = 'none';
      if (modalClinicRequiredBadge) modalClinicRequiredBadge.style.display = 'none';
      if (modalCustomerClinic) {
        modalCustomerClinic.value = '';
        modalCustomerClinic.dispatchEvent(new Event('change'));
        clearFieldState(modalCustomerClinic, modalCustomerClinic.closest('.select-wrap'), modalClinicError);
      }
    }

    // Open native modal dialog
    document.body.classList.add('modal-open');
    apptModal.showModal();

    // Focus management
    setTimeout(() => {
      if (consultType === 'Clinic Visit') {
        const firstBranch = modalClinicSection ? modalClinicSection.querySelector('.modal-clinic-btn:not(:disabled)') : null;
        if (firstBranch) firstBranch.focus();
        else if (modalCustomerName) modalCustomerName.focus();
      } else {
        if (modalCustomerName) modalCustomerName.focus();
      }
    }, 60);
  }

  function closeAppointmentModal() {
    if (!apptModal) return;
    document.body.classList.remove('modal-open');
    apptModal.close();
    if (lastFocusedApptTrigger && typeof lastFocusedApptTrigger.focus === 'function') {
      lastFocusedApptTrigger.focus();
    }
  }

  function updateModalBranchButtons(selectedClinic) {
    document.querySelectorAll('.modal-clinic-btn').forEach((btn) => {
      const clinic = btn.getAttribute('data-clinic');
      if (selectedClinic && clinic === selectedClinic) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });
    if (selectedClinic && modalBranchSelectError) {
      modalBranchSelectError.textContent = '';
    }
  }

  // Branch buttons click inside modal
  document.querySelectorAll('.modal-clinic-btn:not(:disabled)').forEach((btn) => {
    btn.addEventListener('click', () => {
      const clinic = btn.getAttribute('data-clinic');
      updateModalBranchButtons(clinic);
      if (modalCustomerClinic) {
        modalCustomerClinic.value = clinic;
        modalCustomerClinic.dispatchEvent(new Event('change'));
      }
      if (modalCustomerName) modalCustomerName.focus();
    });
  });

  // Consult type change inside modal
  if (modalCustomerConsultType) {
    modalCustomerConsultType.addEventListener('change', () => {
      const val = modalCustomerConsultType.value;
      if (val === 'Clinic Visit') {
        if (modalClinicSection) modalClinicSection.style.display = 'block';
        if (modalClinicRequiredBadge) modalClinicRequiredBadge.style.display = 'inline';
      } else {
        if (modalClinicSection) modalClinicSection.style.display = 'none';
        if (modalClinicRequiredBadge) modalClinicRequiredBadge.style.display = 'none';
        if (modalCustomerClinic) {
          modalCustomerClinic.value = '';
          clearFieldState(modalCustomerClinic, modalCustomerClinic.closest('.select-wrap'), modalClinicError);
        }
        updateModalBranchButtons('');
      }
    });
  }

  // Close handlers
  if (apptModalCloseBtn) apptModalCloseBtn.addEventListener('click', closeAppointmentModal);
  if (modalSuccessDoneBtn) {
    modalSuccessDoneBtn.addEventListener('click', () => {
      if (modalCustomerForm) {
        modalCustomerForm.reset();
        clearFieldState(modalCustomerName, modalCustomerName ? modalCustomerName.closest('.input-wrap') : null, modalNameError);
        clearFieldState(modalCustomerPhone, modalCustomerPhone ? modalCustomerPhone.closest('.input-wrap') : null, modalPhoneError);
        clearFieldState(modalCustomerEmail, modalCustomerEmail ? modalCustomerEmail.closest('.input-wrap') : null, modalEmailError);
        clearFieldState(modalCustomerService, modalCustomerService ? modalCustomerService.closest('.select-wrap') : null, modalServiceError);
        clearFieldState(modalCustomerConsultType, modalCustomerConsultType ? modalCustomerConsultType.closest('.select-wrap') : null, modalConsultTypeError);
        clearFieldState(modalCustomerClinic, modalCustomerClinic ? modalCustomerClinic.closest('.select-wrap') : null, modalClinicError);
        clearFieldState(modalCustomerProblem, modalCustomerProblem ? modalCustomerProblem.closest('.textarea-wrap') : null, modalProblemError);
        if (modalConsentError) modalConsentError.textContent = '';
        if (modalProblemCharCounter) modalProblemCharCounter.textContent = '0 / 500';
      }
      closeAppointmentModal();
    });
  }

  if (apptModal) {
    apptModal.addEventListener('close', () => {
      document.body.classList.remove('modal-open');
    });

    apptModal.addEventListener('cancel', () => {
      document.body.classList.remove('modal-open');
      if (lastFocusedApptTrigger && typeof lastFocusedApptTrigger.focus === 'function') {
        setTimeout(() => lastFocusedApptTrigger.focus(), 10);
      }
    });

    // Light-dismiss click outside
    apptModal.addEventListener('click', (e) => {
      if (e.target !== apptModal) return;
      const rect = apptModal.getBoundingClientRect();
      const isInDialog = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      );
      if (!isInDialog) closeAppointmentModal();
    });
  }

  // Privacy policy open from inside modal
  if (modalOpenPrivacyBtn) {
    modalOpenPrivacyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openPrivacyModal();
    });
  }

  // Character counter for modal problem textarea
  if (modalCustomerProblem && modalProblemCharCounter) {
    modalCustomerProblem.addEventListener('input', () => {
      const len = modalCustomerProblem.value.length;
      modalProblemCharCounter.textContent = `${len} / 500`;
      modalProblemCharCounter.classList.toggle('char-limit', len >= 500);
    });
  }

  // Validation functions for modal
  function validateModalName(showFeedback = true) {
    if (!modalCustomerName) return true;
    const val = modalCustomerName.value.trim();
    const wrap = modalCustomerName.closest('.input-wrap');
    if (val.length >= 2) {
      if (showFeedback) setFieldValid(modalCustomerName, wrap, modalNameError);
      return true;
    } else {
      if (showFeedback) setFieldInvalid(modalCustomerName, wrap, modalNameError, 'Please enter your full name (minimum 2 characters).');
      return false;
    }
  }

  function validateModalPhone(showFeedback = true) {
    if (!modalCustomerPhone) return true;
    const val = modalCustomerPhone.value.trim();
    const digits = val.replace(/\D/g, '');
    const wrap = modalCustomerPhone.closest('.input-wrap');
    if (digits.length >= 7 && digits.length <= 15) {
      if (showFeedback) setFieldValid(modalCustomerPhone, wrap, modalPhoneError);
      return true;
    } else {
      if (showFeedback) setFieldInvalid(modalCustomerPhone, wrap, modalPhoneError, 'Please enter a valid phone number (at least 7–10 digits).');
      return false;
    }
  }

  function validateModalEmail(showFeedback = true) {
    if (!modalCustomerEmail) return true;
    const val = modalCustomerEmail.value.trim();
    const wrap = modalCustomerEmail.closest('.input-wrap');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(val)) {
      if (showFeedback) setFieldValid(modalCustomerEmail, wrap, modalEmailError);
      return true;
    } else {
      if (showFeedback) setFieldInvalid(modalCustomerEmail, wrap, modalEmailError, 'Please enter a valid email address.');
      return false;
    }
  }

  function validateModalService(showFeedback = true) {
    if (!modalCustomerService) return true;
    const val = modalCustomerService.value;
    const wrap = modalCustomerService.closest('.select-wrap');
    if (val && val !== '') {
      if (showFeedback) setFieldValid(modalCustomerService, wrap, modalServiceError);
      return true;
    } else {
      if (showFeedback) setFieldInvalid(modalCustomerService, wrap, modalServiceError, 'Please select a rehabilitation service.');
      return false;
    }
  }

  function validateModalConsultType(showFeedback = true) {
    if (!modalCustomerConsultType) return true;
    const val = modalCustomerConsultType.value;
    const wrap = modalCustomerConsultType.closest('.select-wrap');
    if (val && val !== '') {
      if (showFeedback) setFieldValid(modalCustomerConsultType, wrap, modalConsultTypeError);
      return true;
    } else {
      if (showFeedback) setFieldInvalid(modalCustomerConsultType, wrap, modalConsultTypeError, 'Please select a consultation type.');
      return false;
    }
  }

  function validateModalClinic(showFeedback = true) {
    if (!modalCustomerClinic) return true;
    const isClinicVisit = modalCustomerConsultType && modalCustomerConsultType.value === 'Clinic Visit';
    if (!isClinicVisit) {
      clearFieldState(modalCustomerClinic, modalCustomerClinic.closest('.select-wrap'), modalClinicError);
      if (modalBranchSelectError) modalBranchSelectError.textContent = '';
      return true;
    }
    const val = modalCustomerClinic.value;
    const wrap = modalCustomerClinic.closest('.select-wrap');
    if (val && val !== '') {
      if (showFeedback) {
        setFieldValid(modalCustomerClinic, wrap, modalClinicError);
        if (modalBranchSelectError) modalBranchSelectError.textContent = '';
      }
      return true;
    } else {
      if (showFeedback) {
        setFieldInvalid(modalCustomerClinic, wrap, modalClinicError, 'Please select a clinic branch for your visit.');
        if (modalBranchSelectError) {
          modalBranchSelectError.textContent = 'Please choose a clinic branch (Yanam, Gollapalem, or Amalapuram) to proceed.';
        }
      }
      return false;
    }
  }

  function validateModalProblem(showFeedback = true) {
    if (!modalCustomerProblem) return true;
    const val = modalCustomerProblem.value.trim();
    const wrap = modalCustomerProblem.closest('.textarea-wrap');
    if (val.length >= 5) {
      if (showFeedback) setFieldValid(modalCustomerProblem, wrap, modalProblemError);
      return true;
    } else {
      if (showFeedback) setFieldInvalid(modalCustomerProblem, wrap, modalProblemError, 'Please describe your symptoms (minimum 5 characters).');
      return false;
    }
  }

  function validateModalConsent(showFeedback = true) {
    if (!modalCustomerConsent) return true;
    if (modalCustomerConsent.checked) {
      if (modalConsentError) modalConsentError.textContent = '';
      return true;
    } else {
      if (showFeedback && modalConsentError) {
        modalConsentError.textContent = 'Please confirm consent to proceed.';
      }
      return false;
    }
  }

  // Realtime blur / input validation for modal
  if (modalCustomerName) {
    modalCustomerName.addEventListener('blur', () => validateModalName(true));
    modalCustomerName.addEventListener('input', () => {
      if (modalCustomerName.classList.contains('is-invalid')) validateModalName(true);
    });
  }
  if (modalCustomerPhone) {
    modalCustomerPhone.addEventListener('blur', () => validateModalPhone(true));
    modalCustomerPhone.addEventListener('input', () => {
      if (modalCustomerPhone.classList.contains('is-invalid')) validateModalPhone(true);
    });
  }
  if (modalCustomerEmail) {
    modalCustomerEmail.addEventListener('blur', () => validateModalEmail(true));
    modalCustomerEmail.addEventListener('input', () => {
      if (modalCustomerEmail.classList.contains('is-invalid')) validateModalEmail(true);
    });
  }
  if (modalCustomerService) {
    modalCustomerService.addEventListener('change', () => validateModalService(true));
  }
  if (modalCustomerConsultType) {
    modalCustomerConsultType.addEventListener('change', () => {
      validateModalConsultType(true);
      validateModalClinic(false);
    });
  }
  if (modalCustomerClinic) {
    modalCustomerClinic.addEventListener('change', () => {
      const isClinicVisit = modalCustomerConsultType && modalCustomerConsultType.value === 'Clinic Visit';
      if (isClinicVisit) validateModalClinic(true);
      updateModalBranchButtons(modalCustomerClinic.value);
    });
  }
  if (modalCustomerProblem) {
    modalCustomerProblem.addEventListener('blur', () => validateModalProblem(true));
    modalCustomerProblem.addEventListener('input', () => {
      if (modalCustomerProblem.classList.contains('is-invalid')) validateModalProblem(true);
    });
  }
  if (modalCustomerConsent) {
    modalCustomerConsent.addEventListener('change', () => validateModalConsent(true));
  }

  // ============================================================
  // WHATSAPP APPOINTMENT DEMO — Submit Handler
  // Builds a structured appointment message from the real form
  // values and opens wa.me/919110302008 with the message
  // pre-filled. The customer only needs to press Send inside
  // WhatsApp. No FormSubmit / external service required.
  // ============================================================

  /**
   * Build the GEP REHABS appointment request message.
   * Only include fields relevant to the chosen consultation pathway.
   */
  function buildWhatsAppMessage(nameVal, phoneVal, emailVal, serviceVal, consultTypeVal, clinicVal) {
    var lines = [];
    lines.push('GEP REHABS \u2014 Appointment Request');
    lines.push('');
    lines.push('Hello GEP REHABS,');
    lines.push('I would like to request an appointment.');
    lines.push('');
    lines.push('Customer Details');
    lines.push('Name: ' + nameVal);
    lines.push('Phone: ' + phoneVal);
    lines.push('Email: ' + emailVal);
    lines.push('');
    lines.push('Consultation Details');
    lines.push('Type: ' + consultTypeVal);
    lines.push('Service: ' + serviceVal);

    if (consultTypeVal === 'Clinic Visit' && clinicVal) {
      lines.push('Preferred Clinic: ' + clinicVal);
    } else if (consultTypeVal === 'Online Consultation') {
      // Clinic not required — omit if empty
      if (clinicVal) lines.push('Preferred Clinic: ' + clinicVal);
    } else if (consultTypeVal === 'Home Visit') {
      // Include clinic/location only when available
      if (clinicVal) lines.push('Preferred Location: ' + clinicVal);
    }

    lines.push('');
    lines.push('Please contact me to confirm my appointment.');
    lines.push('Thank you.');

    return lines.join('\n');
  }

  // Submit handler for Modal Form — WhatsApp appointment demo
  if (modalCustomerForm && modalCustomerSubmitBtn) {
    modalCustomerForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // ---- 1. Validate all required fields ----
      const isNameValid        = validateModalName(true);
      const isPhoneValid       = validateModalPhone(true);
      const isEmailValid       = validateModalEmail(true);
      const isServiceValid     = validateModalService(true);
      const isConsultTypeValid = validateModalConsultType(true);
      const isClinicValid      = validateModalClinic(true);
      const isProblemValid     = validateModalProblem(true);
      const isConsentValid     = validateModalConsent(true);

      if (!isNameValid || !isPhoneValid || !isEmailValid || !isServiceValid ||
          !isConsultTypeValid || !isClinicValid || !isProblemValid || !isConsentValid) {
        if (!isNameValid)        modalCustomerName        && modalCustomerName.focus();
        else if (!isPhoneValid)  modalCustomerPhone       && modalCustomerPhone.focus();
        else if (!isEmailValid)  modalCustomerEmail       && modalCustomerEmail.focus();
        else if (!isServiceValid)modalCustomerService     && modalCustomerService.focus();
        else if (!isConsultTypeValid) modalCustomerConsultType && modalCustomerConsultType.focus();
        else if (!isClinicValid) {
          const firstBranchBtn = modalClinicSection
            ? modalClinicSection.querySelector('.modal-clinic-btn:not(:disabled)')
            : null;
          if (firstBranchBtn) firstBranchBtn.focus();
          else modalCustomerClinic && modalCustomerClinic.focus();
        }
        else if (!isProblemValid) modalCustomerProblem  && modalCustomerProblem.focus();
        else if (!isConsentValid) modalCustomerConsent  && modalCustomerConsent.focus();
        return;
      }

      // ---- 2. Prevent accidental duplicate clicks ----
      if (modalCustomerSubmitBtn.disabled) return;
      modalCustomerSubmitBtn.disabled = true;

      const btnText    = modalCustomerSubmitBtn.querySelector('.btn-text');
      const btnArrow   = modalCustomerSubmitBtn.querySelector('.btn-arrow');
      const btnSpinner = modalCustomerSubmitBtn.querySelector('.btn-spinner');

      if (btnText)    btnText.textContent     = 'Opening WhatsApp\u2026';
      if (btnArrow)   btnArrow.style.display  = 'none';
      if (btnSpinner) btnSpinner.style.display = 'inline-block';

      if (modalFormErrorAlert) modalFormErrorAlert.style.display = 'none';

      // ---- 3. Collect actual form values ----
      const nameVal        = modalCustomerName.value.trim();
      const phoneVal       = modalCustomerPhone.value.trim();
      const emailVal       = modalCustomerEmail.value.trim();
      const serviceVal     = modalCustomerService.value;
      const consultTypeVal = modalCustomerConsultType ? modalCustomerConsultType.value : '';
      const clinicVal      = modalCustomerClinic ? modalCustomerClinic.value : '';

      // ---- 4. Build WhatsApp message ----
      const message    = buildWhatsAppMessage(nameVal, phoneVal, emailVal, serviceVal, consultTypeVal, clinicVal);
      const waUrl      = 'https://wa.me/919110302008?text=' + encodeURIComponent(message);

      // ---- 5. Open WhatsApp directly from this click event ----
      //   window.open() called synchronously in the click handler to
      //   minimise popup-blocking on mobile and desktop browsers.
      let waOpened = false;
      try {
        const waWindow = window.open(waUrl, '_blank', 'noopener,noreferrer');
        waOpened = !!waWindow;
      } catch (openErr) {
        console.warn('GEP WhatsApp: window.open failed:', openErr);
      }

      // ---- 6. Update fallback "Open in WhatsApp" button with encoded URL ----
      const modalSuccessWaBtn = document.getElementById('modalSuccessWaBtn');
      if (modalSuccessWaBtn) {
        modalSuccessWaBtn.href = waUrl;
      }
      // Also update the error-screen WhatsApp fallback button
      if (modalWhatsAppFallbackBtn) {
        modalWhatsAppFallbackBtn.href = waUrl;
      }

      // ---- 7. Show success screen ----
      if (modalCustomerForm)   modalCustomerForm.style.display   = 'none';
      if (modalClinicSection)  modalClinicSection.style.display  = 'none';
      if (modalFormErrorAlert) modalFormErrorAlert.style.display = 'none';
      if (modalSuccessScreen)  modalSuccessScreen.style.display  = 'block';

      // ---- 8. Reset form state (values preserved in WA message; form cleared for next use) ----
      modalCustomerForm.reset();
      clearFieldState(modalCustomerName,        modalCustomerName        ? modalCustomerName.closest('.input-wrap')      : null, modalNameError);
      clearFieldState(modalCustomerPhone,       modalCustomerPhone       ? modalCustomerPhone.closest('.input-wrap')     : null, modalPhoneError);
      clearFieldState(modalCustomerEmail,       modalCustomerEmail       ? modalCustomerEmail.closest('.input-wrap')     : null, modalEmailError);
      clearFieldState(modalCustomerService,     modalCustomerService     ? modalCustomerService.closest('.select-wrap')  : null, modalServiceError);
      clearFieldState(modalCustomerConsultType, modalCustomerConsultType ? modalCustomerConsultType.closest('.select-wrap') : null, modalConsultTypeError);
      clearFieldState(modalCustomerClinic,      modalCustomerClinic      ? modalCustomerClinic.closest('.select-wrap')   : null, modalClinicError);
      clearFieldState(modalCustomerProblem,     modalCustomerProblem     ? modalCustomerProblem.closest('.textarea-wrap'): null, modalProblemError);
      if (modalConsentError)        modalConsentError.textContent        = '';
      if (modalProblemCharCounter)  modalProblemCharCounter.textContent  = '0 / 500';

      // ---- 9. Re-enable button (form is now hidden; button resets for next modal open) ----
      modalCustomerSubmitBtn.disabled = false;
      if (btnText)    btnText.textContent     = 'Submit Details';
      if (btnArrow)   btnArrow.style.display  = 'inline';
      if (btnSpinner) btnSpinner.style.display = 'none';

      // ---- 10. If popup was blocked, instruct the user to use the in-modal button ----
      if (!waOpened) {
        console.warn('GEP WhatsApp: popup may have been blocked. User can tap "Open in WhatsApp" button.');
      }
    });
  }

  // Modal retry button — re-dispatch submit so the WhatsApp handler runs again
  if (modalRetryBtn && modalCustomerForm) {
    modalRetryBtn.addEventListener('click', () => {
      if (modalFormErrorAlert) modalFormErrorAlert.style.display = 'none';
      if (modalCustomerForm)   modalCustomerForm.style.display   = 'block';
      modalCustomerForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    });
  }

  // Connect appointment option triggers
  const apptClinicBtn = document.getElementById('apptClinic');
  if (apptClinicBtn) {
    apptClinicBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openAppointmentModal('Clinic Visit');
    });
  }

  const apptOnlineBtn = document.getElementById('apptOnline');
  if (apptOnlineBtn) {
    apptOnlineBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openAppointmentModal('Online Consultation', '', '', apptOnlineBtn);
    });
  }

  const finalOnlineConsultBtn = document.getElementById('finalOnlineConsultBtn');
  if (finalOnlineConsultBtn) {
    finalOnlineConsultBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openAppointmentModal('Online Consultation', '', '', finalOnlineConsultBtn);
    });
  }

  const apptHomeBtn = document.getElementById('apptHome');
  if (apptHomeBtn) {
    apptHomeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openAppointmentModal('Home Visit');
    });
  }

  // ========== Daylight Aperture Hero Intro Controller ==========
  function initDaylightApertureIntro() {
    const introEl = document.getElementById('heroIntro');
    const skipBtn = document.getElementById('heroIntroSkip');

    function revealHeader() {
      if (!header) return;
      const headerAnimEls = header.querySelectorAll('[data-anim]');
      headerAnimEls.forEach((el) => {
        el.classList.add('revealed');
      });
    }

    if (!introEl) {
      document.body.classList.add('no-intro', 'hero-ready');
      revealHeader();
      return;
    }

    let isIntroSeen = false;
    try {
      isIntroSeen = sessionStorage.getItem('gep_intro_seen') === 'true';
    } catch (e) {
      // Safe fallback if sessionStorage is restricted
      isIntroSeen = false;
    }

    // Skip immediately on repeat visit within session or if reduced motion is enabled
    if (isIntroSeen || prefersReducedMotion) {
      introEl.classList.add('intro-dismissed');
      introEl.setAttribute('aria-hidden', 'true');
      introEl.style.display = 'none';
      document.body.classList.add('no-intro');
      revealHeader();
      return;
    }

    // First visit in current session: activate Daylight Aperture sequence
    document.body.classList.add('has-intro');
    let introFinished = false;
    let fadeTimer = null;
    let cleanupTimer = null;

    function finishIntro(immediate) {
      if (introFinished) return;
      introFinished = true;
      if (fadeTimer) clearTimeout(fadeTimer);
      if (cleanupTimer) clearTimeout(cleanupTimer);

      try {
        sessionStorage.setItem('gep_intro_seen', 'true');
      } catch (e) {
        // Safe fallback
      }

      document.body.classList.remove('has-intro');
      document.body.classList.add('hero-ready');
      revealHeader();

      // Clean up event listeners
      window.removeEventListener('keydown', onKeydown);
      window.removeEventListener('wheel', onUserScroll);
      window.removeEventListener('touchmove', onUserScroll);

      if (immediate) {
        introEl.classList.add('intro-dismissed');
        introEl.setAttribute('aria-hidden', 'true');
        introEl.style.display = 'none';
        return;
      }

      introEl.classList.add('intro-fading');
      cleanupTimer = setTimeout(() => {
        introEl.classList.add('intro-dismissed');
        introEl.setAttribute('aria-hidden', 'true');
        introEl.style.display = 'none';
      }, 420);
    }

    // Skip handlers
    if (skipBtn) {
      skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        finishIntro(true);
      });
    }

    introEl.addEventListener('click', () => {
      finishIntro(false);
    });

    function onKeydown(e) {
      if (introFinished) return;
      if (e.key === 'Escape' || e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        finishIntro(true);
      }
    }
    window.addEventListener('keydown', onKeydown);

    function onUserScroll() {
      if (introFinished) return;
      finishIntro(false);
    }
    window.addEventListener('wheel', onUserScroll, { passive: true });
    window.addEventListener('touchmove', onUserScroll, { passive: true });

    // Daylight Aperture timed progression (1.55s reveal + 0.42s fade = ~1.85s total)
    // At 1.35s: Hero begins unveiling seamlessly underneath
    fadeTimer = setTimeout(() => {
      document.body.classList.add('hero-ready');
      revealHeader();
    }, 1350);

    // At 1.55s: Intro backdrop dissolves smoothly into real hero
    setTimeout(() => {
      if (!introFinished) {
        finishIntro(false);
      }
    }, 1550);
  }

  initDaylightApertureIntro();

  // ========== Scroll Reveal System (Directional) ==========
  // All [data-anim] elements outside the header are scroll-triggered
  if (!prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.classList.add('revealed');
            revealObserver.unobserve(el);

            // Layer hover safely: Once entrance transition finishes, enable hover micro-interactions
            if (el.classList.contains('service-card') || el.matches('.branch-grid article')) {
              const delayAttr = el.getAttribute('data-delay');
              const delayMs = delayAttr ? parseInt(delayAttr, 10) * 90 : 0;
              const durationMs = 850;
              let marked = false;
              const markReady = () => {
                if (!marked) {
                  marked = true;
                  el.classList.add('anim-ready');
                  el.removeEventListener('transitionend', onEnd);
                }
              };
              const onEnd = (e) => {
                if (e.target === el && (e.propertyName === 'transform' || e.propertyName === 'opacity')) {
                  markReady();
                }
              };
              el.addEventListener('transitionend', onEnd);
              setTimeout(markReady, delayMs + durationMs + 100);
            }
          }
        });
      },
      {
        threshold: 0.06,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    // Observe all [data-anim] elements NOT inside the header
    document.querySelectorAll('[data-anim]').forEach((el) => {
      // Skip header elements (already handled above)
      if (header.contains(el)) return;
      revealObserver.observe(el);
    });
  } else {
    // Reduced motion: make everything visible immediately
    document.querySelectorAll('[data-anim]').forEach((el) => {
      el.classList.add('revealed');
      el.classList.add('anim-ready');
    });
  }

  // ========== GEP Pill Nav Controller ==========
  const pillTrack = document.getElementById('pillTrack');
  const pillIndicator = document.getElementById('pillIndicator');
  const pillLinks = document.querySelectorAll('.pill-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav-panel a');
  let isHoveringPillTrack = false;

  function moveIndicatorTo(targetEl) {
    if (!pillIndicator || !targetEl) {
      if (pillIndicator) pillIndicator.style.opacity = '0';
      return;
    }
    const trackRect = pillTrack.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    const leftOffset = targetRect.left - trackRect.left;
    const width = targetRect.width;

    pillIndicator.style.transform = `translateX(${leftOffset}px)`;
    pillIndicator.style.width = `${width}px`;
    pillIndicator.style.opacity = '1';
  }

  function syncPillToActive() {
    if (isHoveringPillTrack) return;
    const activeLink = document.querySelector('.pill-link.active');
    if (activeLink) {
      moveIndicatorTo(activeLink);
    } else {
      if (pillIndicator) pillIndicator.style.opacity = '0';
    }
  }

  if (pillTrack && pillIndicator) {
    pillLinks.forEach((link) => {
      link.addEventListener('mouseenter', () => {
        isHoveringPillTrack = true;
        moveIndicatorTo(link);
      });
    });

    pillTrack.addEventListener('mouseleave', () => {
      isHoveringPillTrack = false;
      syncPillToActive();
    });

    window.addEventListener('resize', syncPillToActive);
  }

  // ========== Active Nav Link Highlighting (Desktop & Mobile) ==========
  const sectionIds = ['home', 'why', 'approach', 'services', 'online-rehab', 'team', 'reviews', 'branches', 'faq', 'appointments', 'contact'];
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

  const sectionToNavMap = {
    home: 'home',
    why: 'why',
    services: 'services',
    approach: 'approach',
    'online-rehab': 'approach',
    team: 'team',
    reviews: 'reviews',
    branches: 'branches',
    faq: 'branches',
    appointments: 'appointments',
    contact: 'contact',
  };

  const navCta = document.querySelector('.nav-cta');

  function updateActiveNav() {
    const headerHeight = header ? header.offsetHeight : 80;
    let currentSection = 'home';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - headerHeight - 140;
      if (window.pageYOffset >= sectionTop) {
        currentSection = section.id;
      }
    });

    const activeNavKey = sectionToNavMap[currentSection] || currentSection;

    // Update desktop pill links
    pillLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${activeNavKey}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update desktop CTA
    if (navCta) {
      if (activeNavKey === 'appointments') {
        navCta.classList.add('active');
      } else {
        navCta.classList.remove('active');
      }
    }

    // Update mobile nav links
    mobileLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${activeNavKey}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    syncPillToActive();
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  requestAnimationFrame(() => {
    updateActiveNav();
  });

  // ========== Hero Scroll Subtle Scale (1.00 -> 1.03) ==========
  function initHeroScrollScale() {
    if (prefersReducedMotion) return;

    const hero = document.getElementById('home');
    const heroTarget = document.querySelector('.hero-img') || document.querySelector('.hero-photo');
    if (!hero || !heroTarget) return;

    let ticking = false;

    function getMaxZoom() {
      const w = window.innerWidth;
      if (w <= 600) return 0.018; // Mobile: ~1.018
      if (w <= 900) return 0.026; // Tablet: ~1.026
      return 0.030;               // Desktop: 1.030
    }

    function updateScale() {
      const scrollY = window.pageYOffset;
      const heroH = hero.offsetHeight || 700;

      // Progressive scale 1.00 -> 1.03 as user scrolls through hero
      const p = Math.min(Math.max(scrollY / heroH, 0), 1);
      const maxZoom = getMaxZoom();
      const scale = 1 + maxZoom * p;

      heroTarget.style.setProperty('--hero-scale', scale.toFixed(4));
      heroTarget.style.transform = `scale(${scale.toFixed(4)})`;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScale();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    updateScale();
  }

  initHeroScrollScale();

  // ========== Service Conditions Modal Controller ==========
  const serviceModal = document.getElementById('serviceConditionsModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCancelBtn = document.getElementById('modalCancelBtn');
  const modalEnquireBtn = document.getElementById('modalEnquireBtn');
  const modalServiceNum = document.getElementById('modalServiceNum');
  const modalServiceTitle = document.getElementById('modalServiceTitle');
  const modalServiceDesc = document.getElementById('modalServiceDesc');
  const modalConditionsList = document.getElementById('modalConditionsList');
  const modalConditionsCount = document.getElementById('modalConditionsCount');
  let lastFocusedServiceTrigger = null;
  let activeServiceName = '';

  function openServiceModal(card, triggerEl) {
    if (!serviceModal) return;
    lastFocusedServiceTrigger = triggerEl || card.querySelector('.service-explore-btn') || card;

    const num = card.getAttribute('data-service-num') || '01';
    const title = card.getAttribute('data-service-title') || card.querySelector('.service-title')?.textContent || '';
    const desc = card.getAttribute('data-service-desc') || '';
    activeServiceName = title;

    if (modalServiceNum) modalServiceNum.textContent = num;
    if (modalServiceTitle) modalServiceTitle.textContent = title;
    if (modalServiceDesc) modalServiceDesc.textContent = desc;

    // Extract conditions
    const conditionsDataEl = card.querySelector('.service-conditions-data');
    if (modalConditionsList) {
      modalConditionsList.innerHTML = '';
      if (conditionsDataEl) {
        const items = conditionsDataEl.querySelectorAll('li');
        if (modalConditionsCount) {
          modalConditionsCount.textContent = `${items.length} conditions`;
        }
        items.forEach((item) => {
          const li = document.createElement('li');
          li.textContent = item.textContent;
          modalConditionsList.appendChild(li);
        });
      }
    }

    if (typeof serviceModal.showModal === 'function') {
      serviceModal.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      serviceModal.setAttribute('open', '');
      document.body.style.overflow = 'hidden';
    }

    if (modalCloseBtn) modalCloseBtn.focus();
  }

  function closeServiceModal() {
    if (!serviceModal) return;
    if (typeof serviceModal.close === 'function') {
      serviceModal.close();
    } else {
      serviceModal.removeAttribute('open');
    }
    document.body.style.overflow = '';
    if (lastFocusedServiceTrigger && typeof lastFocusedServiceTrigger.focus === 'function') {
      lastFocusedServiceTrigger.focus();
    }
  }

  // Attach click handlers to service cards & explore buttons
  document.querySelectorAll('.service-card.interactive').forEach((card) => {
    const exploreBtn = card.querySelector('.service-explore-btn');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openServiceModal(card, exploreBtn);
      });
    }

    card.addEventListener('click', (e) => {
      if (e.target.closest('.service-explore-btn')) return;
      openServiceModal(card, exploreBtn || card);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeServiceModal);
  if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeServiceModal);

  // Close when clicking outside modal box (backdrop click)
  if (serviceModal) {
    serviceModal.addEventListener('click', (e) => {
      const rect = serviceModal.getBoundingClientRect();
      const isInDialog = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      );
      if (!isInDialog) {
        closeServiceModal();
      }
    });

    serviceModal.addEventListener('cancel', () => {
      document.body.style.overflow = '';
      if (lastFocusedServiceTrigger && typeof lastFocusedServiceTrigger.focus === 'function') {
        lastFocusedServiceTrigger.focus();
      }
    });
  }

  // "Enquire For This Service" CTA in modal
  if (modalEnquireBtn) {
    modalEnquireBtn.addEventListener('click', () => {
      const selectedService = activeServiceName;
      closeServiceModal();
      setTimeout(() => {
        openAppointmentModal('Clinic Visit', '', selectedService);
      }, 120);
    });
  }

  // "Start Online Consultation" in Section 5
  const onlineRehabBtn = document.querySelector('.online-rehab-btn');
  if (onlineRehabBtn) {
    onlineRehabBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openAppointmentModal('Online Consultation');
    });
  }

  // ========== Privacy Policy Modal ==========
  const privacyModal = document.getElementById('privacy');
  const privacyCloseBtn = document.getElementById('privacyCloseBtn');
  const privacyCancelBtn = document.getElementById('privacyCancelBtn');
  const privacyAcknowledgeBtn = document.getElementById('privacyAcknowledgeBtn');
  const privacyLinks = document.querySelectorAll('.consent-privacy-link, .footer-privacy-link');

  let lastFocusedPrivacyTrigger = null;

  function openPrivacyModal() {
    if (!privacyModal) return;
    lastFocusedPrivacyTrigger = document.activeElement;
    document.body.style.overflow = 'hidden';
    privacyModal.showModal();
    if (privacyCloseBtn) privacyCloseBtn.focus();
  }

  function closePrivacyModal() {
    if (!privacyModal) return;
    document.body.style.overflow = '';
    privacyModal.close();
    if (lastFocusedPrivacyTrigger && typeof lastFocusedPrivacyTrigger.focus === 'function') {
      lastFocusedPrivacyTrigger.focus();
    }
  }

  privacyLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openPrivacyModal();
    });
  });

  if (privacyCloseBtn) privacyCloseBtn.addEventListener('click', closePrivacyModal);
  if (privacyCancelBtn) privacyCancelBtn.addEventListener('click', closePrivacyModal);
  if (privacyAcknowledgeBtn) privacyAcknowledgeBtn.addEventListener('click', closePrivacyModal);

  if (privacyModal) {
    privacyModal.addEventListener('click', (e) => {
      const rect = privacyModal.getBoundingClientRect();
      const isInDialog = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      );
      if (!isInDialog) closePrivacyModal();
    });

    privacyModal.addEventListener('cancel', () => {
      document.body.style.overflow = '';
      if (lastFocusedPrivacyTrigger && typeof lastFocusedPrivacyTrigger.focus === 'function') {
        setTimeout(() => lastFocusedPrivacyTrigger.focus(), 10);
      }
    });
  }

  // ========== Patient Reviews: Interactive One-by-One Carousel (Phase 4) ==========
  const carouselWrapper = document.getElementById('reviewsCarouselWrapper');
  const carouselStage = document.getElementById('carouselStage');
  const carouselTrack = document.getElementById('carouselTrack');
  const reviewsPrevBtn = document.getElementById('reviewsPrevBtn');
  const reviewsNextBtn = document.getElementById('reviewsNextBtn');
  const carouselPagination = document.getElementById('carouselPagination');

  if (carouselStage && carouselTrack) {
    const reviewCards = Array.from(carouselTrack.querySelectorAll('.review-card'));
    const totalSlides = reviewCards.length;
    let currentSlide = 0;
    const AUTOPLAY_INTERVAL = 4500;
    let autoplayTimer = null;
    let isPaused = false;
    let isTouchActive = false;
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Build accessible pagination dots
    if (carouselPagination && totalSlides > 0) {
      carouselPagination.innerHTML = '';
      reviewCards.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot' + (idx === 0 ? ' is-active' : '');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Go to review ${idx + 1} of ${totalSlides}`);
        dot.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
        dot.setAttribute('tabindex', idx === 0 ? '0' : '-1');

        dot.addEventListener('click', () => {
          pauseAutoplay();
          goToSlide(idx);
          resumeAutoplay(AUTOPLAY_INTERVAL);
        });

        carouselPagination.appendChild(dot);
      });
    }

    function updateCarouselPosition(index) {
      if (totalSlides === 0) return;
      currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;

      const stageWidth = carouselStage.offsetWidth;
      const targetCard = reviewCards[currentSlide];
      if (!targetCard) return;

      const cardLeft = targetCard.offsetLeft;
      const cardWidth = targetCard.offsetWidth;
      const targetOffset = (stageWidth / 2) - (cardLeft + (cardWidth / 2));

      carouselTrack.style.transform = `translateX(${targetOffset}px)`;

      // Update card visual state & accessible attributes
      reviewCards.forEach((card, idx) => {
        const isActive = idx === currentSlide;
        card.classList.toggle('is-active', isActive);
        card.setAttribute('aria-hidden', isActive ? 'false' : 'true');

        // Allow Tab focus to Google badge only on the active card
        const badge = card.querySelector('.review-google-badge');
        if (badge) {
          badge.setAttribute('tabindex', isActive ? '0' : '-1');
        }
      });

      // Update pagination dots
      if (carouselPagination) {
        const dots = carouselPagination.querySelectorAll('.carousel-dot');
        dots.forEach((dot, idx) => {
          const isActive = idx === currentSlide;
          dot.classList.toggle('is-active', isActive);
          dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
          dot.setAttribute('tabindex', isActive ? '0' : '-1');
        });
      }
    }

    function goToSlide(index) {
      updateCarouselPosition(index);
    }

    function stopAutoplayTimer() {
      if (autoplayTimer) {
        clearTimeout(autoplayTimer);
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function startAutoplay() {
      if (prefersReducedMotion || isPaused) return;
      stopAutoplayTimer();
      autoplayTimer = setInterval(() => {
        goToSlide(currentSlide + 1);
      }, AUTOPLAY_INTERVAL);
    }

    function pauseAutoplay() {
      isPaused = true;
      stopAutoplayTimer();
    }

    function resumeAutoplay(delay = AUTOPLAY_INTERVAL) {
      isPaused = false;
      stopAutoplayTimer();
      if (prefersReducedMotion) return;
      autoplayTimer = setTimeout(() => {
        goToSlide(currentSlide + 1);
        startAutoplay();
      }, delay);
    }

    // Previous & Next Navigation Buttons
    if (reviewsPrevBtn) {
      reviewsPrevBtn.addEventListener('click', () => {
        pauseAutoplay();
        goToSlide(currentSlide - 1);
        resumeAutoplay(AUTOPLAY_INTERVAL);
      });
    }

    if (reviewsNextBtn) {
      reviewsNextBtn.addEventListener('click', () => {
        pauseAutoplay();
        goToSlide(currentSlide + 1);
        resumeAutoplay(AUTOPLAY_INTERVAL);
      });
    }

    // Keyboard Navigation on Carousel Stage
    carouselStage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        pauseAutoplay();
        goToSlide(currentSlide - 1);
        resumeAutoplay(AUTOPLAY_INTERVAL);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        pauseAutoplay();
        goToSlide(currentSlide + 1);
        resumeAutoplay(AUTOPLAY_INTERVAL);
      } else if (e.key === 'Home') {
        e.preventDefault();
        pauseAutoplay();
        goToSlide(0);
        resumeAutoplay(AUTOPLAY_INTERVAL);
      } else if (e.key === 'End') {
        e.preventDefault();
        pauseAutoplay();
        goToSlide(totalSlides - 1);
        resumeAutoplay(AUTOPLAY_INTERVAL);
      }
    });

    carouselStage.addEventListener('focusin', () => {
      pauseAutoplay();
    });

    carouselStage.addEventListener('focusout', (e) => {
      if (!carouselStage.contains(e.relatedTarget)) {
        resumeAutoplay(AUTOPLAY_INTERVAL);
      }
    });

    // Desktop Pointer Hover Interactions
    if (carouselWrapper) {
      carouselWrapper.addEventListener('mouseenter', () => {
        pauseAutoplay();
      });

      carouselWrapper.addEventListener('mouseleave', () => {
        if (!isTouchActive) {
          resumeAutoplay(AUTOPLAY_INTERVAL);
        }
      });
    }

    reviewCards.forEach((card, idx) => {
      card.addEventListener('mouseenter', () => {
        if (isTouchActive) return;
        pauseAutoplay();
        goToSlide(idx);
      });
    });

    // Mobile Touch & Swipe Navigation
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    carouselStage.addEventListener('touchstart', (e) => {
      isTouchActive = true;
      pauseAutoplay();
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchEndX = touchStartX;
        touchEndY = touchStartY;
      }
    }, { passive: true });

    carouselStage.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        touchEndX = e.touches[0].clientX;
        touchEndY = e.touches[0].clientY;
      }
    }, { passive: true });

    carouselStage.addEventListener('touchend', () => {
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Distinguish deliberate horizontal swipe from vertical scrolling
      if (absDeltaX > 40 && absDeltaX > absDeltaY * 1.2) {
        if (deltaX < 0) {
          // Swipe left -> Next review
          goToSlide(currentSlide + 1);
        } else {
          // Swipe right -> Previous review
          goToSlide(currentSlide - 1);
        }
      }

      // Short delay before clearing touch flag and resuming autoplay
      setTimeout(() => {
        isTouchActive = false;
      }, 400);

      resumeAutoplay(AUTOPLAY_INTERVAL);
    }, { passive: true });

    // Tab Visibility API: Pause when tab is hidden, resume when tab is visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        pauseAutoplay();
      } else {
        resumeAutoplay(AUTOPLAY_INTERVAL);
      }
    });

    // Resize Handling
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => {
        updateCarouselPosition(currentSlide);
      });
      ro.observe(carouselStage);
    } else {
      window.addEventListener('resize', () => {
        updateCarouselPosition(currentSlide);
      });
    }

    // Initialize carousel on load
    updateCarouselPosition(0);
    if (!prefersReducedMotion) {
      startAutoplay();
    }
  }

  // ========== FAQ Accordion (Phase 5) ==========
  const faqTriggers = Array.from(document.querySelectorAll('.faq-trigger'));

  faqTriggers.forEach((trigger, index) => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const item = trigger.closest('.faq-item');

      trigger.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
      if (item) {
        item.classList.toggle('is-open', !isExpanded);
      }
    });

    // Keyboard navigation (ArrowDown / ArrowUp / Home / End)
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (index + 1) % faqTriggers.length;
        faqTriggers[nextIndex].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (index - 1 + faqTriggers.length) % faqTriggers.length;
        faqTriggers[prevIndex].focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        faqTriggers[0].focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        faqTriggers[faqTriggers.length - 1].focus();
      }
    });
  });

  // ========== Patient Review Submission Modal Controller (Phase 7) ==========
  let lastFocusedReviewTrigger = null;

  const reviewModal = document.getElementById('reviewModal');
  const openReviewModalBtn = document.getElementById('openReviewModalBtn');
  const reviewModalCloseBtn = document.getElementById('reviewModalCloseBtn');
  const reviewSuccessScreen = document.getElementById('reviewSuccessScreen');
  const reviewSuccessDoneBtn = document.getElementById('reviewSuccessDoneBtn');
  const modalReviewForm = document.getElementById('modalReviewForm');
  const reviewSubmitBtn = document.getElementById('reviewSubmitBtn');
  const reviewFormErrorAlert = document.getElementById('reviewFormErrorAlert');
  const reviewFormErrorMessage = document.getElementById('reviewFormErrorMessage');
  const reviewRetryBtn = document.getElementById('reviewRetryBtn');
  const reviewEmailFallbackBtn = document.getElementById('reviewEmailFallbackBtn');

  const reviewCustomerName = document.getElementById('reviewCustomerName');
  const reviewClinic = document.getElementById('reviewClinic');
  const reviewRating = document.getElementById('reviewRating');
  const reviewText = document.getElementById('reviewText');
  const reviewConsent = document.getElementById('reviewConsent');
  const reviewCharCounter = document.getElementById('reviewCharCounter');

  const reviewNameError = document.getElementById('reviewNameError');
  const reviewClinicError = document.getElementById('reviewClinicError');
  const reviewRatingError = document.getElementById('reviewRatingError');
  const reviewTextError = document.getElementById('reviewTextError');
  const reviewConsentError = document.getElementById('reviewConsentError');

  function openReviewModal() {
    if (!reviewModal) return;
    lastFocusedReviewTrigger = document.activeElement;

    if (reviewFormErrorAlert) reviewFormErrorAlert.style.display = 'none';
    if (reviewSuccessScreen) reviewSuccessScreen.style.display = 'none';
    if (modalReviewForm) modalReviewForm.style.display = 'block';

    document.body.classList.add('modal-open');
    if (typeof reviewModal.showModal === 'function') {
      reviewModal.showModal();
    } else {
      reviewModal.setAttribute('open', '');
    }

    setTimeout(() => {
      if (reviewCustomerName) reviewCustomerName.focus();
    }, 60);
  }

  function closeReviewModal() {
    if (!reviewModal) return;
    document.body.classList.remove('modal-open');
    if (typeof reviewModal.close === 'function') {
      reviewModal.close();
    } else {
      reviewModal.removeAttribute('open');
    }
    if (lastFocusedReviewTrigger && typeof lastFocusedReviewTrigger.focus === 'function') {
      lastFocusedReviewTrigger.focus();
    }
  }

  if (openReviewModalBtn) {
    openReviewModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openReviewModal();
    });
  }

  if (reviewModalCloseBtn) {
    reviewModalCloseBtn.addEventListener('click', closeReviewModal);
  }

  if (reviewSuccessDoneBtn) {
    reviewSuccessDoneBtn.addEventListener('click', closeReviewModal);
  }

  if (reviewModal) {
    reviewModal.addEventListener('close', () => {
      document.body.classList.remove('modal-open');
    });

    reviewModal.addEventListener('cancel', () => {
      document.body.classList.remove('modal-open');
      if (lastFocusedReviewTrigger && typeof lastFocusedReviewTrigger.focus === 'function') {
        setTimeout(() => lastFocusedReviewTrigger.focus(), 10);
      }
    });

    // Light-dismiss click outside dialog box
    reviewModal.addEventListener('click', (e) => {
      if (e.target !== reviewModal) return;
      const rect = reviewModal.getBoundingClientRect();
      const isInDialog = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      );
      if (!isInDialog) closeReviewModal();
    });
  }

  // Real-time character counter for review textarea
  if (reviewText && reviewCharCounter) {
    reviewText.addEventListener('input', () => {
      const len = reviewText.value.length;
      reviewCharCounter.textContent = `${len} / 1000`;
      reviewCharCounter.classList.toggle('char-limit', len >= 1000);
    });
  }

  function validateReviewName(showFeedback = true) {
    if (!reviewCustomerName) return true;
    const val = reviewCustomerName.value.trim();
    const wrap = reviewCustomerName.closest('.input-wrap');
    if (val.length >= 2) {
      if (showFeedback) setFieldValid(reviewCustomerName, wrap, reviewNameError);
      return true;
    } else {
      if (showFeedback) setFieldInvalid(reviewCustomerName, wrap, reviewNameError, 'Please enter your full name (minimum 2 characters).');
      return false;
    }
  }

  function validateReviewClinic(showFeedback = true) {
    if (!reviewClinic) return true;
    const val = reviewClinic.value;
    const wrap = reviewClinic.closest('.select-wrap');
    if (val && val !== '') {
      if (showFeedback) setFieldValid(reviewClinic, wrap, reviewClinicError);
      return true;
    } else {
      if (showFeedback) setFieldInvalid(reviewClinic, wrap, reviewClinicError, 'Please select a clinic or location.');
      return false;
    }
  }

  function validateReviewRating(showFeedback = true) {
    if (!reviewRating) return true;
    const val = reviewRating.value;
    const wrap = reviewRating.closest('.select-wrap');
    if (val && val !== '') {
      if (showFeedback) setFieldValid(reviewRating, wrap, reviewRatingError);
      return true;
    } else {
      if (showFeedback) setFieldInvalid(reviewRating, wrap, reviewRatingError, 'Please select a star rating.');
      return false;
    }
  }

  function validateReviewText(showFeedback = true) {
    if (!reviewText) return true;
    const val = reviewText.value.trim();
    const wrap = reviewText.closest('.textarea-wrap');
    if (val.length >= 10) {
      if (showFeedback) setFieldValid(reviewText, wrap, reviewTextError);
      return true;
    } else {
      if (showFeedback) setFieldInvalid(reviewText, wrap, reviewTextError, 'Please share your experience (minimum 10 characters).');
      return false;
    }
  }

  function validateReviewConsent(showFeedback = true) {
    if (!reviewConsent) return true;
    if (reviewConsent.checked) {
      if (reviewConsentError) reviewConsentError.textContent = '';
      return true;
    } else {
      if (showFeedback && reviewConsentError) {
        reviewConsentError.textContent = 'Please confirm consent to proceed.';
      }
      return false;
    }
  }

  // Real-time blur / input event listeners
  if (reviewCustomerName) {
    reviewCustomerName.addEventListener('blur', () => validateReviewName(true));
    reviewCustomerName.addEventListener('input', () => {
      if (reviewCustomerName.classList.contains('is-invalid')) validateReviewName(true);
    });
  }
  if (reviewClinic) {
    reviewClinic.addEventListener('change', () => validateReviewClinic(true));
  }
  if (reviewRating) {
    reviewRating.addEventListener('change', () => validateReviewRating(true));
  }
  if (reviewText) {
    reviewText.addEventListener('blur', () => validateReviewText(true));
    reviewText.addEventListener('input', () => {
      if (reviewText.classList.contains('is-invalid')) validateReviewText(true);
    });
  }
  if (reviewConsent) {
    reviewConsent.addEventListener('change', () => validateReviewConsent(true));
  }

  // Review form submission handler
  if (modalReviewForm && reviewSubmitBtn) {
    modalReviewForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const isNameValid = validateReviewName(true);
      const isClinicValid = validateReviewClinic(true);
      const isRatingValid = validateReviewRating(true);
      const isTextValid = validateReviewText(true);
      const isConsentValid = validateReviewConsent(true);

      if (!isNameValid || !isClinicValid || !isRatingValid || !isTextValid || !isConsentValid) {
        if (!isNameValid) reviewCustomerName && reviewCustomerName.focus();
        else if (!isClinicValid) reviewClinic && reviewClinic.focus();
        else if (!isRatingValid) reviewRating && reviewRating.focus();
        else if (!isTextValid) reviewText && reviewText.focus();
        else if (!isConsentValid) reviewConsent && reviewConsent.focus();
        return;
      }

      const btnText = reviewSubmitBtn.querySelector('.btn-text');
      const btnArrow = reviewSubmitBtn.querySelector('.btn-arrow');
      const btnSpinner = reviewSubmitBtn.querySelector('.btn-spinner');

      reviewSubmitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Submitting Review...';
      if (btnArrow) btnArrow.style.display = 'none';
      if (btnSpinner) btnSpinner.style.display = 'inline-block';

      if (reviewFormErrorAlert) reviewFormErrorAlert.style.display = 'none';

      const nameVal = reviewCustomerName.value.trim();
      const clinicVal = reviewClinic.value;
      const ratingVal = reviewRating.value;
      const textVal = reviewText.value.trim();

      const submittedAt = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short'
      });
      const approvalInstructions = [
        'A new patient review has been submitted through the GEP REHABS website.',
        '',
        'Please check the details and decide whether this review is suitable to publish on the website.',
        'Reply APPROVE to authorize publication, or REJECT to keep it private.',
        'Do not publish this review until management has approved it.'
      ].join('\n');
      const displayPreview = `${nameVal} | ${clinicVal} | ${ratingVal}\n\u201c${textVal}\u201d`;

      const payload = {
        "Request": "PATIENT REVIEW \u2014 MANAGEMENT APPROVAL REQUIRED",
        "Action Required": "Please review this submission. Reply APPROVE to publish or REJECT to keep it private. Do not publish before approval.",
        "Customer Name": nameVal,
        "Clinic / Location": clinicVal,
        "Star Rating": ratingVal,
        "Review Text": textVal,
        "Suggested Website Display": displayPreview,
        "Consent Given": "Yes",
        "Submitted At (IST)": submittedAt,
        "Approval Message": approvalInstructions,
        "Review Status": "PENDING MANAGEMENT APPROVAL \u2014 NOT PUBLISHED",
        "_subject": `[APPROVAL REQUIRED] Patient Review \u2014 ${nameVal} \u2014 ${ratingVal}`,
        "_template": "table",
        "_captcha": "false"
      };

      try {
        let isSuccess = false;
        let errMsg = '';

        // FormSubmit AJAX route with generated identifier
        try {
          const response = await fetch('https://formsubmit.co/ajax/212c61deef04885fb67ddbffcea0bbdb', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          if (response.status === 521 || response.status === 502 || response.status === 503 || response.status === 504) {
            errMsg = `FormSubmit service is temporarily unavailable (HTTP ${response.status}).`;
          } else {
            const data = await response.json().catch(() => ({}));
            if (response.ok && (data.success === 'true' || data.success === true)) {
              isSuccess = true;
            } else if (data.message) {
              errMsg = data.message;
            } else if (!response.ok) {
              errMsg = `Service responded with status ${response.status}`;
            }
          }
        } catch (ajaxErr) {
          errMsg = ajaxErr.message || 'Network connection error';
        }

        if (isSuccess) {
          if (modalReviewForm) modalReviewForm.style.display = 'none';
          if (reviewFormErrorAlert) reviewFormErrorAlert.style.display = 'none';
          if (reviewSuccessScreen) reviewSuccessScreen.style.display = 'block';
          modalReviewForm.reset();
          clearFieldState(reviewCustomerName, reviewCustomerName ? reviewCustomerName.closest('.input-wrap') : null, reviewNameError);
          clearFieldState(reviewClinic, reviewClinic ? reviewClinic.closest('.select-wrap') : null, reviewClinicError);
          clearFieldState(reviewRating, reviewRating ? reviewRating.closest('.select-wrap') : null, reviewRatingError);
          clearFieldState(reviewText, reviewText ? reviewText.closest('.textarea-wrap') : null, reviewTextError);
          if (reviewConsentError) reviewConsentError.textContent = '';
          if (reviewCharCounter) reviewCharCounter.textContent = '0 / 1000';
          // Reviews remain strictly private until clinic approval.
          // Never insert unmoderated user submissions into the carousel.
        } else {
          throw new Error(errMsg || 'Review submission service encountered an error.');
        }
      } catch (err) {
        console.error('Review submission failed:', err);
        if (reviewFormErrorAlert) {
          reviewFormErrorAlert.style.display = 'flex';
          if (reviewFormErrorMessage) {
            reviewFormErrorMessage.textContent = 'We could not send your review automatically. Your details are still in the form. Choose Email GEP to open a prepared email, then press Send in your email app. You can also try again.';
          }

          if (reviewEmailFallbackBtn) {
            const emailSubject = `[APPROVAL REQUIRED] Patient Review - ${nameVal} - ${ratingVal}`;
            const emailBody = [
              'GEP REHABS — PATIENT REVIEW APPROVAL REQUEST',
              '',
              'A new patient review has been submitted. Please review the complete details below.',
              '',
              `Customer Name: ${nameVal}`,
              `Clinic / Location: ${clinicVal}`,
              `Star Rating: ${ratingVal}`,
              `Submitted At (IST): ${submittedAt}`,
              'Consent Given: Yes',
              '',
              'FULL REVIEW:',
              textVal,
              '',
              'SUGGESTED WEBSITE DISPLAY:',
              `${nameVal} | ${clinicVal} | ${ratingVal}`,
              `“${textVal}”`,
              '',
              'MANAGEMENT DECISION REQUIRED:',
              'Is this review suitable to publish on the GEP REHABS website?',
              'Reply APPROVE to authorize publication or REJECT to keep it private.',
              'Do not publish the review until management has approved it.'
            ].join('\n');
            reviewEmailFallbackBtn.href = `mailto:geprehabs@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
          }

          reviewFormErrorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } finally {
        reviewSubmitBtn.disabled = false;
        if (btnText) btnText.textContent = 'Submit Review';
        if (btnArrow) btnArrow.style.display = 'inline';
        if (btnSpinner) btnSpinner.style.display = 'none';
      }
    });
  }

  // Review retry button
  if (reviewRetryBtn && modalReviewForm) {
    reviewRetryBtn.addEventListener('click', () => {
      modalReviewForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    });
  }

})();
