import { useState, useEffect } from 'react';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../i18n/LanguageContext';
import SectionHeader from '../components/SectionHeader';
import LuxuryDivider from '../components/LuxuryDivider';
import './Servicii.css';

const SITE_URL = 'https://nomastudio.md';
const OG_IMAGE = `${SITE_URL}/og-servicii.jpg`;
const EASE = [0.16, 1, 0.3, 1] as const;

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/servicii/#webpage`,
      url: `${SITE_URL}/servicii`,
      name: 'Servicii Design Interior & Exterior — Moldova',
      description: 'Pachete de design interior premium: Basic 17€/m², Tehnic 28€/m², Signature 37€/m². Soluții complete de amenajare interioară.',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Acasă', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Servicii', item: `${SITE_URL}/servicii` },
        ],
      },
    },
    {
      '@type': 'ItemList',
      '@id': `${SITE_URL}/servicii/#packages`,
      name: 'Pachete Design Interior Premium',
      description: 'Servicii design interior: Basic, Tehnic și Signature',
      numberOfItems: 3,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'Service',
            name: 'Pachet Basic — Design Interior',
            description: 'Vizita șantier, plan releveu, amplasare mobilier, plan compartimentare, randări 3D',
            offers: {
              '@type': 'Offer',
              price: '17',
              priceCurrency: 'EUR',
              unitText: 'mp',
              availability: 'https://schema.org/InStock',
              url: `${SITE_URL}/contact`,
            },
            provider: { '@type': 'Organization', name: 'NOMA Studio', url: SITE_URL },
          },
        },
        {
          '@type': 'ListItem',
          position: 2,
          item: {
            '@type': 'Service',
            name: 'Pachet Tehnic — Design Interior Complet',
            description: 'Album tehnic, 2 variante amplasare mobilier, randări 3D modificabile, consultanță post-proiect',
            offers: {
              '@type': 'Offer',
              price: '28',
              priceCurrency: 'EUR',
              unitText: 'mp',
              availability: 'https://schema.org/InStock',
              url: `${SITE_URL}/contact`,
            },
            provider: { '@type': 'Organization', name: 'NOMA Studio', url: SITE_URL },
          },
        },
        {
          '@type': 'ListItem',
          position: 3,
          item: {
            '@type': 'Service',
            name: 'Pachet Signature — Design Rezidențial Premium',
            description: 'Compartimentări interioare, 5 vizite magazine partenere, supraveghere șantier, consultanță post-proiect',
            offers: {
              '@type': 'Offer',
              price: '37',
              priceCurrency: 'EUR',
              unitText: 'mp',
              availability: 'https://schema.org/InStock',
              url: `${SITE_URL}/contact`,
            },
            provider: { '@type': 'Organization', name: 'NOMA Studio', url: SITE_URL },
          },
        },
      ],
    },
  ],
};

