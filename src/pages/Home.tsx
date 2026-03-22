import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import HeroProjectSlider from '../components/HeroProjectSlider';
import { projects } from '../data/projects';
import './Home.css';

const Home = () => {
  const { t } = useLanguage();
  const aboutLines = t.home.aboutTitle.split('\n');

  return (
    <div className="home">
      <HeroProjectSlider projects={projects} />

      <section className="services-preview fade-in">
        <div className="container">
          <div className="section-header">
            <h2>{t.home.whatWeOffer}</h2>
            <p className="section-subtitle">{t.home.servicesSubtitle}</p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18M9 21V9" />
                </svg>
              </div>
              <h3>{t.home.interiorDesign}</h3>
              <p>{t.home.interiorDesignDesc}</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <h3>{t.home.exteriorDesign}</h3>
              <p>{t.home.exteriorDesignDesc}</p>
            </div>
          </div>

          <div className="section-cta">
            <Link to="/servicii" className="cta-button">
              <span>{t.home.viewAllServices} &rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="about-preview fade-in">
        <div className="about-container">
          <div className="about-text">
            <h2>
              {aboutLines.map((line, i) => (
                <span key={i}>{line}{i < aboutLines.length - 1 && <br />}</span>
              ))}
            </h2>
            <p>{t.home.aboutText}</p>
            <Link to="/despre" className="about-link">
              {t.home.aboutLink} &rarr;
            </Link>
          </div>

          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=1000&fit=crop"
              alt="NOMA Studio Design workspace"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
