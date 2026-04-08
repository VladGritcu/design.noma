import {
  useState, useEffect, useRef,
  useMemo, useCallback, useId,
} from 'react';
import { Helmet }       from 'react-helmet-async';
import { useLanguage }  from '../i18n/LanguageContext';
import { useForm }      from 'react-hook-form';
import { zodResolver }  from '@hookform/resolvers/zod';
import * as z           from 'zod';
import {
  motion, AnimatePresence, useInView, useReducedMotion,
} from 'framer-motion';
import {
  Check, Send, Phone, Mail, MapPin,
  Loader2, Image as ImageIcon, X,
} from 'lucide-react';
import { cn }       from '@/lib/utils';
import { Button }   from '@/components/ui/button';
import {
  Form, FormControl, FormField,
  FormItem, FormMessage,
} from '@/components/ui/form';
import { Input }    from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Toaster }  from '@/components/ui/sonner';
import { toast }    from 'sonner';
import SectionHeader from '../components/SectionHeader';
import LuxuryDivider from '../components/LuxuryDivider';
import './Contact.css';

import 'react-international-phone/style.css';
import { PhoneInput } from 'react-international-phone'; // [web:52][web:113]

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════════ */
const SITE_URL  = 'https://nomastudio.md';
const OG_IMAGE  = `${SITE_URL}/og-contact.jpg`;
const MAX_FILES = 5;
const ACCEPT    = 'image/*';

const FORM_FIELDS = ['name', 'email', 'phone', 'message'] as const;

/* ═══════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════ */
interface PreviewFile {
  id:      string;
  name:    string;
  preview: string;
  size:    number;
}

/* ═══════════════════════════════════════════════════════════════
   MOTION VARIANTS
═══════════════════════════════════════════════════════════════ */
const EASE_OUT  = [0.16, 1, 0.3,  1]       as const;
const EASE_SOFT = [0.25, 0.46, 0.45, 0.94] as const;
const EASE_SPR  = [0.22, 0.61, 0.36, 1]    as const;

const fadeUp = {
  hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
  show:   { opacity: 1, y: 0,  filter: 'blur(0px)' },
};

