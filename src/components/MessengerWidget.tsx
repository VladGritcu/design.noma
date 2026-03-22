import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import './MessengerWidget.css';

const MessengerWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  const { t } = useLanguage();

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setHasClicked(true);
  };

  useEffect(() => {
    if (isOpen) {
      const circles = document.querySelectorAll('.noma-menu-circle');
      circles.forEach((circle, index) => {
        const element = circle as HTMLElement;
        element.style.setProperty('--noma-delay', `${index * 50}ms`);
        element.classList.add('noma-pop-in');
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasClicked) {
        const button = document.getElementById('noma-contact-toggle');
        button?.classList.add('noma-attention');
        setTimeout(() => {
          button?.classList.remove('noma-attention');
        }, 1500);
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [hasClicked]);

  return (
    <div className={`noma-contact-widget ${isOpen ? 'noma-open' : ''}`} id="noma-contact-widget" role="complementary" aria-label="Widget contact rapid NOMA Studio Design">
      <button
        className="noma-contact-toggle"
        id="noma-contact-toggle"
        type="button"
        aria-label={t.messenger.toggleLabel}
        aria-controls="noma-contact-menu"
        aria-expanded={isOpen}
        onClick={handleToggle}
      >
        <i className={`fa-solid ${isOpen ? 'fa-xmark noma-x-rotate' : 'fa-comments'}`} id="noma-toggle-icon" aria-hidden="true"></i>
        {!isOpen && <span className="noma-pulse-ring" aria-hidden="true"></span>}
      </button>

      <nav
        className="noma-contact-menu"
        id="noma-contact-menu"
        role="menu"
        aria-label="Contact"
        hidden={!isOpen}
      >
        <a href="tel:+37362167165" className="noma-menu-circle noma-phone" role="menuitem" aria-label={t.messenger.callLabel} rel="nofollow">
          <i className="fa-solid fa-phone" aria-hidden="true"></i>
        </a>
        <a href="https://wa.me/37362167165" className="noma-menu-circle noma-whatsapp" role="menuitem" target="_blank" rel="noopener noreferrer nofollow" aria-label={t.messenger.whatsappLabel}>
          <i className="fab fa-whatsapp" aria-hidden="true"></i>
        </a>
        <a href="viber://chat?number=%2B37362167165" className="noma-menu-circle noma-viber" role="menuitem" aria-label={t.messenger.viberLabel} rel="nofollow">
          <i className="fab fa-viber" aria-hidden="true"></i>
        </a>
        <a href="https://t.me/+37362167165" className="noma-menu-circle noma-telegram" role="menuitem" target="_blank" rel="noopener noreferrer nofollow" aria-label={t.messenger.telegramLabel}>
          <i className="fab fa-telegram-plane" aria-hidden="true"></i>
        </a>
      </nav>
    </div>
  );
};

export default MessengerWidget;
