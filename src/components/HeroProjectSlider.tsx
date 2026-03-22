import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { Project } from '../data/projects';
import './HeroProjectSlider.css';

interface HeroProjectSliderProps {
  projects: Project[];
}

const HeroProjectSlider = ({ projects }: HeroProjectSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % projects.length);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 800);
    }, 5000);

    return () => clearInterval(interval);
  }, [projects.length]);

  const currentProject = projects[currentIndex];

  return (
    <section className="hero-project-slider" aria-label="Proiecte de design featured">
      <div className="hero-slider-container">
        <div className={`hero-project-slide ${isTransitioning ? 'transitioning' : ''}`}>
          <Link
            to={`/portofoliu#project-${currentProject.id}`}
            className="hero-project-image-link"
            aria-label={`${t.hero.viewProject} ${currentProject.name}`}
          >
            <figure className="hero-project-image-wrapper">
              <img
                src={currentProject.images[0]}
                alt={`${currentProject.name} - ${currentProject.location} - Design lux NOMA Studio`}
                className="hero-project-image"
                loading="eager"
                fetchPriority="high"
                width="1600"
                height="680"
              />
            </figure>
          </Link>

          <article className="hero-project-content">
            <h1 className="hero-project-title">{currentProject.name}</h1>

            <p className="hero-project-description">{currentProject.description}</p>

            <div className="hero-project-meta" itemScope itemType="https://schema.org/Place">
              <span itemProp="address">{currentProject.location}</span>
              <span className="separator" aria-hidden="true">•</span>
              <time dateTime={currentProject.year} itemProp="datePublished">{currentProject.year}</time>
            </div>

            <Link
              to={`/portofoliu#project-${currentProject.id}`}
              className="hero-project-cta"
            >
              <span>{t.hero.viewProject}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </article>
        </div>

        <nav className="hero-project-progress" aria-label="Navigare proiecte">
          <div className="progress-bar-container" role="list">
            {projects.map((project, index) => (
              <div
                key={index}
                className={`progress-segment ${index === currentIndex ? 'active' : ''} ${index < currentIndex ? 'completed' : ''}`}
                role="listitem"
                aria-label={`${index + 1} / ${projects.length}: ${project.name}`}
                aria-current={index === currentIndex ? 'true' : 'false'}
              >
                <div className="progress-fill" />
              </div>
            ))}
          </div>
        </nav>
      </div>
    </section>
  );
};

export default HeroProjectSlider;
