import {
  useState, useEffect, useRef,
  useMemo, useCallback, useId,
} from 'react';
import { Helmet }       from 'react-helmet-async';
import { useLanguage }  from '../i18n/LanguageContext';
import { useForm }      from 'react-hook-form';
import { zodResolver }  from '@hookform/resolvers/zod';
import * as z           from 'zod';
import {
  motion, AnimatePresence, useInView, useReducedMotion,
} from 'framer-motion';
import {
  Check, Send, Phone, Mail, MapPin,
  Loader2, Image as ImageIcon, X,
} from 'lucide-react';
import { cn }       from '@/lib/utils';
import { Button }   from '@/components/ui/button';
import {
  Form, FormControl, FormField,
  FormItem, FormMessage,
} from '@/components/ui/form';
import { Input }    from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Toaster }  from '@/components/ui/sonner';
import { toast }    from 'sonner';
import './Contact.css';



/* ═══════════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════════ */
const SITE_URL  = 'https://nomastudio.md';
const OG_IMAGE  = `${SITE_URL}/og-contact.jpg`;
const MAX_FILES = 5;
const ACCEPT    = 'image/*';


const FORM_FIELDS = ['name', 'email', 'phone', 'message'] as const;



/* ═══════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════ */
interface PreviewFile {
  id:      string;   // stable key — avoids React key warnings
  name:    string;
  preview: string;
  size:    number;
}



/* ═══════════════════════════════════════════════════════════════
   MOTION VARIANTS
═══════════════════════════════════════════════════════════════ */
const EASE_OUT  = [0.16, 1, 0.3,  1]    as const;
const EASE_SOFT = [0.25, 0.46, 0.45, 0.94] as const;
const EASE_SPR  = [0.22, 0.61, 0.36, 1] as const;


/** Shared fade-up used for section + fields */
const fadeUp = {
  hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
  show:   { opacity: 1, y: 0,  filter: 'blur(0px)' },
};


const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.2 },
  },
};


const cardVariant = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1, y: 0,
    transition: { duration: 0.54, ease: EASE_OUT },
  },
};


const errorVariant = {
  initial:  { height: 0, opacity: 0, y: -4 },
  animate:  { height: 'auto', opacity: 1, y: 0 },
  exit:     { height: 0, opacity: 0, y: -4 },
  transition: { duration: 0.2, ease: EASE_SOFT },
};


const chipVariant = {
  initial: { opacity: 0, scale: 0.82 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.18, ease: EASE_SPR } },
  exit:    { opacity: 0, scale: 0.82, transition: { duration: 0.14 } },
};


/** No-motion fallback — everything visible instantly */
const noMotion = {
  hidden: { opacity: 1, y: 0, filter: 'blur(0px)' },
  show:   { opacity: 1, y: 0, filter: 'blur(0px)' },
};



/* ══════════════════════════════════════════════════════════════
   SUB-COMPONENTS (extracted to avoid anonymous re-renders)
═══════════════════════════════════════════════════════════════ */


/** Floating-label input wrapper */
interface FloatFieldProps {
  label:       string;
  placeholder: string;
  error?:      string;
  children:    React.ReactNode;
  inView:      boolean;
  delay:       number;
  reducedMotion: boolean;
}


const FloatField = ({
  label, error, children, inView, delay, reducedMotion,
}: FloatFieldProps) => {
  const variants = reducedMotion ? noMotion : fadeUp;
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      transition={{ duration: 0.48, delay, ease: EASE_OUT }}
    >
      <FormItem className="form-field-modern">
        {/* Label is visually hidden — placeholder acts as label */}
        <span className="visually-hidden">{label}</span>
        <FormControl>{children}</FormControl>
        <AnimatePresence mode="wait">
          {error && (
            <motion.div key="err" {...errorVariant}>
              <FormMessage className="form-error-message" />
            </motion.div>
          )}
        </AnimatePresence>
      </FormItem>
    </motion.div>
  );
};



