import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import HeroProjectSlider from '../components/HeroProjectSlider';
import HomeContactForm from '../components/HomeContactForm';
import { projects } from '../data/projects';
import './Home.css';

const SITE_URL = 'https://nomastudio.md';

const fadeUp = (isMobile: boolean): Variants => ({
  hidden: { 
    opacity: 0, 
    y: isMobile ? 18 : 30, 
    filter: isMobile ? 'none' : 'blur(10px)' 
  },
  show: { 
    opacity: 1, 
    y: 0, 
    filter: isMobile ? 'none' : 'blur(0px)',
    transition: { duration: 0.8, ease: "easeOut" }
  }
});

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'NOMA Studio',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: ['Romanian', 'Russian'],
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'NOMA Studio',
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'ro-MD',
    },
  ],
};

const SectionDivider = () => (
  <div className="section-divider-luxury">
    <motion.div 
      className="divider-line-main"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    />
    <div className="divider-center">
      <div className="divider-dot" />
    </div>
  </div>
);

const Home = () => {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const aboutLines = t.home.aboutTitle.split('\n');

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const currentFadeUp = fadeUp(isMobile);

  const motionProps = shouldReduceMotion ? {} : {
    initial: "hidden",
    whileInView: "show",
    viewport: { once: true, margin: isMobile ? "-40px" : "-100px" },
    variants: currentFadeUp
  };

  return (
    <>
      <Helmet>
        <html lang="ro" />
        <title>NOMA Studio — Design Interior & Exterior Premium în Moldova</title>
        <meta name="description" content="NOMA Studio oferă servicii de design interior și exterior premium în Moldova. Transformăm spațiile în experiențe unice." />
        <link rel="canonical" href={SITE_URL} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <div className="home">
        <HeroProjectSlider projects={projects} />

        <SectionDivider />

        {/* --- SERVICES SECTION --- */}
        <motion.section 
          className="services-preview" 
          aria-labelledby="services-heading"
          {...(motionProps as any)}
        >
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Studio Services</span>
              <h2 id="services-heading" className="editorial-title">{t.home.whatWeOffer}</h2>
              <p className="section-subtitle">{t.home.servicesSubtitle}</p>
            </div>

            <motion.div 
              className="services-grid" 
              role="list"
              variants={staggerContainer}
            >
              <article className="service-card" role="listitem">
                <div className="service-icon" aria-hidden="true">
                  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                </div>
                <h3>{t.home.interiorDesign}</h3>
                <p>{t.home.interiorDesignDesc}</p>
              </article>

              <article className="service-card" role="listitem">
                <div className="service-icon" aria-hidden="true">
                  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  </svg>
                </div>
                <h3>{t.home.exteriorDesign}</h3>
                <p>{t.home.exteriorDesignDesc}</p>
              </article>
            </motion.div>

            <div className="section-cta">
              <Link to="/servicii" className="cta-link-luxury">
                <span>{t.home.viewAllServices}</span>
                <span className="link-underline"></span>
              </Link>
            </div>
          </div>
        </motion.section>

        <SectionDivider />

        {/* --- ABOUT SECTION --- */}
        <motion.section 
          className="about-preview" 
          aria-labelledby="about-heading"
          {...(motionProps as any)}
        >
          <div className="about-container">
            <div className="about-text">
              <span className="section-eyebrow">The Studio</span>
              <h2 id="about-heading" className="editorial-title">
                {aboutLines.map((line, i) => (
                  <span key={i}>{line}{i < aboutLines.length - 1 && <br />}</span>
                ))}
              </h2>
              <p className="editorial-body">{t.home.aboutText}</p>
              <Link to="/despre" className="cta-link-luxury">
                {t.home.aboutLink}
                <span className="link-underline"></span>
              </Link>
            </div>

            <div className="about-image-wrap">
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=1000&fit=crop"
                alt="NOMA Studio Interior"
                className="luxury-image"
                loading="lazy"
              />
              <div className="image-overlay-glow" />
            </div>
          </div>
        </motion.section>

        <SectionDivider />

        {/* --- CONTACT SECTION --- */}
        <HomeContactForm />
      </div>
    </>
  );
};

export default Home;
