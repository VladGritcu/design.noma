import { useState, FormEvent } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import './Contact.css';

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const submitBtn = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitBtn) submitBtn.blur();
    setShowToast(true);
    setFormData({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'message' && value.length > 1000) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const titleLines = t.contact.pageTitle.split('\n');
  const visitLines = t.contact.visitAddress.split('\n');
  const callLines = t.contact.callInfo.split('\n');
  const writeLines = t.contact.writeInfo.split('\n');

  return (
    <div className="contact">
      <section className="contact-hero">
        <div className="container">
          <h1 className="page-title">
            {titleLines.map((line, i) => (
              <span key={i}>{line}{i < titleLines.length - 1 && <br />}</span>
            ))}
          </h1>
        </div>
      </section>

      <section className="contact-form-section fade-in">
        <div className="container">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">{t.contact.nameLabel}</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder={t.contact.namePlaceholder} />
              </div>
              <div className="form-group">
                <label htmlFor="email">{t.contact.emailLabel}</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder={t.contact.emailPlaceholder} />
              </div>
              <div className="form-group">
                <label htmlFor="phone">{t.contact.phoneLabel}</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required placeholder={t.contact.phonePlaceholder} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">{t.contact.messageLabel}</label>
              <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={6} placeholder={t.contact.messagePlaceholder} />
            </div>

            <div className="form-actions-row">
              <button type="submit" className="submit-btn">
                <span className="btn-text-desktop">{t.contact.submitDesktop}</span>
                <span className="btn-text-mobile">{t.contact.submitMobile}</span>
              </button>
              {showToast && (
                <div className="toast-message">{t.contact.successMessage}</div>
              )}
            </div>
          </form>

          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3>{t.contact.visitUs}</h3>
              <p>{visitLines.map((line, i) => (<span key={i}>{line}{i < visitLines.length - 1 && <br />}</span>))}</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <h3>{t.contact.callUs}</h3>
              <p>{callLines.map((line, i) => (<span key={i}>{line}{i < callLines.length - 1 && <br />}</span>))}</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <h3>{t.contact.writeUs}</h3>
              <p>{writeLines.map((line, i) => (<span key={i}>{line}{i < writeLines.length - 1 && <br />}</span>))}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