const CheckIcon = () => (
  <svg
    width="17"
    height="17"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const Servicii = () => {
  const { t } = useLanguage();
  const shouldReduce = useReducedMotion();
  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /* ── Card variants ──────────────────────────────────── */
  const gridContainer: Variants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: isMobile ? 0.1 : 0.12,
      },
    },
  };

  const cardVariants: Variants = shouldReduce ? {
    initial: { opacity: 1, y: 0, scale: 1 },
    animate: { opacity: 1, y: 0, scale: 1 }
  } : {
    initial: { opacity: 0, y: isMobile ? 28 : 52, filter: isMobile ? 'none' : 'blur(6px)', scale: 1 },
    animate: { opacity: 1, y: 0, filter: isMobile ? 'none' : 'blur(0px)', scale: 1, transition: { duration: 0.7, ease: EASE } },
    hover: { 
      scale: 1.045, 
      y: -20, 
      filter: 'brightness(1.02)',
      transition: { duration: 0.6, ease: EASE } 
    }
  };

  const featuredVariants: Variants = shouldReduce ? {
    initial: { opacity: 1, y: 0, scale: 1 },
    animate: { opacity: 1, y: 0, scale: 1 }
  } : {
    initial: { opacity: 0, y: isMobile ? 28 : 52, filter: isMobile ? 'none' : 'blur(6px)', scale: 1 },
    animate: { opacity: 1, y: 0, filter: isMobile ? 'none' : 'blur(0px)', scale: 1, transition: { duration: 0.7, ease: EASE } },
    hover: { 
      scale: 1.055, 
      y: -25, 
      filter: 'brightness(1.03)',
      transition: { duration: 0.6, ease: EASE } 
    }
  };




  return (
    <>
      <Helmet>
        <title>Servicii Design Interior & Exterior — Prețuri Moldova</title>
        <meta name="description" content="Pachete design interior premium în Moldova: Basic 17€/m², Tehnic 28€/m², Signature 37€/m². Soluții complete de amenajare interioară." />
        <meta name="keywords" content="servicii design interior Moldova, prețuri design interior, pachet design interior, amenajare apartament, design interior Chișinău" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="author" content="NOMA Studio" />
        <link rel="canonical" href={`${SITE_URL}/servicii`} />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="NOMA Studio" />
        <meta property="og:url" content={`${SITE_URL}/servicii`} />
        <meta property="og:title" content="Servicii și Pachete Design Interior" />
        <meta property="og:description" content="Pachete design interior premium: Basic 17€/m², Tehnic 28€/m², Signature 37€/m². Solicită ofertă acum." />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Pachete servicii design interior Moldova" />
        <meta property="og:locale" content="ro_MD" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Servicii și Pachete Design Interior" />
        <meta name="twitter:description" content="Pachete design interior premium: Basic 17€/m², Tehnic 28€/m², Signature 37€/m²." />
        <meta name="twitter:image" content={OG_IMAGE} />
        <meta name="twitter:image:alt" content="Servicii design interior Moldova" />

        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <main className="servicii" role="main" id="main-content">

        {/* ── HERO ─────────────────────────────────────── */}
        <section className="servicii-hero" aria-labelledby="servicii-heading">
          <div className="container">
            <SectionHeader 
              title={t.services.pageTitle}
              subtitle={t.services.pageSubtitle}
            />
          </div>
        </section>

        <LuxuryDivider delay={0.6} />

        {/* ── PRICING ──────────────────────────────────── */}
        <section className="pricing-section" aria-labelledby="pricing-heading">
          <h2 id="pricing-heading" className="sr-only">Pachete și prețuri design interior</h2>
          <div className="container">
            <motion.div
              className="pricing-grid"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.05, margin: "-50px" }}
              variants={gridContainer}
              role="list"
            >

              {/* BASIC */}
              <motion.article
                className="pricing-card"
                role="listitem"
                itemScope
                itemType="https://schema.org/Service"
                variants={cardVariants}
                whileHover={!isMobile ? "hover" : undefined}
                whileFocus={!isMobile ? "hover" : undefined}
                style={{ willChange: "transform, filter" }}
              >
                <h3 className="pricing-title" itemProp="name">{t.services.basicTitle}</h3>
                <div className="pricing-price" aria-label="Preț 17 euro pe metru pătrat" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                  <span itemProp="price" content="17">17€</span>/m²
                  <meta itemProp="priceCurrency" content="EUR" />
                  <meta itemProp="availability" content="https://schema.org/InStock" />
                </div>
                <ul className="pricing-features" aria-label="Ce include pachetul Basic">
                  <li className="feature-item"><CheckIcon /><span>{t.services.features.siteVisit}</span></li>
                  <li className="feature-item"><CheckIcon /><span>{t.services.features.surveyPlan}</span></li>
                  <li className="feature-item"><CheckIcon /><span>{t.services.features.furniturePlan}</span></li>
                  <li className="feature-item"><CheckIcon /><span>{t.services.features.partitionPlan}</span></li>
                  <li className="feature-item"><CheckIcon /><span>{t.services.features.renders3d}</span></li>
                </ul>
                <a href="/contact" className="pricing-cta" aria-label={`Solicită ofertă pachet ${t.services.basicTitle} — 17€/m²`}>
                  Solicită ofertă
                </a>
              </motion.article>

              {/* TEHNIC */}
              <motion.article
                className="pricing-card featured"
                role="listitem"
                aria-label="Pachet recomandat"
                itemScope
                itemType="https://schema.org/Service"
                variants={featuredVariants}
                whileHover={!isMobile ? "hover" : undefined}
                whileFocus={!isMobile ? "hover" : undefined}
                style={{ willChange: "transform, filter" }}
              >
                <div className="popular-badge" aria-label="Cel mai popular pachet">{t.services.mostPopular}</div>
                <h3 className="pricing-title" itemProp="name">{t.services.technicTitle}</h3>
                <div className="pricing-price" aria-label="Preț 28 euro pe metru pătrat" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                  <span itemProp="price" content="28">28€</span>/m²
                  <meta itemProp="priceCurrency" content="EUR" />
                  <meta itemProp="availability" content="https://schema.org/InStock" />
                </div>
                <ul className="pricing-features" aria-label="Ce include pachetul Tehnic">
                  <li className="feature-item"><CheckIcon /><span>{t.services.features.techAlbum}</span></li>
                  <li className="feature-item"><CheckIcon /><span>{t.services.features.furnitureVariants}</span></li>
                  <li className="feature-item"><CheckIcon /><span>{t.services.features.renders3dModifiable}</span></li>
                  <li className="feature-item"><CheckIcon /><span>{t.services.features.postConsultancy}</span></li>
                </ul>
                <a href="/contact" className="pricing-cta" aria-label={`Solicită ofertă pachet ${t.services.technicTitle} — 28€/m²`}>
                  Solicită ofertă
                </a>
              </motion.article>

              {/* SIGNATURE */}
              <motion.article
                className="pricing-card"
                role="listitem"
                itemScope
                itemType="https://schema.org/Service"
                variants={cardVariants}
                whileHover={!isMobile ? "hover" : undefined}
                whileFocus={!isMobile ? "hover" : undefined}
                style={{ willChange: "transform, filter" }}
              >
                <h3 className="pricing-title" itemProp="name">{t.services.signatureTitle}</h3>
                <p className="pricing-subtitle">{t.services.signatureSubtitle}</p>
                <div className="pricing-price" aria-label="Preț 37 euro pe metru pătrat" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                  <span itemProp="price" content="37">37€</span>/m²
                  <meta itemProp="priceCurrency" content="EUR" />
                  <meta itemProp="availability" content="https://schema.org/InStock" />
                </div>
                <p className="pricing-note">{t.services.signatureNote}</p>
                <ul className="pricing-features" aria-label="Ce include pachetul Signature">
                  <li className="feature-item"><CheckIcon /><span>{t.services.features.interiorCompartments}</span></li>
                  <li className="feature-item"><CheckIcon /><span>{t.services.features.partnerVisits}</span></li>
                  <li className="feature-subitem">1. {t.services.features.flooring}</li>
                  <li className="feature-subitem">2. {t.services.features.lighting}</li>
                  <li className="feature-subitem">3. {t.services.features.hardFurniture}</li>
                  <li className="feature-subitem">4. {t.services.features.softFurniture}</li>
                  <li className="feature-subitem">5. {t.services.features.sanitary}</li>
                  <li className="feature-item"><CheckIcon /><span>{t.services.features.postConsultancy}</span></li>
                  <li className="feature-item"><CheckIcon /><span>{t.services.features.siteSupervision}</span></li>
                </ul>
                <p className="pricing-warning" role="note">{t.services.signatureWarning}</p>
                <a href="/contact" className="pricing-cta" aria-label={`Solicită ofertă pachet ${t.services.signatureTitle} — 37€/m²`}>
                  Solicită ofertă
                </a>
              </motion.article>

            </motion.div>
          </div>
        </section>

        <LuxuryDivider delay={0.1} />

        {/* ── COMPARISON ───────────────────────────────── */}
        <section className="comparison-section" aria-labelledby="comparison-heading">
          <div className="container">
            <SectionHeader 
              title={t.services.comparison}
              centered={true}
            />
            
            <motion.div 
              className="comparison-table-wrapper"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <div className="comparison-grid">
                {/* Headers */}
                <div className="comparison-row header">
                  <div className="comparison-cell feature">{t.services.comparisonHeaders.feature}</div>
                  <div className="comparison-cell">{t.services.comparisonHeaders.basic}</div>
                  <div className="comparison-cell">{t.services.comparisonHeaders.technic}</div>
                  <div className="comparison-cell premium">{t.services.comparisonHeaders.signature}</div>
                </div>

                {/* Rows mapping from translations */}
                {[
                  { key: 'siteVisit', basic: true, technic: true, signature: true },
                  { key: 'surveyPlan', basic: true, technic: true, signature: true },
                  { key: 'techAlbum', basic: false, technic: true, signature: true },
                  { key: 'furnitureVariants', basic: '1 variantă', technic: '2 variante', signature: '2 variante' },
                  { key: 'renders3d', basic: 'Fără modificări', technic: '1 modif./cameră', signature: '1 modif./cameră' },
                  { key: 'postConsultancy', basic: false, technic: true, signature: true },
                  { key: 'partnerVisits', basic: false, technic: false, signature: '5 vizite' },
                  { key: 'siteSupervision', basic: false, technic: false, signature: true },
                ].map((row, idx) => (
                  <div key={row.key} className="comparison-row" style={{ transitionDelay: `${idx * 0.05}s` }}>
                    <div className="comparison-cell feature">{t.services.comparisonRows[row.key as keyof typeof t.services.comparisonRows]}</div>
                    <div className="comparison-cell">{typeof row.basic === 'boolean' ? (row.basic ? <CheckIcon /> : '—') : row.basic}</div>
                    <div className="comparison-cell">{typeof row.technic === 'boolean' ? (row.technic ? <CheckIcon /> : '—') : row.technic}</div>
                    <div className="comparison-cell premium">{typeof row.signature === 'boolean' ? (row.signature ? <CheckIcon /> : '—') : row.signature}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <LuxuryDivider delay={0.2} />

      </main>
    </>
  );
};

export default Servicii;