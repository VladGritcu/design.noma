import { useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import SectionHeader from '../components/SectionHeader';
import LuxuryDivider from '../components/LuxuryDivider';
import './Despre.css';

const Despre = () => {
  const { t } = useLanguage();
  const titleLines = t.about.sectionTitle.split('\n');

  // IntersectionObserver for Staggered Reveal Animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            // Drop observer after showing so it stays visible
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.noma-reveal, .blur-reveal, .despre-image');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="despre">
      <section className="despre-hero">
        <div className="container">
          <SectionHeader 
            title={t.about.pageTitle}
            subtitle={t.about.pageSubtitle}
          />
        </div>
      </section>

      <LuxuryDivider />

      <section className="despre-content">
        <div className="despre-container">
          <div className="despre-text">
            <h2 className="noma-reveal" style={{ '--delay': '0.1s' } as React.CSSProperties}>
              {titleLines.map((line, i) => (
                <span key={i}>{line}{i < titleLines.length - 1 && <br />}</span>
              ))}
            </h2>
            <p className="noma-reveal" style={{ '--delay': '0.2s' } as React.CSSProperties}>
              {t.about.text1}
            </p>
            <p className="noma-reveal" style={{ '--delay': '0.3s' } as React.CSSProperties}>
              {t.about.text2}
            </p>
            <p className="noma-reveal" style={{ '--delay': '0.4s' } as React.CSSProperties}>
              {t.about.text3}
            </p>
          </div>

          <div className="despre-image noma-reveal" style={{ '--delay': '0.4s' } as React.CSSProperties}>
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=1000&fit=crop"
              alt="Echipa NOMA Studio Design"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <LuxuryDivider />

      <section className="values-section">
        <SectionHeader 
          title={t.about.valuesTitle}
        />

        <div className="values-grid">
          <div className="value-card noma-reveal" style={{ '--delay': '0.1s' } as React.CSSProperties}>
            <div className="value-icon">
              <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h3>{t.about.excellence}</h3>
            <p>{t.about.excellenceDesc}</p>
          </div>

          <div className="value-card noma-reveal" style={{ '--delay': '0.2s' } as React.CSSProperties}>
            <div className="value-icon">
              <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h3>{t.about.punctuality}</h3>
            <p>{t.about.punctualityDesc}</p>
          </div>

          <div className="value-card noma-reveal" style={{ '--delay': '0.3s' } as React.CSSProperties}>
            <div className="value-icon">
              <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
                <polyline points="7.5 19.79 7.5 14.6 3 12" />
                <polyline points="21 12 16.5 14.6 16.5 19.79" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <h3>{t.about.innovation}</h3>
            <p>{t.about.innovationDesc}</p>
          </div>

          <div className="value-card noma-reveal" style={{ '--delay': '0.4s' } as React.CSSProperties}>
            <div className="value-icon">
              <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h3>{t.about.personalization}</h3>
            <p>{t.about.personalizationDesc}</p>
          </div>
        </div>
      </section>

      <LuxuryDivider />

      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item noma-reveal" style={{ '--delay': '0.1s' } as React.CSSProperties}>
            <div className="stat-number">200+</div>
            <div className="stat-label">{t.about.statsProjects}</div>
          </div>
          <div className="stat-item noma-reveal" style={{ '--delay': '0.2s' } as React.CSSProperties}>
            <div className="stat-number">10+</div>
            <div className="stat-label">{t.about.statsExperience}</div>
          </div>
          <div className="stat-item noma-reveal" style={{ '--delay': '0.3s' } as React.CSSProperties}>
            <div className="stat-number">95%</div>
            <div className="stat-label">{t.about.statsClients}</div>
          </div>
          <div className="stat-item noma-reveal" style={{ '--delay': '0.4s' } as React.CSSProperties}>
            <div className="stat-number">15</div>
            <div className="stat-label">{t.about.statsAwards}</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Despre;
