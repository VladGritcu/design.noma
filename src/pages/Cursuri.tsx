import { useLanguage } from '../i18n/LanguageContext';
import './Cursuri.css';

const Cursuri = () => {
  const { t } = useLanguage();

  return (
    <div className="cursuri-page">
      <div className="cursuri-container">
        <h1>{t.courses.pageTitle}</h1>
        <p className="cursuri-intro">{t.courses.intro}</p>

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

        <div className="curs-cta">
          <p>{t.courses.ctaText}</p>
          <a href="/contact" className="curs-btn">{t.courses.ctaButton}</a>
        </div>
      </div>
    </div>
  );
};

export default Cursuri;
