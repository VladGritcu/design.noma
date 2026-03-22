import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import ImageSlider from '../components/ImageSlider';
import { projects } from '../data/projects';
import './Portofoliu.css';

const Portofoliu = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#project-', '');
      const element = document.getElementById(`project-${id}`);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="portofoliu">
      <section className="portofoliu-hero">
        <div className="container">
          <h1 className="page-title">{t.portfolio.pageTitle}</h1>
          <p className="page-subtitle">{t.portfolio.pageSubtitle}</p>
        </div>
      </section>

      <section className="projects-section">
        <div className="container">
          <div className="projects-grid">
            {projects.map((project) => (
              <div
                key={project.id}
                id={`project-${project.id}`}
                className="project-card fade-in"
              >
                <div className="project-slider">
                  <ImageSlider images={project.images} />
                </div>

                <div className="project-info">
                  <span className="project-tag">{project.tag}</span>
                  <h3 className="project-name">{project.name}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-meta">
                    <span>{project.location}</span>
                    <span>•</span>
                    <span>{project.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portofoliu;
