import { useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import './Servicii.css';

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
    '@type': 'ItemList',
    name: 'Pachete Design Interior NOMA Studio România',
    description: 'Servicii design interior lux: Basic, Tehnic și Signature',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'Service',
          name: 'NOMA Basic — Design Interior',
          description: 'Vizita santier, plan releveu, amplasare mobilier, plan compartimentare, randari 3D',
          offers: {
            '@type': 'Offer',
            price: '17',
            priceCurrency: 'EUR',
            unitText: 'mp',
            availability: 'https://schema.org/InStock',
          },
          provider: { '@type': 'Organization', name: 'NOMA Studio Design' },
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'Service',
          name: 'NOMA Tehnic — Design Interior Complet',
          description: 'Album tehnic, 2 variante amplasare mobilier, randari 3D modificabile, consultanta post-proiect',
          offers: {
            '@type': 'Offer',
            price: '28',
            priceCurrency: 'EUR',
            unitText: 'mp',
            availability: 'https://schema.org/InStock',
          },
          provider: { '@type': 'Organization', name: 'NOMA Studio Design' },
        },
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@type': 'Service',
          name: 'NOMA Signature — Design Rezidential Premium',
          description: 'Compartimentari interioare, 5 vizite magazine partenere, supraveghere santier, consultanta post-proiect',
          offers: {
            '@type': 'Offer',
            price: '37',
            priceCurrency: 'EUR',
            unitText: 'mp',
            availability: 'https://schema.org/InStock',
          },
          provider: { '@type': 'Organization', name: 'NOMA Studio Design' },
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <main className="servicii" role="main" id="main-content">

        {/* ── HERO ── */}
        <section className="servicii-hero" aria-labelledby="servicii-heading">
          <div className="container">
            <p className="hero-eyebrow" aria-hidden="true">Studio NOMA</p>
            <h1 className="page-title" id="servicii-heading">
              {t.services.pageTitle}
            </h1>
            <div className="hero-divider" aria-hidden="true">
              <span className="divider-line"></span>
              <span className="divider-diamond"></span>
              <span className="divider-line"></span>
            </div>
            <p className="page-subtitle">{t.services.pageSubtitle}</p>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section
          className="pricing-section"
          aria-label="Pachete și prețuri design interior lux"
        >
          <div className="container">
            <div className="pricing-grid" ref={gridRef} role="list">

              {/* BASIC */}
              <article
                className="pricing-card fade-in"
                role="listitem"
                itemScope
                itemType="https://schema.org/Service"
              >
                <h2 className="pricing-title" itemProp="name">
                  {t.services.basicTitle}
                </h2>
                <div
                  className="pricing-price"
                  aria-label="Preț 17 euro pe metru pătrat"
                  itemProp="offers"
                  itemScope
                  itemType="https://schema.org/Offer"
                >
                  <span itemProp="price" content="17">17€</span>/m²
                  <meta itemProp="priceCurrency" content="EUR" />
                </div>
                <ul
                  className="pricing-features"
                  aria-label="Ce include pachetul Basic"
                  itemProp="description"
                >
                  <li className="feature-item"><CheckIcon /><span>{t.services.features.siteVisit}</span></li>
                  <li className="feature-item"><CheckIcon /><span>{t.services.features.surveyPlan}</span></li>
                  <li className="feature-item"><CheckIcon /><span>{t.services.features.furniturePlan}</span></li>
                  <li className="feature-item"><CheckIcon /><span>{t.services.features.partitionPlan}</span></li>
                  <li className="feature-item"><CheckIcon /><span>{t.services.features.renders3d}</span></li>
                </ul>
                <a
                  href="/contact"
                  className="pricing-cta"
                  aria-label={`Solicită ofertă pachet ${t.services.basicTitle} — 17€/m²`}
                />
              </article>

              {/* TEHNIC */}
              <article
                className="pricing-card featured fade-in"
                role="listitem"
                aria-label="Pachet recomandat"
                itemScope
                itemType="https://schema.org/Service"
              >
                <div className="popular-badge" aria-label="Cel mai popular pachet">
                  {t.services.mostPopular}
                </div>
                <h2 className="pricing-title" itemProp="name">
                  {t.services.technicTitle}
                </h2>
                <div
                  className="pricing-price"
                  aria-label="Preț 28 euro pe metru pătrat"
                  itemProp="offers"
                  itemScope
                  itemType="https://schema.org/Offer"
                >
                  <span itemProp="price" content="28">28€</span>/m²
                  <meta itemProp="priceCurrency" content="EUR" />
                </div>
                <ul
                  className="pricing-features"
                  aria-label="Ce include pachetul Tehnic"
                  itemProp="description"
                >
                  <li className="feature-item"><CheckIcon /><span>{t.services.features.techAlbum}</span></li>
                  <li className="feature-item"><CheckIcon /><span>{t.services.features.furnitureVariants}</span></li>
                  <li className="feature-item"><CheckIcon /><span>{t.services.features.renders3dModifiable}</span></li>
                  <li className="feature-item"><CheckIcon /><span>{t.services.features.postConsultancy}</span></li>
                </ul>
                <a
                  href="/contact"
                  className="pricing-cta"
                  aria-label={`Solicită ofertă pachet ${t.services.technicTitle} — 28€/m²`}
                />
              </article>

              {/* SIGNATURE */}
              <article
                className="pricing-card fade-in"
                role="listitem"
                itemScope
                itemType="https://schema.org/Service"
              >
                <h2 className="pricing-title" itemProp="name">
                  {t.services.signatureTitle}
                </h2>
                <p className="pricing-subtitle">{t.services.signatureSubtitle}</p>
                <div
                  className="pricing-price"
                  aria-label="Preț 37 euro pe metru pătrat"
                  itemProp="offers"
                  itemScope
                  itemType="https://schema.org/Offer"
                >
                  <span itemProp="price" content="37">37€</span>/m²
                  <meta itemProp="priceCurrency" content="EUR" />
                </div>
                <p className="pricing-note">{t.services.signatureNote}</p>
                <ul
                  className="pricing-features"
                  aria-label="Ce include pachetul Signature"
                  itemProp="description"
                >
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
                <p className="pricing-warning" role="note">
                  {t.services.signatureWarning}
                </p>
                <a
                  href="/contact"
                  className="pricing-cta"
                  aria-label={`Solicită ofertă pachet ${t.services.signatureTitle} — 37€/m²`}
                />
              </article>

            </div>
          </div>
        </section>

      </main>
    </>
  );
};

export default Servicii;
