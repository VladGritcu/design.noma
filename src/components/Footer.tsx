import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import './Footer.css';

const Footer = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const { t } = useLanguage();

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  useEffect(() => {
    const sections = document.querySelectorAll('[data-footer-accordion]');
    sections.forEach((section) => {
      const button = section.querySelector('.footer-toggle');
      const content = section.querySelector('.footer-links');

      if (button && content) {
        button.addEventListener('click', () => {
          const isOpen = section.classList.contains('is-open');
          section.classList.toggle('is-open');

          if (!isOpen) {
            (content as HTMLElement).style.height = 'auto';
            const height = (content as HTMLElement).scrollHeight;
            (content as HTMLElement).style.height = '0';
            setTimeout(() => {
              (content as HTMLElement).style.height = `${height}px`;
            }, 10);
          } else {
            (content as HTMLElement).style.height = '0';
          }
        });
      }
    });
  }, []);

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-contact">
          <h2 className="footer-contact-title">{t.footer.contactTitle}</h2>
          <p className="footer-contact-desc">
            {t.footer.contactDesc}{' '}
            <a href="/contact">{t.footer.contactDescLink1}</a> {t.footer.contactDesc.includes('sau') ? '' : ''}{' '}
            <a href="/contact">{t.footer.contactDescLink2}</a>
          </p>

          <div className="contact-items">
            <a href="tel:+37362167165" className="contact-item">
              <div className="contact-icon">
                <i className="fa-solid fa-phone" aria-hidden="true"></i>
              </div>
              <span className="contact-value">+373 62 167 165</span>
            </a>

            <a href="mailto:hello@noma.studio" className="contact-item">
              <div className="contact-icon">
                <i className="fa-solid fa-envelope" aria-hidden="true"></i>
              </div>
              <span className="contact-value">hello@noma.studio</span>
            </a>

            <a
              href="https://maps.google.com/?q=Chisinau,Moldova"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-item"
            >
              <div className="contact-icon">
                <i className="fa-solid fa-map-marker-alt" aria-hidden="true"></i>
              </div>
              <span className="contact-value">{t.overlay.location}</span>
            </a>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-links-grid">
          <section className={`footer-section ${openSection === 'company' ? 'is-open' : ''}`} data-footer-accordion>
            <button
              className="footer-toggle"
              onClick={() => toggleSection('company')}
              aria-expanded={openSection === 'company'}
              aria-controls="footer-company"
              type="button"
            >
              <span>{t.footer.company}</span>
              <span className="footer-toggle-icon" aria-hidden="true">&#9662;</span>
            </button>
            <ul id="footer-company" className="footer-links">
              <li><a href="/">{t.footer.home}</a></li>
              <li><a href="/despre">{t.footer.about}</a></li>
              <li><a href="/servicii">{t.footer.services}</a></li>
              <li><a href="/portofoliu">{t.footer.projects}</a></li>
              <li><a href="/contact">{t.footer.contact}</a></li>
              <li><a href="/privacy">{t.footer.privacy}</a></li>
              <li><a href="/terms">{t.footer.terms}</a></li>
            </ul>
          </section>

          <section className={`footer-section ${openSection === 'resources' ? 'is-open' : ''}`} data-footer-accordion>
            <button
              className="footer-toggle"
              onClick={() => toggleSection('resources')}
              aria-expanded={openSection === 'resources'}
              aria-controls="footer-resources"
              type="button"
            >
              <span>{t.footer.resources}</span>
              <span className="footer-toggle-icon" aria-hidden="true">&#9662;</span>
            </button>
            <ul id="footer-resources" className="footer-links">
              <li><a href="/blog">{t.footer.blogDesign}</a></li>
              <li><a href="/cursuri">{t.footer.designCourses}</a></li>
              <li><a href="/portofoliu">{t.footer.fullDesign}</a></li>
              <li><a href="/servicii">{t.footer.renders3d}</a></li>
              <li><a href="/contact">{t.footer.consultancy}</a></li>
              <li><a href="/sitemap.xml">{t.footer.sitemapXml}</a></li>
            </ul>
          </section>
        </div>

        <div className="footer-social">
          <a href="https://www.instagram.com/noma.studio.design/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <i className="fa-brands fa-instagram" aria-hidden="true"></i>
          </a>
          <a href="https://www.facebook.com/mihaela.borta.2025" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <i className="fa-brands fa-facebook-f" aria-hidden="true"></i>
          </a>
          <a href="https://www.tiktok.com/@mihaelaborta10" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <i className="fa-brands fa-tiktok" aria-hidden="true"></i>
          </a>
        </div>

        <p className="footer-copy">&copy; 2026 NOMA Studio Design</p>
      </div>
    </footer>
  );
};

export default Footer;
