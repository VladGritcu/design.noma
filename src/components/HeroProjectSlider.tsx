import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { Project } from '../data/projects';
import s from './HeroProjectSlider.module.css';

interface HeroProjectSliderProps {
  projects: Project[];
  duration?: number;
  autoplay?: boolean;
}

const HeroProjectSlider = ({ 
  projects, 
  duration = 5000,
  autoplay = true 
}: HeroProjectSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  
  const { t } = useLanguage();

  // Refs for animation & timer state (zero re-renders)
  const progressBarRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number>(0);
  const pausedRef = useRef<boolean>(false);
  const savedProgressRef = useRef<number>(0);
  const slowModeRef = useRef<boolean>(false);
  const gapCounterRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const isFocusedRef = useRef<boolean>(false);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const slides = useMemo(() => projects, [projects]);

  // Preload Logic
  useEffect(() => {
    let loadedCount = 0;
    slides.forEach((project, i) => {
      const src = project.images[0];
      const img = new Image();
      // iOS Safari / High Performance hints
      img.fetchPriority = i === 0 ? 'high' : 'low';
      
      img.onload = () => {
        setLoadedImages(prev => {
          const next = new Set(prev);
          next.add(src);
          return next;
        });
        loadedCount++;
        if (i === 0) setIsReady(true);
      };
      img.src = src;
    });
  }, [slides]);

  // Utility to check Battery/Data Saver
  const checkConstraints = useCallback(() => {
    if (typeof navigator !== 'undefined') {
      // @ts-ignore - experimental API
      if (navigator.connection?.saveData) return false;
    }
    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return autoplay;
  }, [autoplay]);

  const advanceSlide = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % slides.length);
  }, [slides.length]);

  const resetTimer = useCallback((newStartTime = performance.now()) => {
    startTimeRef.current = newStartTime;
    savedProgressRef.current = 0;
    if (progressBarRef.current) {
      progressBarRef.current.style.width = '0%';
    }
  }, []);

  const tick = useCallback((now: number) => {
    // 1. Slow Device Detection (first 10 frames or sampling)
    if (lastFrameTimeRef.current > 0) {
      const gap = now - lastFrameTimeRef.current;
      if (gap > 100) {
        gapCounterRef.current++;
        if (gapCounterRef.current >= 3) {
          slowModeRef.current = true;
        }
      } else {
        gapCounterRef.current = 0;
      }
    }
    lastFrameTimeRef.current = now;

    if (pausedRef.current) {
      rafIdRef.current = requestAnimationFrame(tick);
      return;
    }

    const elapsed = now - startTimeRef.current;
    // Cap delta for background tab return
    const delta = Math.min(elapsed, 50); 
    
    // We compute the actual progress by how much time has passed since START
    // but we use savedProgress if we resumed from a pause.
    // simpler: progress = (elapsed / duration)
    const progress = Math.min(elapsed / duration, 1);

    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${progress * 100}%`;
    }

    if (progress >= 1) {
      advanceSlide();
      resetTimer(now);
    }

    rafIdRef.current = requestAnimationFrame(tick);
  }, [duration, advanceSlide, resetTimer]);

  // Control Functions
  const pause = useCallback(() => {
    if (pausedRef.current) return;
    pausedRef.current = true;
    const now = performance.now();
    const elapsed = now - startTimeRef.current;
    savedProgressRef.current = Math.min(elapsed / duration, 1);
  }, [duration]);

  const resume = useCallback(() => {
    if (!pausedRef.current) return;
    pausedRef.current = false;
    // Recalculate startTime to pick up where we left off
    startTimeRef.current = performance.now() - (savedProgressRef.current * duration);
  }, [duration]);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index);
    resetTimer();
  }, [resetTimer]);

  const next = useCallback(() => {
    advanceSlide();
    resetTimer();
  }, [advanceSlide, resetTimer]);

  const prev = useCallback(() => {
    setCurrentIndex(p => (p - 1 + slides.length) % slides.length);
    resetTimer();
  }, [slides.length, resetTimer]);

  // Main Loop Lifecycle
  useEffect(() => {
    if (!isReady || !checkConstraints()) return;

    startTimeRef.current = performance.now();
    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
    };
  }, [isReady, tick, checkConstraints]);

  // Visibility & Focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) pause();
      else resume();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFocusedRef.current) return;
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [pause, resume, next, prev]);

  // Touch Handlers (Passive)
  useEffect(() => {
    const container = document.getElementById('hps-container');
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      pause();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const dx = touchEndX - touchStartX.current;
      const dy = touchEndY - touchStartY.current;

      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx < 0) next();
        else prev();
      }
      
      // Delay resume slightly for smoother feel
      setTimeout(resume, 300);
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pause, resume, next, prev]);

  if (!isReady) {
    return (
      <div className={s.root}>
        <div className={s.skeleton}>
          <div className={s.shimmer} />
        </div>
      </div>
    );
  }

  return (
    <section 
      id="hps-container"
      className={s.root}
      role="region" 
      aria-label="Proiecte slider"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={() => { isFocusedRef.current = true; }}
      onBlur={() => { isFocusedRef.current = false; }}
      tabIndex={0}
    >
      <div className={s.stage} aria-live="polite" aria-atomic="true">
        {slides.map((slide, i) => {
          const isActive = i === currentIndex;
          const isLoaded = loadedImages.has(slide.images[0]);
          
          return (
            <div 
              key={slide.id || i}
              className={`${s.slide} ${isActive ? s.slideActive : ''}`}
              aria-hidden={!isActive}
              onTransitionEnd={(e) => {
                // Release GPU layer after transition
                (e.currentTarget as HTMLDivElement).style.willChange = 'auto';
              }}
            >
              {isLoaded && (
                <Link 
                  to={`/portofoliu#project-${slide.id}`} 
                  className={s.imgLink}
                  aria-label={`${t.hero.viewProject} ${slide.name}`}
                >
                  <img 
                    src={slide.images[0]} 
                    alt={slide.name}
                    className={s.img}
                    loading={i === 0 ? "eager" : "lazy"}
                    // fetchPriority only works on native img tags in some browsers
                    // but we can set it here via spread or just hope for the best
                    {...({ fetchpriority: i === 0 ? 'high' : 'low' } as any)}
                  />
                </Link>
              )}
              
              <div className={s.overlay} />
              
              <div className={`${s.caption} ${isActive ? s.captionVisible : ''}`}>
                <h2 className={s.title}>{slide.name}</h2>
              </div>
            </div>
          );
        })}
      </div>

      <div className={s.arrows}>
        <button 
          className={`${s.arrow} ${s.arrowLeft}`} 
          onClick={prev}
          aria-label="Proiect anterior"
          type="button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button 
          className={`${s.arrow} ${s.arrowRight}`} 
          onClick={next}
          aria-label="Proiect următor"
          type="button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {autoplay && !slowModeRef.current && (
        <div className={s.progressBar} aria-hidden="true">
          <div ref={progressBarRef} className={s.progressFill} />
        </div>
      )}

      <nav className={s.dots} aria-label="Navigare proiecte">
        {slides.map((slide, i) => (
          <button
            key={`dot-${slide.id || i}`}
            className={`${s.dot} ${i === currentIndex ? s.dotActive : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1} din ${slides.length}`}
            aria-current={i === currentIndex ? 'true' : undefined}
            type="button"
          />
        ))}
      </nav>
    </section>
  );
};

export default HeroProjectSlider;