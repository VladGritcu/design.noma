# NOMA Studio Design

Website ultra-lux pentru studio de design interior și exterior, construit cu React, TypeScript și Vite.

## Caracteristici

### Pagini
- **Acasă** - Hero slider cu proiect aleatoriu, previzualizare servicii și despre
- **Portofoliu** - Galerie completă de proiecte cu slidere de imagini
- **Servicii** - 3 pachete de preț cu tabel comparativ
- **Despre** - Istoria companiei, valori și statistici
- **Contact** - Formular funcțional și informații de contact

### Componente
- **Navbar** - Navigație sticky cu meniu hamburger pentru mobil
- **Footer** - Informații contact cu efecte glow la hover
- **Messenger Widget** - Widget flotant cu WhatsApp, Viber, Telegram și telefon
- **Image Slider** - Slider cu auto-play, controale manuale și tranziții smooth
- **Back to Top** - Buton pentru scroll înapoi sus

### Design System
- **Culori**: Paletă de lux cu maro, auriu și crem
- **Tipografie**: Playfair Display (titluri) + Inter (text)
- **Animații**: Scroll animations cu IntersectionObserver
- **Responsive**: 320px → 1920px
- **CSS**: Custom CSS cu variabile (fără Tailwind)

### Funcționalități Speciale
- Proiect aleatoriu pe homepage la fiecare refresh
- Animații fade-in declanșate de scroll
- Animație pulsantă pentru messenger widget
- Efect ghost shine pe butonul de contact
- Formular optimizat pentru mobil
- Meta tags SEO optimizate
- Accesibilitate completă (ARIA labels, focus states)
- Suport pentru prefers-reduced-motion

## Comenzi

```bash
# Instalare dependențe
npm install

# Rulare dezvoltare
npm run dev

# Build producție
npm run build

# Preview build
npm run preview

# Type check
npm run typecheck

# Lint
npm run lint
```

## Structură Proiect

```
src/
├── components/        # Componente reutilizabile
│   ├── BackToTop.tsx
│   ├── Footer.tsx
│   ├── ImageSlider.tsx
│   ├── MessengerWidget.tsx
│   └── Navbar.tsx
├── pages/            # Pagini principale
│   ├── Contact.tsx
│   ├── Despre.tsx
│   ├── Home.tsx
│   ├── Portofoliu.tsx
│   └── Servicii.tsx
├── data/             # Date statice
│   └── projects.ts
├── utils/            # Utilitare
│   └── scrollAnimations.ts
├── App.tsx           # Component principal
├── main.tsx          # Entry point
└── index.css         # Stiluri globale
```

## Tehnologii

- **React 18.3** - UI library
- **TypeScript 5.5** - Type safety
- **Vite 5.4** - Build tool
- **React Router 7.13** - Routing
- **CSS Custom Properties** - Design system
- **Google Fonts** - Tipografie premium

## Performance

- **Build size**: ~214KB JS (gzipped: 67KB)
- **CSS size**: ~21KB (gzipped: 4.4KB)
- **Lazy loading** pentru imagini
- **Font preload** pentru performanță
- **Semantic HTML** pentru SEO
- **Optimizat pentru producție**

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## License

Proprietary - NOMA Studio Design © 2026
