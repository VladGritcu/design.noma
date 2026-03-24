(function() {
  'use strict';

  class ContactPageFileHandler {
    constructor() {
      this.fileInput = document.getElementById('photos_field');
      this.fileLabel = document.querySelector('.file-input-label');
      this.previewList = document.getElementById('file-preview-list');
      this.files = [];
      this.maxFiles = 5;
      this.maxSize = 5 * 1024 * 1024;

      this.init();
    }

    init() {
      if (!this.fileInput) return;

      this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
      this.fileLabel.addEventListener('dragover', (e) => this.handleDragOver(e));
      this.fileLabel.addEventListener('dragleave', (e) => this.handleDragLeave(e));
      this.fileLabel.addEventListener('drop', (e) => this.handleDrop(e));
      this.fileLabel.addEventListener('click', () => this.fileInput.click());
    }

    handleDragOver(e) {
      e.preventDefault();
      e.stopPropagation();
      this.fileLabel.classList.add('drag-active');
    }

    handleDragLeave(e) {
      e.preventDefault();
      e.stopPropagation();
      this.fileLabel.classList.remove('drag-active');
    }

    handleDrop(e) {
      e.preventDefault();
      e.stopPropagation();
      this.fileLabel.classList.remove('drag-active');

      const files = e.dataTransfer.files;
      this.processFiles(files);
    }

    handleFileSelect(e) {
      const files = e.target.files;
      this.processFiles(files);
    }

    processFiles(fileList) {
      const newFiles = Array.from(fileList).filter(file => {
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} nu este o imagine validă`);
          return false;
        }
        if (file.size > this.maxSize) {
          alert(`${file.name} este prea mare (max 5MB)`);
          return false;
        }
        return true;
      });

      if (this.files.length + newFiles.length > this.maxFiles) {
        alert(`Poți adăuga maxim ${this.maxFiles} imagini`);
        return;
      }

      this.files.push(...newFiles);
      this.updatePreview();
      this.updateFileInput();
    }

    updatePreview() {
      this.previewList.innerHTML = '';

      this.files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const item = document.createElement('div');
          item.className = 'file-preview-item';

          const img = document.createElement('img');
          img.src = e.target.result;
          img.alt = file.name;

          const removeBtn = document.createElement('button');
          removeBtn.className = 'file-preview-remove';
          removeBtn.type = 'button';
          removeBtn.setAttribute('aria-label', `Șterge ${file.name}`);
          removeBtn.innerHTML = '<i class="fas fa-times"></i>';
          removeBtn.addEventListener('click', (evt) => {
            evt.preventDefault();
            evt.stopPropagation();
            this.removeFile(index);
          });

          item.appendChild(img);
          item.appendChild(removeBtn);
          this.previewList.appendChild(item);
        };
        reader.readAsDataURL(file);
      });
    }

    removeFile(index) {
      this.files.splice(index, 1);
      this.updatePreview();
      this.updateFileInput();
    }

    updateFileInput() {
      const dataTransfer = new DataTransfer();
      this.files.forEach(file => dataTransfer.items.add(file));
      this.fileInput.files = dataTransfer.files;
    }

    getFiles() {
      return this.files;
    }
  }

  /* =========================================================
     FORM SUBMISSION WITH FILE UPLOAD
  ========================================================= */
  class ContactFormWithFiles {
    constructor() {
      this.form = document.getElementById('contactForm');
      this.fileHandler = new ContactPageFileHandler();

      if (this.form) {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
      }
    }

    async handleSubmit(e) {
      e.preventDefault();

      const formData = new FormData(this.form);
      const submitBtn = this.form.querySelector('.form-submit-btn');
      const toast = document.getElementById('successToast');

      const files = this.fileHandler.getFiles();
      files.forEach(file => {
        formData.append('inspiration_photos', file);
      });

      try {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        const supabaseUrl = import.meta?.env?.VITE_SUPABASE_URL || 'https://lxxxqwacwkmawkryxxzd.supabase.co';
        const anonKey = import.meta?.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4eHhxd2Fjd2ttYXdrcnl4eHpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzgzMDgsImV4cCI6MjA4OTkxNDMwOH0.iGK01G9U3HjFPZaG_MMcIB9-mld5Ri5IRRbSRB8EpmY';

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
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        submitBtn.classList.remove('loading');
        submitBtn.classList.add('success');
        submitBtn.querySelector('.btn-text--desktop').textContent = 'Trimis ✓';
        submitBtn.querySelector('.btn-text--mobile').textContent = 'Trimis ✓';

        if (toast) {
          toast.removeAttribute('hidden');
          setTimeout(() => {
            toast.classList.add('form-toast--show');
          }, 10);
        }

        setTimeout(() => {
          this.form.reset();
          this.fileHandler.files = [];
          this.fileHandler.updatePreview();
          this.fileHandler.updateFileInput();
          submitBtn.classList.remove('success');
          submitBtn.querySelector('.btn-text--desktop').textContent = 'Trimite mesajul';
          submitBtn.querySelector('.btn-text--mobile').textContent = 'Trimite';
          submitBtn.disabled = false;

          if (toast) {
            toast.classList.remove('form-toast--show');
            setTimeout(() => {
              toast.setAttribute('hidden', '');
            }, 300);
          }
        }, 3000);

      } catch (error) {
        console.error('Form submission error:', error);
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;

        if (toast) {
          toast.classList.add('error');
          const textElement = toast.querySelector('.form-toast__text');
          if (textElement) {
            textElement.textContent = 'A apărut o eroare. Te rugăm să încerci din nou.';
          }
          toast.removeAttribute('hidden');
          setTimeout(() => {
            toast.classList.add('form-toast--show');
          }, 10);
        }
      }
    }
  }

  /* =========================================================
     INITIALIZE
  ========================================================= */
  function initialize() {
    new ContactFormWithFiles();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

})();
