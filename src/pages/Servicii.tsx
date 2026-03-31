import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../i18n/LanguageContext';
import './Servicii.css';

const SITE_URL = 'https://nomastudio.md';
const OG_IMAGE = `${SITE_URL}/og-servicii.jpg`;

const CheckIcon = () => (
  <svg
    width="17"
    height="17"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
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
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll('.pricing-card');
    if (!cards) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/servicii/#webpage`,
        url: `${SITE_URL}/servicii`,
        name: 'Servicii Design Interior & Exterior — NOMA Studio Moldova',
        description: 'Pachete de design interior premium: Basic 17€/m², Tehnic 28€/m², Signature 37€/m². Studio NOMA oferă soluții complete de amenajare interioară în Moldova.',
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
        name: 'Pachete Design Interior NOMA Studio',
        description: 'Servicii design interior: Basic, Tehnic și Signature',
        numberOfItems: 3,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            item: {
              '@type': 'Service',
              name: 'NOMA Basic — Design Interior',
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
              name: 'NOMA Tehnic — Design Interior Complet',
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
              name: 'NOMA Signature — Design Rezidențial Premium',
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

  return (
    <>
      <Helmet>
        <title>Servicii Design Interior & Exterior — Prețuri NOMA Studio Moldova</title>
        <meta name="description" content="Pachete design interior premium în Moldova: Basic 17€/m², Tehnic 28€/m², Signature 37€/m². NOMA Studio — soluții complete de amenajare interioară și exterioară." />
        <meta name="keywords" content="servicii design interior Moldova, prețuri design interior, pachet design interior, amenajare apartament, design interior Chișinău, NOMA studio servicii" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="author" content="NOMA Studio" />
        <link rel="canonical" href={`${SITE_URL}/servicii`} />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="NOMA Studio" />
        <meta property="og:url" content={`${SITE_URL}/servicii`} />
        <meta property="og:title" content="Servicii Design Interior — Prețuri NOMA Studio Moldova" />
        <meta property="og:description" content="Pachete design interior premium: Basic 17€/m², Tehnic 28€/m², Signature 37€/m². Solicită ofertă acum." />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Pachete servicii design interior NOMA Studio" />
        <meta property="og:locale" content="ro_MD" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Servicii Design Interior — Prețuri NOMA Studio" />
        <meta name="twitter:description" content="Pachete design interior premium: Basic 17€/m², Tehnic 28€/m², Signature 37€/m²." />
        <meta name="twitter:image" content={OG_IMAGE} />
        <meta name="twitter:image:alt" content="Servicii design interior NOMA Studio Moldova" />

        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <main className="servicii" role="main" id="main-content">

        <section className="servicii-hero" aria-labelledby="servicii-heading">
          <div className="container">
            <p className="hero-eyebrow" aria-hidden="true">Studio NOMA</p>
            <h1 className="page-title" id="servicii-heading">{t.services.pageTitle}</h1>
            <div className="hero-divider" aria-hidden="true">
              <span className="divider-line"></span>
              <span className="divider-diamond"></span>
              <span className="divider-line"></span>
            </div>
            <p className="page-subtitle">{t.services.pageSubtitle}</p>
          </div>
        </section>

        <section className="pricing-section" aria-labelledby="pricing-heading">
          <h2 id="pricing-heading" className="sr-only">Pachete și prețuri design interior</h2>
          <div className="container">
            <div className="pricing-grid" ref={gridRef} role="list">

              {/* BASIC */}
              <article className="pricing-card fade-in" role="listitem" itemScope itemType="https://schema.org/Service">
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
              </article>

              {/* TEHNIC */}
              <article className="pricing-card featured fade-in" role="listitem" aria-label="Pachet recomandat" itemScope itemType="https://schema.org/Service">
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
              </article>

              {/* SIGNATURE */}
              <article className="pricing-card fade-in" role="listitem" itemScope itemType="https://schema.org/Service">
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
              </article>

            </div>
          </div>
        </section>

      </main>
    </>
  );
};

export default Servicii;
