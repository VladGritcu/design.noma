import {
  useState, useEffect, useRef,
  useMemo, useCallback,
} from 'react';
import { useLanguage }  from '../i18n/LanguageContext';
import { useForm }      from 'react-hook-form';
import { zodResolver }  from '@hookform/resolvers/zod';
import * as z           from 'zod';
import {
  motion, AnimatePresence, useInView, useReducedMotion,
} from 'framer-motion';
import {
  Check, Send, Phone, Mail, MapPin,
  Loader2,
} from 'lucide-react';
import { cn }       from '@/lib/utils';
import { Button }   from '@/components/ui/button';
import {
  Form, FormControl, FormField,
  FormItem, FormMessage,
} from '@/components/ui/form';
import { Input }    from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast }    from 'sonner';
import './HomeContactForm.css';

const FORM_FIELDS = ['name', 'email', 'phone', 'message'] as const;

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  show:   { opacity: 1, y: 0,  filter: 'blur(0px)' },
};

const HomeContactForm = () => {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [progress, setProgress] = useState(0);

  const formSchema = useMemo(() => z.object({
    name:    z.string().min(2,  { message: t('contact.nameError') }),
    email:   z.string().email( { message: t('contact.emailError') }),
    phone:   z.string().min(8,  { message: t('contact.phoneError') }),
    message: z.string().min(10, { message: t('contact.messageError') }).max(8000),
  }), [t]);

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver:      zodResolver(formSchema),
    defaultValues: { name: '', email: '', phone: '', message: '' },
    mode:          'onBlur',
  });

  const { errors } = form.formState;
  const watchedValues = form.watch();

  useEffect(() => {
    const filled = FORM_FIELDS.filter(f => {
      const v = watchedValues[f];
      return v && v.length > 0 && !errors[f];
    }).length;
    setProgress((filled / FORM_FIELDS.length) * 100);
  }, [watchedValues, errors]);

  const onSubmit = useCallback(async (_data: FormValues) => {
    setIsPending(true);
    try {
      await new Promise(r => setTimeout(r, 1800));
      setIsPending(false);
      setIsSuccess(true);
      toast.success(t('contact.successTitle'));
      form.reset();
      setProgress(0);
      setTimeout(() => setIsSuccess(false), 6000);
    } catch {
      setIsPending(false);
      toast.error(t('contact.errorTitle'));
    }
  }, [form, t]);

  const mv = shouldReduceMotion ? { hidden: { opacity: 1 }, show: { opacity: 1 } } : fadeUp;

  return (
    <section ref={sectionRef} className="home-contact-modern" id="home-contact">
      <div className="home-contact-container">
        
        {/* Editorial Info Column */}
        <motion.div 
          className="contact-editorial"
          variants={mv}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          transition={{ duration: 0.8, ease: EASE_OUT }}
        >
          <span className="editorial-eyebrow">{t('nav.contact')}</span>
          <h2 className="editorial-title">
            Let's <span className="text-highlight">Collaborate</span> On Your Vision
          </h2>
          <p className="editorial-text">
            {t('footer.contactDesc')}
          </p>

          <div className="editorial-details">
            <div className="detail-item">
              <MapPin size={18} className="detail-icon" />
              <span>Strada Designului 24, Chișinău</span>
            </div>
            <div className="detail-item">
              <Phone size={18} className="detail-icon" />
              <span>+373 60 000 000</span>
            </div>
            <div className="detail-item">
              <Mail size={18} className="detail-icon" />
              <span>hello@nomastudio.md</span>
            </div>
          </div>
        </motion.div>

        {/* Luxury Form Column */}
        <motion.div 
          className="contact-form-luxury"
          variants={mv}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT }}
        >
          <div className="form-luxury-inner">
            <div className="form-progress-subtle">
              <motion.div 
                className="form-progress-bar"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="luxury-form-rows">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="luxury-field">
                      <FormControl>
                        <Input placeholder={t('contact.namePlaceholder')} className={cn('luxury-input', errors.name && 'error')} {...field} />
                      </FormControl>
                      <FormMessage className="luxury-error" />
                    </FormItem>
                  )}
                />

                <div className="luxury-row-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="luxury-field">
                        <FormControl>
                          <Input type="email" placeholder={t('contact.emailPlaceholder')} className={cn('luxury-input', errors.email && 'error')} {...field} />
                        </FormControl>
                        <FormMessage className="luxury-error" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="luxury-field">
                        <FormControl>
                          <Input type="tel" placeholder={t('contact.phonePlaceholder')} className={cn('luxury-input', errors.phone && 'error')} {...field} />
                        </FormControl>
                        <FormMessage className="luxury-error" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="luxury-field">
                      <FormControl>
                        <Textarea placeholder={t('contact.messagePlaceholder')} className={cn('luxury-textarea', errors.message && 'error')} rows={4} {...field} />
                      </FormControl>
                      <FormMessage className="luxury-error" />
                    </FormItem>
                  )}
                />

                <div className="luxury-actions">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className={cn('luxury-button', isSuccess && 'success')}
                  >
                    <AnimatePresence mode="wait">
                      {isPending ? (
                        <motion.span key="loading"><Loader2 className="animate-spin size-4" /></motion.span>
                      ) : isSuccess ? (
                        <motion.span key="sent" className="flex items-center gap-2"><Check size={16} /> {t('contact.sent')}</motion.span>
                      ) : (
                        <motion.span key="idle" className="flex items-center gap-2">{t('contact.submitDesktop')} <Send size={14} /></motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HomeContactForm;
