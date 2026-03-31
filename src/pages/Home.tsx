import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../i18n/LanguageContext';
import HeroProjectSlider from '../components/HeroProjectSlider';
import { projects } from '../data/projects';
import './Home.css';

const SITE_URL = 'https://nomastudio.md';
const OG_IMAGE = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&h=630&fit=crop';

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
      sameAs: [],
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
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: 'NOMA Studio — Design Interior & Exterior Premium în Moldova',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#organization` },
      description:
        'NOMA Studio oferă servicii de design interior și exterior premium în Moldova. Transformăm spațiile în experiențe unice, cu atenție la detalii și estetică rafinată.',
    },
    {
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/#localbusiness`,
      name: 'NOMA Studio',
      url: SITE_URL,
      image: OG_IMAGE,
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'MD',
      },
      serviceType: ['Design Interior', 'Design Exterior', 'Amenajări Interioare'],
    },
  ],
};

const Home = () => {
  const { t } = useLanguage();
  const aboutLines = t.home.aboutTitle.split('\n');

  return (
    <>
      <Helmet>
        {/* Primary */}
        <html lang="ro" />
        <title>NOMA Studio — Design Interior & Exterior Premium în Moldova</title>
        <meta
          name="description"
          content="NOMA Studio oferă servicii de design interior și exterior premium în Moldova. Transformăm spațiile în experiențe unice, cu atenție la detalii și estetică rafinată."
        />
        <meta
          name="keywords"
          content="design interior Moldova, design exterior, studio design Chișinău, NOMA studio, amenajări interioare, arhitectură interioară, renovare apartament"
        />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="author" content="NOMA Studio" />
        <link rel="canonical" href={SITE_URL} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="NOMA Studio" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content="NOMA Studio — Design Interior & Exterior Premium în Moldova" />
        <meta property="og:description" content="Transformăm spațiile în experiențe unice. Design interior și exterior premium în Moldova." />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="NOMA Studio — Design Interior Premium" />
        <meta property="og:locale" content="ro_MD" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="NOMA Studio — Design Interior & Exterior Premium" />
        <meta name="twitter:description" content="Transformăm spațiile în experiențe unice. Design interior și exterior premium în Moldova." />
        <meta name="twitter:image" content={OG_IMAGE} />
        <meta name="twitter:image:alt" content="NOMA Studio Design Interior" />

        {/* Performance */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="home">
        <HeroProjectSlider projects={projects} />

        <section className="services-preview fade-in" aria-labelledby="services-heading">
          <div className="container">
            <div className="section-header">
              <h2 id="services-heading">{t.home.whatWeOffer}</h2>
              <p className="section-subtitle">{t.home.servicesSubtitle}</p>
            </div>

            <div className="services-grid" role="list">
              <article className="service-card" role="listitem">
                <div className="service-icon" aria-hidden="true">
                  <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                </div>
                <h3>{t.home.interiorDesign}</h3>
                <p>{t.home.interiorDesignDesc}</p>
              </article>

              <article className="service-card" role="listitem">
                <div className="service-icon" aria-hidden="true">
                  <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <h3>{t.home.exteriorDesign}</h3>
                <p>{t.home.exteriorDesignDesc}</p>
              </article>
            </div>

            <div className="section-cta">
              <Link to="/servicii" className="cta-button" aria-label="Vezi toate serviciile NOMA Studio">
                <span>{t.home.viewAllServices} &rarr;</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="about-preview fade-in" aria-labelledby="about-heading">
          <div className="about-container">
            <div className="about-text">
              <h2 id="about-heading">
                {aboutLines.map((line, i) => (
                  <span key={i}>{line}{i < aboutLines.length - 1 && <br />}</span>
                ))}
              </h2>
              <p>{t.home.aboutText}</p>
              <Link to="/despre" className="about-link" aria-label="Află mai multe despre NOMA Studio">
                {t.home.aboutLink} &rarr;
              </Link>
            </div>

            <div className="about-image">
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=1000&fit=crop"
                alt="Spațiu de lucru NOMA Studio — design interior premium"
                loading="lazy"
                decoding="async"
                width="800"
                height="1000"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
