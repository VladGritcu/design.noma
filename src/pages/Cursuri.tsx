import { useLanguage } from '../i18n/LanguageContext';
import SectionHeader from '../components/SectionHeader';
import LuxuryDivider from '../components/LuxuryDivider';
import './Cursuri.css';

const Cursuri = () => {
  const { t } = useLanguage();

  return (
    <div className="cursuri-page">
      <div className="cursuri-container">
        <SectionHeader 
          title={t.courses.pageTitle}
          centered={true}
        />

        <div className="cursuri-list">
          <div className="curs-card">
            <h2>{t.courses.course1Title}</h2>
            <p className="curs-meta">{t.courses.course1Meta}</p>
            <p>{t.courses.course1Desc}</p>
          </div>

          <div className="curs-card">
            <h2>{t.courses.course2Title}</h2>
            <p className="curs-meta">{t.courses.course2Meta}</p>
            <p>{t.courses.course2Desc}</p>
          </div>

          <div className="curs-card">
            <h2>{t.courses.course3Title}</h2>
            <p className="curs-meta">{t.courses.course3Meta}</p>
            <p>{t.courses.course3Desc}</p>
          </div>
        </div>

        <LuxuryDivider delay={0.1} />

        <div className="curs-cta">
          <p>{t.courses.ctaText}</p>
          <a href="/contact" className="curs-btn">{t.courses.ctaButton}</a>
        </div>
      </div>
    </div>
  );
};

export default Cursuri;
