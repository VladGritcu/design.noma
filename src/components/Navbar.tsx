import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import type { Language } from '../i18n/types';
import './Navbar.css';

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'ro', label: 'Romana' },
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.setAttribute('data-menu-open', 'true');
    } else {
      document.body.removeAttribute('data-menu-open');
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLangSelect = (lang: Language) => {
    setLanguage(lang);
    setLangOpen(false);
  };

  return (
    <>
      <header className={`noma-header ${isScrolled ? 'scrolled' : ''} ${isMobileMenuOpen ? 'nav-open' : ''}`}>
        <nav className="noma-nav-shell">
          <div className="nav-container">
            <div className="nav-brand">
              <Link
                to="/"
                onClick={(e) => {
                  if (window.location.pathname === '/') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
              >
                <span className="brand-name">NOMA</span>
              </Link>
            </div>

            <div className="nav-center-right">
              <ul className="nav-links-desktop">
                <li><Link to="/">{t.nav.home}</Link></li>
                <li><Link to="/despre">{t.nav.about}</Link></li>
                <li><Link to="/servicii">{t.nav.services}</Link></li>
                <li><Link to="/portofoliu">{t.nav.portfolio}</Link></li>
                <li><Link to="/cursuri">{t.nav.courses}</Link></li>
                <li><Link to="/contact">{t.nav.contact}</Link></li>
              </ul>

              <div className="lang-switcher" ref={langRef}>
                <button
                  className="lang-toggle"
                  type="button"
                  onClick={() => setLangOpen(!langOpen)}
                  aria-label="Select language"
                >
                  <span className="lang-code">{language.toUpperCase()}</span>
                  <svg className={`lang-chevron ${langOpen ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {langOpen && (
                  <div className="lang-dropdown">
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        className={`lang-option ${language === l.code ? 'active' : ''}`}
                        type="button"
                        onClick={() => handleLangSelect(l.code)}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              className="burger-btn"
              type="button"
              aria-label="Menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="burger-line"></span>
              <span className="burger-line"></span>
              <span className="burger-line"></span>
            </button>
          </div>
        </nav>
      </header>

      <div className={`nav-overlay ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="nav-overlay-inner">
          <header className="overlay-header">
            <span className="overlay-brand">{t.overlay.brandSubtitle}</span>
            <span className="overlay-location">{t.overlay.location}</span>
          </header>

          <nav className="overlay-nav">
            <Link to="/" className="nav-link" style={{ '--i': 1 } as React.CSSProperties}>
              <span className="nav-link-inner">{t.nav.home}</span>
            </Link>
            <Link to="/despre" className="nav-link" style={{ '--i': 2 } as React.CSSProperties}>
              <span className="nav-link-inner">{t.nav.about}</span>
            </Link>
            <Link to="/servicii" className="nav-link" style={{ '--i': 3 } as React.CSSProperties}>
              <span className="nav-link-inner">{t.nav.services}</span>
            </Link>
            <Link to="/portofoliu" className="nav-link" style={{ '--i': 4 } as React.CSSProperties}>
              <span className="nav-link-inner">{t.nav.portfolio}</span>
            </Link>
            <Link to="/cursuri" className="nav-link" style={{ '--i': 5 } as React.CSSProperties}>
              <span className="nav-link-inner">{t.nav.courses}</span>
            </Link>
            <Link to="/contact" className="nav-link" style={{ '--i': 6 } as React.CSSProperties}>
              <span className="nav-link-inner">{t.nav.contact}</span>
            </Link>
          </nav>

          <div className="overlay-lang-switcher">
            {LANGUAGES.map((l, i) => (
              <span key={l.code} style={{ display: 'contents' }}>
                {i > 0 && <span className="overlay-lang-sep">|</span>}
                <button
                  className={`overlay-lang-btn ${language === l.code ? 'active' : ''}`}
                  type="button"
                  onClick={() => setLanguage(l.code)}
                >
                  {l.code.toUpperCase()}
                </button>
              </span>
            ))}
          </div>

          <div className="overlay-cta">
            <p>{t.overlay.ctaText}</p>
            <Link to="/contact" className="overlay-cta-btn">
              {t.overlay.ctaButton}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
