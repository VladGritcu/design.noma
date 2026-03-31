(function() {
  'use strict';

  /* =========================================================
     CONTACT FORM HANDLER
  ========================================================= */
  class ContactFormHandler {
    constructor() {
      this.form = document.getElementById('contactForm');
      this.nameField = document.getElementById('name_field');
      this.emailField = document.getElementById('email_field');
      this.phoneField = document.getElementById('phone_field');
      this.messageField = document.getElementById('message_field');
      this.submitBtn = document.getElementById('submitBtn');
      this.toast = document.getElementById('successToast');
      this.progressBar = document.getElementById('formProgressBar');

      this.iti = null;
      this.fields = [this.nameField, this.emailField, this.phoneField, this.messageField];

      this.init();
    }

    init() {
      if (!this.form) return;

      // Initialize intl-tel-input
      if (this.phoneField && typeof window.intlTelInput !== 'undefined') {
        this.iti = window.intlTelInput(this.phoneField, {
          separateDialCode: true,
          preferredCountries: ['md', 'ro'],
          utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.4/build/js/utils.js'
        });

        // Override padding for flag space
        this.phoneField.style.paddingLeft = '46px';
      }

      // Initialize char counter for textarea
      this.initCharCounter();

      // Initialize progress bar
      this.updateProgress();

      // Field events
      this.fields.forEach(field => {
        if (!field) return;

        // Focus events for Safari compatibility
        field.addEventListener('focusin', (e) => {
          const wrapper = e.target.closest('.form-field-modern');
          wrapper?.classList.add('has-focus');
        });

        field.addEventListener('focusout', (e) => {
          const wrapper = e.target.closest('.form-field-modern');
          wrapper?.classList.remove('has-focus');
          this.validateField(field);
        });

        // Input events for progress bar and char counter
        field.addEventListener('input', () => {
          this.updateProgress();
          if (field === this.messageField) {
            this.updateCharCounter();
          }
        });

        // Change events for progress bar
        field.addEventListener('change', () => {
          this.updateProgress();
        });
      });

      // Form submit
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    }

    initCharCounter() {
      if (!this.messageField) return;

      const footer = this.messageField.closest('.form-field-modern')?.querySelector('.form-textarea-footer');
      if (!footer) return;

      const counter = document.createElement('span');
      counter.className = 'form-char-count';
      counter.textContent = '0 / 1000';
      footer.appendChild(counter);
    }

    updateCharCounter() {
      if (!this.messageField) return;

      const counter = this.messageField.closest('.form-field-modern')?.querySelector('.form-char-count');
      if (!counter) return;

      const length = this.messageField.value.length;
      const maxLength = this.messageField.getAttribute('maxlength') || 1000;
      counter.textContent = `${length} / ${maxLength}`;
    }

    updateProgress() {
      if (!this.progressBar) return;

      let filledCount = 0;
      const totalFields = this.fields.filter(f => f).length;

      this.fields.forEach(field => {
        if (!field) return;

        if (field === this.emailField) {
          if (this.isValidEmail(field.value)) filledCount++;
        } else if (field === this.phoneField) {
          if (this.iti && this.iti.isValidNumber()) filledCount++;
        } else if (field === this.nameField) {
          if (field.value.trim().length >= 2) filledCount++;
        } else {
          if (field.value.trim().length > 0) filledCount++;
        }
      });

      const progress = (filledCount / totalFields) * 100;
      this.progressBar.style.setProperty('--progress', `${progress}%`);
      this.progressBar.setAttribute('aria-valuenow', Math.round(progress));
    }

    validateField(field) {
      if (!field) return true;

      let isValid = true;
      let errorMessage = '';

      if (field === this.nameField) {
        const value = field.value.trim();
        if (value.length < 2) {
          isValid = false;
          errorMessage = field.closest('.form-field-modern')?.querySelector('.form-error-message')?.getAttribute('data-default-text') || 'Te rugăm să introduci numele tău.';
        }
      } else if (field === this.emailField) {
        if (!this.isValidEmail(field.value)) {
          isValid = false;
          errorMessage = field.closest('.form-field-modern')?.querySelector('.form-error-message')?.getAttribute('data-default-text') || 'Te rugăm să introduci un email valid.';
        }
      } else if (field === this.phoneField) {
        if (this.iti && !this.iti.isValidNumber()) {
          isValid = false;
          errorMessage = field.closest('.form-field-modern')?.querySelector('.form-error-message')?.getAttribute('data-default-text') || 'Te rugăm să introduci un număr de telefon valid.';
        }
      } else if (field === this.messageField) {
        if (field.value.trim().length === 0) {
          isValid = false;
          errorMessage = 'Te rugăm să introduci un mesaj.';
        }
      }

      this.setFieldError(field, !isValid, errorMessage);
      return isValid;
    }

    setFieldError(field, hasError, message = '') {
      if (!field) return;

      const errorSpan = field.closest('.form-field-modern')?.querySelector('.form-error-message');

      if (hasError) {
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');
        if (errorSpan) {
          errorSpan.textContent = message;
          errorSpan.classList.add('show');
        }
      } else {
        field.classList.remove('error');
        field.setAttribute('aria-invalid', 'false');
        if (errorSpan) {
          errorSpan.classList.remove('show');
        }
      }
    }

    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }

    async handleSubmit() {
      // Validate all fields
      let allValid = true;
      this.fields.forEach(field => {
        if (!this.validateField(field)) {
          allValid = false;
        }
      });

      if (!allValid) {
        // Focus first invalid field
        const firstInvalid = this.form.querySelector('.form-input-modern.error');
        if (firstInvalid) {
          firstInvalid.focus();
        }
        return;
      }

      // Show loading state
      this.submitBtn.classList.add('loading');
      this.submitBtn.disabled = true;

      try {
        // Prepare form data
        const formData = new FormData(this.form);

        // Add phone with country code if intl-tel-input is available
        if (this.iti) {
          formData.set('phone', this.iti.getNumber());
        }

        // Simulate API call (replace with actual endpoint)
        await this.simulateApiCall(formData);

        // Success
        this.submitBtn.classList.remove('loading');
        this.submitBtn.classList.add('success');
        this.submitBtn.querySelector('.btn-text')?.replaceWith(document.createTextNode('Trimis ✓'));

        // Show toast
        this.showToast(false);

        // Reset form after 3s
        setTimeout(() => {
          this.form.reset();
          this.submitBtn.classList.remove('success');
          this.submitBtn.disabled = false;
          const btnText = this.submitBtn.querySelector('.btn-text--desktop');
          if (btnText) btnText.textContent = 'Trimite mesajul';
          this.updateProgress();
          this.updateCharCounter();
        }, 3000);

      } catch (error) {
        console.error('Form submission error:', error);

        // Error state
        this.submitBtn.classList.remove('loading');
        this.submitBtn.disabled = false;
        this.showToast(true, 'A apărut o eroare. Te rugăm să încerci din nou.');
      }
    }

    async simulateApiCall(formData) {
      try {
        const supabaseUrl = 'https://lxxxqwacwkmawkryxxzd.supabase.co';
        const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4eHhxd2Fjd2ttYXdrcnl4eHpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzgzMDgsImV4cCI6MjA4OTkxNDMwOH0.iGK01G9U3HjFPZaG_MMcIB9-mld5Ri5IRRbSRB8EpmY';

        const response = await fetch(
          `${supabaseUrl}/functions/v1/contact-form-submit`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${anonKey}`,
              'Content-Type': 'application/octet-stream',
            },
            body: formData
          }
        );

        if (!response.ok) {
          console.error('Form submission failed:', response.status);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Form submitted successfully:', result);
      } catch (error) {
        console.error('Email sending error:', error);
      }
    }

    showToast(isError = false, message = '') {
      if (!this.toast) return;

      // Set error class if needed
      if (isError) {
        this.toast.classList.add('error');
        const textElement = this.toast.querySelector('.form-toast__text');
        if (textElement && message) {
          textElement.textContent = message;
        }
      } else {
        this.toast.classList.remove('error');
      }

      // Show toast
      this.toast.removeAttribute('hidden');
      setTimeout(() => {
        this.toast.classList.add('form-toast--show');
      }, 10);

      // Hide after 5s
      setTimeout(() => {
        this.toast.classList.remove('form-toast--show');
        setTimeout(() => {
          this.toast.setAttribute('hidden', '');
        }, 300);
      }, 5000);
    }
  }

  /* =========================================================
     INITIALIZE FORM
  ========================================================= */
  function initializeForm() {
    new ContactFormHandler();
  }

  // Run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeForm);
  } else {
    initializeForm();
  }

})();
