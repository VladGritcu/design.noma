import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import './MessengerWidget.css';

/* ─────────────────────────────────────────────── */
/*  Types                                          */
/* ─────────────────────────────────────────────── */
interface Channel {
  key: 'phone' | 'whatsapp' | 'viber' | 'telegram';
  href: string;
  icon: string;
  labelKey: keyof ReturnType<typeof useLanguage>['t']['messenger'];
  rel: string;
  target?: string;
  tooltip: string;
}

const CHANNELS: Channel[] = [
  {
    key: 'phone',
    href: 'tel:+37362167165',
    icon: 'fa-solid fa-phone',
    labelKey: 'callLabel',
    rel: 'nofollow',
    tooltip: 'Telefon',
  },
  {
    key: 'whatsapp',
    href: 'https://wa.me/37362167165',
    icon: 'fab fa-whatsapp',
    labelKey: 'whatsappLabel',
    rel: 'noopener noreferrer nofollow',
    target: '_blank',
    tooltip: 'WhatsApp',
  },
  {
    key: 'viber',
    href: 'viber://chat?number=%2B37362167165',
    icon: 'fab fa-viber',
    labelKey: 'viberLabel',
    rel: 'nofollow',
    tooltip: 'Viber',
  },
  {
    key: 'telegram',
    href: 'https://t.me/+37362167165',
    icon: 'fab fa-telegram-plane',
    labelKey: 'telegramLabel',
    rel: 'noopener noreferrer nofollow',
    target: '_blank',
    tooltip: 'Telegram',
  },
];

/* ─────────────────────────────────────────────── */
/*  Component                                      */
/* ─────────────────────────────────────────────── */
const MessengerWidget = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  /* refs */
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef   = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const circleRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  /* attention timing */
  const attentionStoppedRef = useRef(false);
  const attentionTimerRef   = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const attentionIntervalRef= useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── touch-device detection (Android hover sticky fix) ── */
  useEffect(() => {
    const onTouch = () => {
      document.body.classList.add('is-touch');
    };
    document.addEventListener('touchstart', onTouch, { once: true, passive: true });
    return () => document.removeEventListener('touchstart', onTouch);
  }, []);

  /* ── attention animation ── */
  const triggerAttention = useCallback(() => {
    if (attentionStoppedRef.current) return;
    const btn = toggleRef.current;
    if (!btn) return;
    requestAnimationFrame(() => {
      btn.classList.remove('noma-attention');
      void btn.offsetWidth; // force reflow
      btn.classList.add('noma-attention');
    });
  }, []);

  const stopAttention = useCallback(() => {
    attentionStoppedRef.current = true;
    if (attentionTimerRef.current)    clearTimeout(attentionTimerRef.current);
    if (attentionIntervalRef.current) clearInterval(attentionIntervalRef.current);
  }, []);

  useEffect(() => {
    // reduce-motion: skip completely
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    attentionTimerRef.current = setTimeout(() => {
      triggerAttention();
      attentionIntervalRef.current = setInterval(triggerAttention, 8000);
    }, 4000);

    return () => {
      if (attentionTimerRef.current)    clearTimeout(attentionTimerRef.current);
      if (attentionIntervalRef.current) clearInterval(attentionIntervalRef.current);
    };
  }, [triggerAttention]);

  /* ── click outside ── */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler, { passive: true });
    document.addEventListener('touchstart', handler, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [isOpen]);

  /* ── Escape key ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
      /* Tab focus trap inside menu */
      if (e.key === 'Tab' && isOpen) {
        const items = circleRefs.current.filter(Boolean) as HTMLAnchorElement[];
        if (!items.length) return;
        const first = items[0];
        const last  = items[items.length - 1];
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
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen]);

  /* ── pop-in stagger when menu opens ── */
  useEffect(() => {
    if (!isOpen) return;
    circleRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.setProperty('--noma-delay', `${i * 70}ms`);
      el.classList.remove('noma-pop-in');
      void el.offsetWidth; // force reflow
      el.classList.add('noma-pop-in');
      el.removeAttribute('tabindex');

      const release = () => {
        el.style.willChange = 'auto';
        el.removeEventListener('animationend', release);
      };
      el.addEventListener('animationend', release);
    });
  }, [isOpen]);

  /* ── manage tabindex when closed ── */
  useEffect(() => {
    circleRefs.current.forEach((el) => {
      if (!el) return;
      if (isOpen) {
        el.removeAttribute('tabindex');
      } else {
        el.setAttribute('tabindex', '-1');
      }
    });
  }, [isOpen]);

  /* ── click burst helper ── */
  const fireBurst = useCallback(() => {
    const btn = toggleRef.current;
    if (!btn) return;
    btn.classList.remove('noma-click-burst');
    void btn.offsetWidth;
    btn.classList.add('noma-click-burst');
  }, []);

  /* ── toggle handler ── */
  const handleToggle = useCallback(() => {
    stopAttention();
    requestAnimationFrame(() => {
      setIsOpen(prev => !prev);
      fireBurst();
    });
  }, [stopAttention, fireBurst]);

  /* ─────────────────── RENDER ─────────────────── */
  return (
    <div
      ref={widgetRef}
      className={`noma-contact-widget${isOpen ? ' noma-open' : ''}`}
      id="noma-contact-widget"
      role="complementary"
      aria-label="Widget contact rapid NOMA Studio Design"
    >
      {/* ── Toggle button ── */}
      <button
        ref={toggleRef}
        className="noma-contact-toggle"
        id="noma-contact-toggle"
        type="button"
        aria-label={t.messenger.toggleLabel}
        aria-controls="noma-contact-menu"
        aria-expanded={isOpen}
        onClick={handleToggle}
      >
        <i
          className={`fa-solid ${isOpen ? 'fa-xmark noma-x-rotate' : 'fa-comments'}`}
          id="noma-toggle-icon"
          aria-hidden="true"
        />
        {/* Pulse ring — always mounted, hidden in open state via CSS */}
        <span className="noma-pulse-ring" aria-hidden="true" />
      </button>

      {/* ── Contact menu ── */}
      <div
        ref={menuRef}
        className="noma-contact-menu"
        id="noma-contact-menu"
        role="menu"
        aria-label="Contact"
        aria-hidden={!isOpen}
      >
        {CHANNELS.map((ch, i) => (
          <a
            key={ch.key}
            ref={el => { circleRefs.current[i] = el; }}
            href={ch.href}
            className={`noma-menu-circle noma-${ch.key}`}
            role="menuitem"
            aria-label={t.messenger[ch.labelKey] as string}
            rel={ch.rel}
            target={ch.target}
            tabIndex={isOpen ? 0 : -1}
            data-tooltip={ch.tooltip}
          >
            <i className={ch.icon} aria-hidden="true" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default MessengerWidget;