const noMotion = {
  hidden: { opacity: 1, y: 0, filter: 'blur(0px)' },
  show:   { opacity: 1, y: 0, filter: 'blur(0px)' },
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

const chipVariant = {
  initial: { opacity: 0, scale: 0.82 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.18, ease: EASE_SPR } },
  exit:    { opacity: 0, scale: 0.82, transition: { duration: 0.14 } },
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const Contact = () => {
  const { t, language }        = useLanguage();
  const shouldReduceMotion     = useReducedMotion();
  const progressId             = useId();

  const [isPending,  setIsPending]  = useState(false);
  const [isSuccess,  setIsSuccess]  = useState(false);
  const [progress,   setProgress]   = useState(0);
  const [previews,   setPreviews]   = useState<PreviewFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const sectionRef   = useRef<HTMLElement>(null);
  const cardsRef     = useRef<HTMLDivElement>(null);
  const successTimer = useRef<ReturnType<typeof setTimeout>>();

  const sectionInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const cardsInView   = useInView(cardsRef,   { once: true, margin: '-60px' });

  /* ── Schema ── */
  const formSchema = useMemo(() => z.object({
    name:    z.string().min(2,  { message: t('contact.nameError')    }),
    email:   z.string().email(  { message: t('contact.emailError')   }),
    // Telefon internațional (ex: +373..., +40..., etc.)
    phone:   z.string().min(6,  { message: t('contact.phoneError')   }),
    message: z.string().min(10, { message: t('contact.messageError') }).max(8000),
  }), [t]); // [web:49][web:52]

  type FormValues = z.infer<typeof formSchema>;

  /* ── Info cards ── */
  const infoItems = useMemo(() => [
    {
      Icon:  MapPin,
      label: t('contact.visitAddress'),
      href:  `https://maps.google.com/?q=${encodeURIComponent(t('contact.visitAddress'))}`,
      ariaLabel: `${t('contact.visitLabel')}: ${t('contact.visitAddress')}`,
    },
    {
      Icon:  Phone,
      label: t('contact.callInfo').split('\n')[0],
      href:  `tel:${t('contact.callInfo').split('\n')[0].replace(/[\s()]/g, '')}`,
      ariaLabel: `${t('contact.callLabel')}: ${t('contact.callInfo').split('\n')[0]}`,
    },
    {
      Icon:  Mail,
      label: t('contact.writeInfo').split('\n')[0],
      href:  `mailto:${t('contact.writeInfo').split('\n')[0]}`,
      ariaLabel: `${t('contact.writeLabel')}: ${t('contact.writeInfo').split('\n')[0]}`,
    },
  ], [t]);

  /* ── Form ── */
  const form = useForm<FormValues>({
    resolver:      zodResolver(formSchema),
    defaultValues: { name: '', email: '', phone: '', message: '' },
    mode:          'onBlur',
  });

  const { errors }    = form.formState;
  const watchedValues = form.watch();

  /* ── Progress live ── */
  useEffect(() => {
    const filled = FORM_FIELDS.filter(f => {
      const v = watchedValues[f];
      return v && v.length > 0 && !errors[f];
    }).length;
    setProgress((filled / FORM_FIELDS.length) * 100);
  }, [watchedValues, errors]);

  /* ── Cleanup ── */
  useEffect(() => {
    return () => {
      previews.forEach(p => URL.revokeObjectURL(p.preview));
      if (successTimer.current) clearTimeout(successTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── File handler ── */
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
        id:      crypto.randomUUID(),
        name:    f.name,
        preview: URL.createObjectURL(f),
        size:    f.size,
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

  /* ── Drag & Drop ── */
  const onDragOver  = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true);  }, []);
  const onDragLeave = useCallback(() => setIsDragging(false), []);
  const onDrop      = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  /* ── Submit ── */
  const onSubmit = useCallback(async (_data: FormValues) => {
    setIsPending(true);
    try {
      await new Promise(r => setTimeout(r, 1800));
      setIsPending(false);
      setIsSuccess(true);
      form.reset();
      setPreviews(prev => { prev.forEach(p => URL.revokeObjectURL(p.preview)); return []; });
      setProgress(0);
      successTimer.current = setTimeout(() => setIsSuccess(false), 6000);
    } catch {
      setIsPending(false);
      toast.error(t('contact.errorTitle') ?? 'Error', {
        description: t('contact.errorDesc') ?? 'Something went wrong.',
      });
    }
  }, [form, t]);

  /* ── SEO Schema ── */
  const schemaData = useMemo(() => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type':  'ContactPage',
        '@id':    `${SITE_URL}/contact/#webpage`,
        url:      `${SITE_URL}/contact`,
        name:     'Contact — NOMA Studio',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: t('nav.home'),    item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: t('nav.contact'), item: `${SITE_URL}/contact` },
          ],
        },
      },
      {
        '@type':     'LocalBusiness',
        '@id':       `${SITE_URL}/#business`,
        name:        'NOMA Studio',
        url:         SITE_URL,
        image:       OG_IMAGE,
        description: t('footer.contactDesc'),
        address: {
          '@type':         'PostalAddress',
          streetAddress:   'Strada Designului 24',
          addressLocality: 'Chișinău',
          addressCountry:  'MD',
        },
        openingHoursSpecification: [{
          '@type':   'OpeningHoursSpecification',
          dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
          opens:  '09:00',
          closes: '18:00',
        }],
        priceRange: '€€€',
      },
    ],
  }), [t, language]);

  const mv = shouldReduceMotion ? noMotion : fadeUp;

  /* ═════════════════════════════════════════
      RENDER
  ═════════════════════════════════════════ */
  return (
    <>
      <Helmet>
        <title>{t('nav.contact')} — NOMA Studio | Design Interior Chișinău</title>
        <meta name="description"        content={t('footer.contactDesc')} />
        <meta name="robots"             content="index, follow" />
        <link rel="canonical"           href={`${SITE_URL}/contact`} />
        <meta property="og:type"        content="website" />
        <meta property="og:title"       content={`${t('nav.contact')} — NOMA Studio`} />
        <meta property="og:description" content={t('footer.contactDesc')} />
        <meta property="og:image"       content={OG_IMAGE} />
        <meta property="og:url"         content={`${SITE_URL}/contact`} />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <Toaster position="top-center" richColors />

      {/* ══════════════ SECTION ══════════════ */}
      <main
        ref={sectionRef}
        className="contact-section-modern"
        role="main"
        aria-label={t('nav.contact')}
        id="main-content"
      >
        <div className="contact-content">

          {/* ── HEADER — Stil Standard Luxury ── */}
          <SectionHeader 
            title={t('contact.pageTitle')}
          />

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
                transition={{ duration: 0.6, ease: EASE_SPR }}
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

                {/* 1. NUME */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <motion.div
                      variants={mv}
                      initial="hidden"
                      animate={sectionInView ? 'show' : 'hidden'}
                      transition={{ duration: 0.48, delay: 0.22, ease: EASE_OUT }}
                    >
                      <FormItem className="form-field-modern" aria-label="client name">
                        <span className="visually-hidden">{t('contact.nameLabel')}</span>
                        <FormControl>
                          <Input
                            placeholder={t('contact.namePlaceholder')}
                            className={cn('form-input-modern', errors.name && 'error')}
                            autoComplete="name"
                            aria-required="true"
                            aria-invalid={!!errors.name}
                            {...field}
                          />
                        </FormControl>
                        <AnimatePresence mode="wait">
                          {errors.name && (
                            <motion.div
                              key="err-name"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: EASE_SOFT }}
                            >
                              <FormMessage className="form-error-message" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </FormItem>
                    </motion.div>
                  )}
                />

                {/* 2. EMAIL */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <motion.div
                      variants={mv}
                      initial="hidden"
                      animate={sectionInView ? 'show' : 'hidden'}
                      transition={{ duration: 0.48, delay: 0.28, ease: EASE_OUT }}
                    >
                      <FormItem className="form-field-modern" aria-label="client email">
                        <span className="visually-hidden">{t('contact.emailLabel')}</span>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={t('contact.emailPlaceholder')}
                            className={cn('form-input-modern', errors.email && 'error')}
                            autoComplete="email"
                            aria-required="true"
                            aria-invalid={!!errors.email}
                            {...field}
                          />
                        </FormControl>
                        <AnimatePresence mode="wait">
                          {errors.email && (
                            <motion.div
                              key="err-email"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: EASE_SOFT }}
                            >
                              <FormMessage className="form-error-message" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </FormItem>
                    </motion.div>
                  )}
                />

                {/* 3. TELEFON (international phone input) */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <motion.div
                      variants={mv}
                      initial="hidden"
                      animate={sectionInView ? 'show' : 'hidden'}
                      transition={{ duration: 0.48, delay: 0.34, ease: EASE_OUT }}
                    >
                      <FormItem className="form-field-modern" aria-label="client phone">
                        <label htmlFor="client_phone" className="visually-hidden">
                          {t('contact.phoneLabel')}
                        </label>
                        <FormControl>
                          <PhoneInput
                            defaultCountry="md"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            name="phone"
                            inputProps={{
                              id: 'client_phone',
                              autoComplete: 'tel',
                              inputMode: 'tel',
                              'aria-required': true,
                              'aria-invalid': !!errors.phone,
                              placeholder: t('contact.phonePlaceholder'),
                            }}
                            className={cn(
                              'phone-intl-modern',
                              errors.phone && 'phone-intl-modern--error',
                            )}
                          />
                        </FormControl>
                        <AnimatePresence mode="wait">
                          {errors.phone && (
                            <motion.div
                              key="err-phone"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: EASE_SOFT }}
                            >
                              <FormMessage className="form-error-message" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </FormItem>
                    </motion.div>
                  )}
                />

                {/* 4. VIZIUNEA PROIECTULUI */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <motion.div
                      variants={mv}
                      initial="hidden"
                      animate={sectionInView ? 'show' : 'hidden'}
                      transition={{ duration: 0.48, delay: 0.40, ease: EASE_OUT }}
                    >
                      <FormItem
                        className="form-field-modern form-field-modern--textarea"
                        aria-label="project vision"
                      >
                        <label htmlFor="project_vision" className="visually-hidden">
                          {t('contact.messageLabel')}
                        </label>
                        <FormControl>
                          <Textarea
                            id="project_vision"
                            placeholder={t('contact.messagePlaceholder')}
                            className={cn('form-textarea-modern', errors.message && 'error')}
                            rows={4}
                            spellCheck
                            maxLength={8000}
                            aria-required="true"
                            aria-invalid={!!errors.message}
                            {...field}
                          />
                        </FormControl>
                        <AnimatePresence mode="wait">
                          {errors.message && (
                            <motion.div
                              key="err-message"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: EASE_SOFT }}
                            >
                              <FormMessage className="form-error-message" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </FormItem>
                    </motion.div>
                  )}
                />

                {/* 5. UPLOAD INSPIRAȚIE */}
                <motion.div
                  variants={mv}
                  initial="hidden"
                  animate={sectionInView ? 'show' : 'hidden'}
                  transition={{ duration: 0.5, delay: 0.46, ease: EASE_OUT }}
                >
                  <div className="form-field-modern" aria-label="inspiration upload" role="group">
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
                                key={p.id}
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
                                  {p.name.length > 18 ? `${p.name.slice(0, 15)}…` : p.name}
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
                          e.target.value = '';
                        }}
                      />
                    </div>
                  </div>
                </motion.div>

              </form>
            </Form>
          </motion.div>

          {/* ── ACTIONS — în afara card-ului, legate via form="contactFormModern" ── */}
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
                    <Loader2 className="btn-loader-svg" size={16} aria-hidden="true" />
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

            {/* Toast inline — pill, identic cu inspirația */}
            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  className="form-toast"
                  role="status"
                  aria-live="polite"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.26, ease: EASE_OUT }}
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

          {/* ── SEPARATOR — Stil Standard Luxury ── */}
          <LuxuryDivider delay={0.2} />

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
                  whileHover={shouldReduceMotion ? {} : { y: -2 }}
                  whileTap={{ scale: 0.975 }}
                  aria-label={item.ariaLabel}
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