/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
const Contact = () => {
  const { t, language } = useLanguage();
  const shouldReduceMotion = useReducedMotion(); // ← respects OS setting


  /* ─── IDs for accessibility ─── */
  const progressId = useId();


  /* ─── States ─── */
  const [isPending,  setIsPending]  = useState(false);
  const [isSuccess,  setIsSuccess]  = useState(false);
  const [progress,   setProgress]   = useState(0);
  const [previews,   setPreviews]   = useState<PreviewFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);


  /* ─── Refs ─── */
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sectionRef   = useRef<HTMLElement>(null);
  const cardsRef     = useRef<HTMLDivElement>(null);
  const successTimer = useRef<ReturnType<typeof setTimeout>>();


  /* ─── InView ─── */
  const sectionInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const cardsInView   = useInView(cardsRef,   { once: true, margin: '-60px' });


  /* ─── Schema (i18n) ─── */
  const formSchema = useMemo(() => z.object({
    name:    z.string().min(2,  { message: t('contact.nameError')    }),
    email:   z.string().email(  { message: t('contact.emailError')   }),
    phone:   z.string().min(8,  { message: t('contact.phoneError')   }),
    message: z.string().min(10, { message: t('contact.messageError') }).max(8000),
  }), [t]);


  type FormValues = z.infer<typeof formSchema>;


  /* ─── Info cards ─── */
  const infoItems = useMemo(() => [
    {
      Icon:  MapPin,
      label: t('contact.visitAddress'),
      href:  `https://maps.google.com/?q=${encodeURIComponent(t('contact.visitAddress'))}`,
      ariaLabel: `${t('contact.visitLabel')}: ${t('contact.visitAddress')}`,
    },
    {
      Icon:  Phone,
      label: t('contact.callInfo').split('\n')[0],
      href:  `tel:${t('contact.callInfo').split('\n')[0].replace(/[\s()]/g, '')}`,
      ariaLabel: `${t('contact.callLabel')}: ${t('contact.callInfo').split('\n')[0]}`,
    },
    {
      Icon:  Mail,
      label: t('contact.writeInfo').split('\n')[0],
      href:  `mailto:${t('contact.writeInfo').split('\n')[0]}`,
      ariaLabel: `${t('contact.writeLabel')}: ${t('contact.writeInfo').split('\n')[0]}`,
    },
  ], [t]);


  /* ─── Form ─── */
  const form = useForm<FormValues>({
    resolver:      zodResolver(formSchema),
    defaultValues: { name: '', email: '', phone: '', message: '' },
    mode:          'onBlur',
  });


  const { errors }       = form.formState;
  const watchedValues    = form.watch();


  /* ─── Live progress ─── */
  useEffect(() => {
    const filled = FORM_FIELDS.filter(f => {
      const v = watchedValues[f];
      return v && v.length > 0 && !errors[f];
    }).length;
    setProgress((filled / FORM_FIELDS.length) * 100);
  }, [watchedValues, errors]);


  /* ─── Cleanup object URLs on unmount ─── */
  useEffect(() => {
    return () => {
      previews.forEach(p => URL.revokeObjectURL(p.preview));
      if (successTimer.current) clearTimeout(successTimer.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  /* ─── File handler ─── */
  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || previews.length >= MAX_FILES) {
      if (previews.length >= MAX_FILES) toast.error(t('contact.maxFilesError'));
      return;
    }


    const accepted = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .slice(0, MAX_FILES - previews.length);


    if (!accepted.length) return;


    setPreviews(prev => [
      ...prev,
      ...accepted.map(f => ({
        id:      crypto.randomUUID(),   // stable key
        name:    f.name,
        preview: URL.createObjectURL(f),
        size:    f.size,
      })),
    ]);
  }, [previews.length, t]);


  const removePreview = useCallback((id: string) => {
    setPreviews(prev => {
      const target = prev.find(p => p.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter(p => p.id !== id);
    });
  }, []);


  /* ─── Drag & Drop ─── */
  const onDragOver  = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(true);
  }, []);
  const onDragLeave = useCallback(() => setIsDragging(false), []);
  const onDrop      = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);


  /* ─── Submit ─── */
  const onSubmit = useCallback(async (_data: FormValues) => {
    setIsPending(true);


    try {
      // Replace with real API call: await sendContactForm(data, previews)
      await new Promise(r => setTimeout(r, 1800));


      setIsPending(false);
      setIsSuccess(true);


      toast.success(t('contact.successTitle'), {
        description: t('contact.successDesc'),
      });


      form.reset();
      setPreviews(prev => { prev.forEach(p => URL.revokeObjectURL(p.preview)); return []; });
      setProgress(0);


      successTimer.current = setTimeout(() => setIsSuccess(false), 6000);
    } catch {
      setIsPending(false);
      toast.error(t('contact.errorTitle') ?? 'Error', {
        description: t('contact.errorDesc') ?? 'Something went wrong. Please try again.',
      });
    }
  }, [form, t]);


  /* ─── SEO Schema ─── */
  const schemaData = useMemo(() => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type':  'ContactPage',
        '@id':    `${SITE_URL}/contact/#webpage`,
        url:      `${SITE_URL}/contact`,
        name:     `Contact — NOMA Studio`,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: t('nav.home'),    item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: t('nav.contact'), item: `${SITE_URL}/contact` },
          ],
        },
      },
      {
        '@type':     'LocalBusiness',
        '@id':       `${SITE_URL}/#business`,
        name:        'NOMA Studio',
        url:         SITE_URL,
        image:       OG_IMAGE,
        description: t('footer.contactDesc'),
        address: {
          '@type':         'PostalAddress',
          streetAddress:   'Strada Designului 24',
          addressLocality: 'Chișinău',
          addressCountry:  'MD',
        },
        openingHoursSpecification: [{
          '@type':   'OpeningHoursSpecification',
          dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
          opens:  '09:00',
          closes: '18:00',
        }],
        priceRange: '€€€',
      },
    ],
  }), [t, language]);


  /* ─── Motion variants (respects OS preference) ─── */
  const mv = shouldReduceMotion ? noMotion : fadeUp;



  /* ═════════════════════════════════════════
      RENDER
  ═════════════════════════════════════════ */
  return (
    <>
      <Helmet>
        <title>{t('nav.contact')} — NOMA Studio | Design Interior Chișinău</title>
        <meta name="description"        content={t('footer.contactDesc')} />
        <meta name="robots"             content="index, follow" />
        <link rel="canonical"           href={`${SITE_URL}/contact`} />
        <meta property="og:type"        content="website" />
        <meta property="og:title"       content={`${t('nav.contact')} — NOMA Studio`} />
        <meta property="og:description" content={t('footer.contactDesc')} />
        <meta property="og:image"       content={OG_IMAGE} />
        <meta property="og:url"         content={`${SITE_URL}/contact`} />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>


      <Toaster position="top-center" richColors />


      {/* ══════════════ SECTION ══════════════ */}
      <main
        ref={sectionRef}
        className="contact-section-modern"
        aria-label={t('nav.contact')}
      >
        <div className="contact-content">


          {/* ── HEADER ── */}
          <motion.header
            className="form-header form-header--centered"
            variants={mv}
            initial="hidden"
            animate={sectionInView ? 'show' : 'hidden'}
            transition={{ duration: 0.7, ease: EASE_OUT }}
          >
            <h1 className="form-header__title">
              {(() => {
                const titleText = t('contact.pageTitle');
                const words = titleText.split(' ');
                if (words.length <= 1) return titleText;
                const lastWord = words.pop();
                const mainText = words.join(' ');
                return (
                  <>
                    {mainText} <span className="text-highlight">{lastWord}</span>
                  </>
                );
              })()}
            </h1>

            <div className="section-divider" aria-hidden="true">
              <motion.span
                className="divider-line"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={sectionInView ? { scaleX: 1, opacity: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.35, ease: EASE_OUT }}
                style={{ transformOrigin: 'right center' }}
              />
              <span className="divider-diamond" />
              <motion.span
                className="divider-line"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={sectionInView ? { scaleX: 1, opacity: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.35, ease: EASE_OUT }}
                style={{ transformOrigin: 'left center' }}
              />
            </div>
          </motion.header>


          {/* ── FORM CARD ── */}
          <motion.div
            className="contact-content__inner"
            variants={mv}
            initial="hidden"
            animate={sectionInView ? 'show' : 'hidden'}
            transition={{ duration: 0.72, delay: 0.18, ease: EASE_OUT }}
          >
            {/* Progress bar */}
            <div
              id={progressId}
              className="form-progress"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={t('contact.progressLabel')}
            >
              <motion.div
                className="form-progress__bar"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.55, ease: EASE_SPR }}
              />
            </div>


            <Form {...form}>
              <form
                id="contactFormModern"
                onSubmit={form.handleSubmit(onSubmit)}
                className="contact-form-modern"
                noValidate
                aria-describedby={progressId}
              >


                {/* NAME */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FloatField
                      label={t('contact.nameLabel')}
                      placeholder={t('contact.namePlaceholder')}
                      error={errors.name?.message}
                      inView={sectionInView}
                      delay={0.22}
                      reducedMotion={!!shouldReduceMotion}
                    >
                      <Input
                        placeholder={t('contact.namePlaceholder')}
                        className={cn('form-input-modern', errors.name && 'error')}
                        autoComplete="name"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'err-name' : undefined}
                        {...field}
                      />
                    </FloatField>
                  )}
                />


                {/* EMAIL */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FloatField
                      label={t('contact.emailLabel')}
                      placeholder={t('contact.emailPlaceholder')}
                      error={errors.email?.message}
                      inView={sectionInView}
                      delay={0.28}
                      reducedMotion={!!shouldReduceMotion}
                    >
                      <Input
                        type="email"
                        placeholder={t('contact.emailPlaceholder')}
                        className={cn('form-input-modern', errors.email && 'error')}
                        autoComplete="email"
                        aria-invalid={!!errors.email}
                        {...field}
                      />
                    </FloatField>
                  )}
                />


                {/* PHONE */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FloatField
                      label={t('contact.phoneLabel')}
                      placeholder={t('contact.phonePlaceholder')}
                      error={errors.phone?.message}
                      inView={sectionInView}
                      delay={0.34}
                      reducedMotion={!!shouldReduceMotion}
                    >
                      <Input
                        type="tel"
                        placeholder={t('contact.phonePlaceholder')}
                        className={cn('form-input-modern', errors.phone && 'error')}
                        autoComplete="tel"
                        inputMode="tel"
                        aria-invalid={!!errors.phone}
                        {...field}
                      />
                    </FloatField>
                  )}
                />


                {/* MESSAGE */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FloatField
                      label={t('contact.messageLabel')}
                      placeholder={t('contact.messagePlaceholder')}
                      error={errors.message?.message}
                      inView={sectionInView}
                      delay={0.40}
                      reducedMotion={!!shouldReduceMotion}
                    >
                      <Textarea
                        placeholder={t('contact.messagePlaceholder')}
                        className={cn('form-textarea-modern', errors.message && 'error')}
                        rows={4}
                        spellCheck
                        aria-invalid={!!errors.message}
                        {...field}
                      />
                    </FloatField>
                  )}
                />


                {/* UPLOAD */}
                <motion.div
                  variants={mv}
                  initial="hidden"
                  animate={sectionInView ? 'show' : 'hidden'}
                  transition={{ duration: 0.5, delay: 0.46, ease: EASE_OUT }}
                >
                  <div
                    className={cn(
                      'inspiration-upload-area',
                      isDragging && 'inspiration-upload-area--drag',
                    )}
                    role="button"
                    tabIndex={0}
                    aria-label={t('contact.uploadTitle')}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        fileInputRef.current?.click();
                    }
                    }}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                  >
                    <div className="inspiration-upload-inner" aria-hidden="true">
                      <div className="inspiration-upload-icon">
                        <ImageIcon size={16} strokeWidth={1.5} />
                      </div>
                      <div className="inspiration-upload-text">
                        <span className="inspiration-upload-title">
                          {t('contact.uploadTitle')}
                        </span>
                        <span className="inspiration-upload-sub">
                          {t('contact.uploadSub')}
                        </span>
                      </div>
                    </div>


                    <AnimatePresence>
                      {previews.length > 0 && (
                        <motion.div
                          className="inspiration-preview"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: EASE_SOFT }}
                          onClick={e => e.stopPropagation()}
                        >
                          {previews.map(p => (
                            <motion.div
                              key={p.id}           /* ← stable id, not index */
                              className="inspiration-chip"
                              {...chipVariant}
                            >
                              <img
                                src={p.preview}
                                alt=""
                                width={20}
                                height={20}
                                loading="lazy"
                              />
                              <span>
                                {p.name.length > 18
                                  ? `${p.name.slice(0, 15)}…`
                                  : p.name}
                              </span>
                              <button
                                type="button"
                                className="inspiration-chip-remove"
                                aria-label={`${t('contact.removeFile')} ${p.name}`}
                                onClick={() => removePreview(p.id)}
                              >
                                <X size={10} strokeWidth={2.5} />
                              </button>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>


                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={ACCEPT}
                      multiple
                      className="visually-hidden"
                      aria-hidden="true"
                      tabIndex={-1}
                      onChange={e => {
                        handleFiles(e.target.files);
                        e.target.value = ''; // allow re-selecting same file
                      }}
                    />
                  </div>
                  </motion.div>


              </form>
            </Form>
          </motion.div>


          {/* ── ACTIONS (outside card, linked via form="contactFormModern") ── */}
          <motion.div
            className="form-actions-row"
            variants={mv}
  initial="hidden"
  animate={sectionInView ? 'show' : 'hidden'}
  transition={{ duration: 0.6, delay: 0.52, ease: EASE_OUT }}
>
  <Button
    type="submit"
    form="contactFormModern"
    disabled={isPending}
    className={cn('btn-submit-modern', isSuccess && 'success')}
    aria-live="polite"
  >
    <AnimatePresence mode="wait">
      {isPending ? (
        <motion.span
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-label={t('contact.sending')}
        >
          <Loader2 className="btn-loader-svg size-4" aria-hidden="true" />
        </motion.span>
      ) : isSuccess ? (
        <motion.span
          key="sent"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-2"
        >
          <Check size={14} aria-hidden="true" />
          <span>{t('contact.sent')}</span>
        </motion.span>
      ) : (
        <motion.span
          key="idle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-2"
        >
          <span className="btn-text--desktop">{t('contact.submitDesktop')}</span>
          <span className="btn-text--mobile">{t('contact.submitMobile')}</span>
          <Send size={13} strokeWidth={2} aria-hidden="true" />
        </motion.span>
      )}
    </AnimatePresence>
  </Button>


  <AnimatePresence>
    {isSuccess && (
      <motion.div
        className="form-toast"
        role="status"
        aria-live="polite"
        initial={{ opacity: 0, y: 10, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.96 }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
      >
        <div className="form-toast__icon" aria-hidden="true">
          <Check size={10} strokeWidth={3} />
        </div>
        <div className="form-toast__body">
          <p className="form-toast__title">{t('contact.successTitle')}</p>
          <p className="form-toast__text">{t('contact.successDesc')}</p>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</motion.div>


          {/* ── SEPARATOR ── */}
          <div className="contact-lines" aria-hidden="true" />


          {/* ── INFO CARDS ── */}
          <motion.div
            ref={cardsRef}
            className="contact-info-grid"
            variants={staggerContainer}
            initial="hidden"
            animate={cardsInView ? 'show' : 'hidden'}
          >
            <div className="contact-info-grid__inner">
              {infoItems.map((item, i) => (
                <motion.a
                  key={i}
                  href={item.href}
                  className="contact-card"
                  variants={cardVariant}
                  whileHover={shouldReduceMotion ? {} : { y: -4 }}
                  whileTap={{ scale: 0.975 }}
                  aria-label={item.ariaLabel}
                  /* stagger delay via CSS --i variable */
                  style={{ '--i': i } as React.CSSProperties}
                >
                  <span className="contact-card__icon" aria-hidden="true">
                    <item.Icon size={16} strokeWidth={1.5} />
                  </span>
                  <span className="contact-card__value">{item.label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>


        </div>
      </main>
    </>
  );
};


export default Contact;
