(function() {
  'use strict';

  /* =========================================================
     SCROLL LOCK MANAGER
  ========================================================= */
  const ScrollLockManager = {
    lock() {
      const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPos}px`;
      document.body.style.width = '100%';
      document.body.dataset.scrollPos = scrollPos;
    },

    unlock() {
      const scrollPos = parseInt(document.body.dataset.scrollPos || '0', 10);
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      delete document.body.dataset.scrollPos;
      window.scrollTo(0, scrollPos);
    }
  };

  /* =========================================================
     NAVIGATION MENU
  ========================================================= */
  class NavigationMenu {
    constructor() {
      this.header = document.querySelector('.noma-header');
      this.burgerBtn = document.getElementById('burger-btn');
      this.closeBtn = document.getElementById('overlay-close-btn');
      this.overlay = document.getElementById('nav-overlay');
      this.innerPanel = this.overlay?.querySelector('.nav-overlay-inner');
      this.navLinks = this.overlay?.querySelectorAll('.overlay-nav .nav-link');
      this.isOpen = false;
      this.scrollThrottle = null;

      this.init();
    }

    init() {
      if (!this.burgerBtn || !this.overlay) return;

      // Scroll shrink header
      window.addEventListener('scroll', () => {
        if (this.scrollThrottle) return;
        this.scrollThrottle = setTimeout(() => {
          this.scrollThrottle = null;
          if (window.scrollY > 50) {
            this.header?.classList.add('scrolled');
          } else {
            this.header?.classList.remove('scrolled');
          }
        }, 100);
      });

      // Burger button click
      this.burgerBtn.addEventListener('click', () => {
        if (this.isOpen) {
          this.close();
        } else {
          this.open();
        }
      });

      // Close button click
      this.closeBtn?.addEventListener('click', () => {
        this.close();
      });

      // Nav link clicks
      this.navLinks?.forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (href && href.startsWith('#')) {
            e.preventDefault();
            this.close();
            setTimeout(() => {
              const target = document.querySelector(href);
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 220);
          }
        });
      });

      // Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });

      // Resize handler
      window.addEventListener('resize', () => {
        if (window.innerWidth > 992 && this.isOpen) {
          this.close();
        }
      });

      // Tab trap
      this.overlay.addEventListener('keydown', (e) => {
        if (!this.isOpen) return;
        if (e.key !== 'Tab') return;

        const focusableElements = this.overlay.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      });
    }

    open() {
      this.isOpen = true;
      this.header?.classList.add('nav-open');
      this.burgerBtn?.setAttribute('aria-expanded', 'true');
      ScrollLockManager.lock();

      // Reset burger state
      this.burgerBtn?.blur();
      void this.burgerBtn?.offsetHeight;

      // Activate overlay
      requestAnimationFrame(() => {
        this.overlay?.classList.add('active');
        requestAnimationFrame(() => {
          this.innerPanel?.focus();
          const firstLink = this.navLinks?.[0];
          if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
          }
        });
      });

      this.retriggerCascade();
    }

    close() {
      this.isOpen = false;
      this.header?.classList.remove('nav-open');
      this.burgerBtn?.setAttribute('aria-expanded', 'false');
      this.overlay?.classList.remove('active');
      ScrollLockManager.unlock();
      this.burgerBtn?.focus();
    }

    retriggerCascade() {
      this.overlay?.classList.remove('noma-cascade-ready');
      void this.overlay?.offsetHeight;
      this.overlay?.classList.add('noma-cascade-ready');
    }
  }

  /* =========================================================
     BACK TO TOP BUTTON
  ========================================================= */
  class BackToTopButton {
    constructor() {
      this.btn = document.getElementById('backToTopBtn');
      this.init();
    }

    init() {
      if (!this.btn) return;

      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          this.btn.classList.add('is-visible');
        } else {
          this.btn.classList.remove('is-visible');
        }
      });

      this.btn.addEventListener('click', () => {
        this.triggerRipple();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      this.btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.btn.click();
        }
      });
    }

    triggerRipple() {
      this.btn.classList.add('ripple-active');
      void this.btn.offsetWidth;
      setTimeout(() => this.btn.classList.remove('ripple-active'), 600);
    }
  }

  /* =========================================================
     CONTACT WIDGET
  ========================================================= */
  class ContactWidget {
    constructor() {
      this.widget = document.getElementById('noma-contact-widget');
      this.toggleBtn = document.getElementById('noma-contact-toggle');
      this.icon = document.getElementById('noma-toggle-icon');
      this.menu = document.getElementById('noma-contact-menu');
      this.circles = this.menu?.querySelectorAll('.noma-menu-circle');
      this.isOpen = false;
      this.attentionTriggered = false;

      this.init();
    }

    init() {
      if (!this.widget || !this.toggleBtn || !this.menu) return;

      // Toggle click
      this.toggleBtn.addEventListener('click', () => {
        if (this.isOpen) {
          this.close();
        } else {
          this.open();
        }
      }, { once: false });

      // Stop attention animation on first click
      this.toggleBtn.addEventListener('click', () => {
        this.attentionTriggered = true;
      }, { once: true });

      // Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });

      // Outside click
      document.addEventListener('click', (e) => {
        if (this.isOpen && !this.widget.contains(e.target)) {
          this.close();
        }
      });

      // Attention animation after 4s
      setTimeout(() => {
        if (!this.attentionTriggered) {
          this.triggerAttention();
          // Repeat every 8s
          const interval = setInterval(() => {
            if (this.attentionTriggered) {
              clearInterval(interval);
            } else {
              this.triggerAttention();
            }
          }, 8000);
        }
      }, 4000);
    }

    open() {
      this.isOpen = true;
      this.widget.classList.add('noma-open');
      this.toggleBtn.setAttribute('aria-expanded', 'true');
      this.menu.removeAttribute('hidden');

      // Icon change
      this.icon.classList.remove('fa-comments');
      this.icon.classList.add('fa-xmark', 'noma-x-rotate');

      // Burst animation
      this.toggleBtn.classList.add('noma-click-burst');
      void this.toggleBtn.offsetWidth;

      // Cascade animation
      this.circles?.forEach((circle, index) => {
        circle.style.setProperty('--noma-delay', `${index * 70}ms`);
        requestAnimationFrame(() => {
          circle.classList.add('noma-pop-in');
        });
      });
    }

    close() {
      this.isOpen = false;
      this.widget.classList.remove('noma-open');
      this.toggleBtn.setAttribute('aria-expanded', 'false');
      this.menu.setAttribute('hidden', '');

      // Icon change
      this.icon.classList.remove('fa-xmark', 'noma-x-rotate');
      this.icon.classList.add('fa-comments');

      // Remove animations
      this.circles?.forEach(circle => {
        circle.classList.remove('noma-pop-in');
      });
    }

    triggerAttention() {
      this.toggleBtn.classList.add('noma-attention');
      this.toggleBtn.addEventListener('animationend', () => {
        this.toggleBtn.classList.remove('noma-attention');
      }, { once: true });
    }
  }

  /* =========================================================
     SMOOTH SCROLL MANAGER
  ========================================================= */
  class SmoothScrollManager {
    constructor() {
      this.init();
    }

    init() {
      // Handle anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const href = anchor.getAttribute('href');
          if (!href || href === '#') return;

          const target = document.querySelector(href);
          if (!target) return;

          e.preventDefault();

          // Update URL
          history.pushState(null, '', href);

          // Scroll with offset
          const header = document.querySelector('.noma-header');
          const headerHeight = header ? Math.min(Math.max(header.getBoundingClientRect().height, 56), 120) : 80;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        });
      });

      // Handle hash on page load
      if (window.location.hash) {
        setTimeout(() => {
          const target = document.querySelector(window.location.hash);
          if (target) {
            const header = document.querySelector('.noma-header');
            const headerHeight = header ? Math.min(Math.max(header.getBoundingClientRect().height, 56), 120) : 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
          }
        }, 100);
      }
    }
  }

  /* =========================================================
     PERFORMANCE MONITOR
  ========================================================= */
  class PerformanceMonitor {
    constructor() {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('debug') === 'performance') {
        this.log();
      }
    }

    log() {
      if (!window.performance) return;

      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      const connectTime = perfData.responseEnd - perfData.requestStart;
      const renderTime = perfData.domComplete - perfData.domLoading;
      const domReady = perfData.domContentLoadedEventEnd - perfData.navigationStart;

      console.table({
        'Page Load': `${pageLoadTime}ms`,
        'Connect': `${connectTime}ms`,
        'Render': `${renderTime}ms`,
        'DOMContentLoaded': `${domReady}ms`
      });
    }
  }

  /* =========================================================
     DETECT TOUCH DEVICE
  ========================================================= */
  function detectTouchDevice() {
    const isTouch = ('ontouchstart' in window) ||
                    (navigator.maxTouchPoints > 0) ||
                    (navigator.msMaxTouchPoints > 0);

    if (isTouch) {
      document.body.classList.add('is-touch-device');
    }
  }

  /* =========================================================
     INITIALIZE APP
  ========================================================= */
  function initializeApp() {
    detectTouchDevice();
    new NavigationMenu();
    new BackToTopButton();
    new ContactWidget();
    new SmoothScrollManager();
    new PerformanceMonitor();
  }

  // Run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }

})();
