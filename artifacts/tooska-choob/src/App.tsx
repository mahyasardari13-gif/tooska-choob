import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Toaster, toast } from 'sonner';
import {
  Menu, X, Phone, Mail, MapPin, ChevronDown, CheckCircle2,
  Clock, CalendarDays, ArrowDown, Map, ShieldCheck, Wrench,
  HeadphonesIcon, DraftingCompass, Ruler, ArrowUp,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { SiInstagram, SiTelegram } from 'react-icons/si';

// ─── Images ───────────────────────────────────────────────────────────
import heroImg    from "../attached_assets/generated_images/hero.jpg";
import sKitchen  from "../attached_assets/generated_images/service_kitchen.jpg";
import sDoor     from "../attached_assets/generated_images/service_door.jpg";
import sTvwall   from "../attached_assets/generated_images/service_tvwall.jpg";
import sWardrobe from "../attached_assets/generated_images/service_wardrobe.jpg";
import sDecor    from "../attached_assets/generated_images/service_decor.jpg";
import sPartition from "../attached_assets/generated_images/service_partition.jpg";
import p1 from "../attached_assets/generated_images/portfolio_1.jpg";
import p2 from "../attached_assets/generated_images/portfolio_2.jpg";
import p3 from "../attached_assets/generated_images/portfolio_3.jpg";
import p5 from "../attached_assets/generated_images/portfolio_5.jpg";

// ─── Form Schema ──────────────────────────────────────────────────────
const contactSchema = z.object({
  name:    z.string().min(2,  'نام باید حداقل ۲ حرف داشته باشد'),
  phone:   z.string()
             .min(11, 'شماره تماس باید ۱۱ رقم باشد')
             .max(11, 'شماره تماس باید ۱۱ رقم باشد')
             .regex(/^09\d{9}$/, 'فرمت شماره تماس صحیح نیست (مثال: ۰۹۱۲۱۲۳۴۵۶۷)'),
  email:   z.string().email('آدرس ایمیل معتبر نیست').optional().or(z.literal('')),
  service: z.string().min(1, 'لطفاً نوع خدمت مورد نظر را انتخاب کنید'),
  message: z.string().min(10, 'پیام باید حداقل ۱۰ حرف داشته باشد'),
});
type ContactFormValues = z.infer<typeof contactSchema>;

// ─── Data ─────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'خانه',        href: '#home',      id: 'home'      },
  { label: 'خدمات',       href: '#services',  id: 'services'  },
  { label: 'چرا توسکا چوب', href: '#why-us', id: 'why-us'    },
  { label: 'فرآیند',      href: '#process',   id: 'process'   },
  { label: 'نمونه کارها', href: '#portfolio', id: 'portfolio' },
  { label: 'مشتریان',     href: '#clients',   id: 'clients'   },
  { label: 'تماس با ما',  href: '#contact',   id: 'contact'   },
];

const SERVICES = [
  { title: 'کابینت و طراحی آشپزخانه', desc: 'طراحی و اجرای کامل آشپزخانه با متریال درجه یک و سبک‌های مدرن، کلاسیک و نئوکلاسیک.', img: sKitchen,  span: 'col-span-1 md:col-span-2' },
  { title: 'کمد و فضاهای ذخیره‌سازی', desc: 'راهکارهای هوشمند ذخیره‌سازی با طراحی سفارشی متناسب با معماری فضا.', img: sWardrobe, span: 'col-span-1' },
  { title: 'تی وی وال و دیوارپوش',    desc: 'طراحی نقاط کانونی و دیوارهای دکوراتیو برای فضاهای نشیمن و مدیریتی.', img: sTvwall,   span: 'col-span-1' },
  { title: 'دکوراسیون داخلی کامل',    desc: 'اجرای جامع و یکپارچه دکوراسیون فضاهای مسکونی، اداری و تجاری از صفر تا تحویل.', img: sDecor,    span: 'col-span-1 md:col-span-2' },
  { title: 'انواع درب و بازشوها',      desc: 'طراحی و نصب انواع درب داخلی و خارجی در سبک‌های مختلف با متریال و رنگ‌بندی دلخواه.', img: sDoor,     span: 'col-span-1 md:col-span-2' },
  { title: 'پارتیشن و جداسازی فضا',   desc: 'تفکیک هوشمند فضاها با پارتیشن‌های اداری و مسکونی با طراحی خلاقانه.',              img: sPartition, span: 'col-span-1' },
];

const FEATURES = [
  { icon: <ShieldCheck    size={22} />, title: 'بیش از ۳۲ سال تجربه'               },
  { icon: <Map            size={22} />, title: 'اجرای پروژه در سراسر ایران'        },
  { icon: <DraftingCompass size={22}/>, title: 'طراحی سه بعدی'                     },
  { icon: <HeadphonesIcon size={22} />, title: 'مشاوره تخصصی'                      },
  { icon: <Ruler          size={22} />, title: 'اندازه گیری در محل'                },
  { icon: <CheckCircle2   size={22} />, title: 'ضمانت کیفیت اجرا'                   },
  { icon: <Wrench         size={22} />, title: 'ضمانت نصب'                         },
  { icon: <Clock          size={22} />, title: 'خدمات پس از فروش'                  },
];

const PROCESS_STEPS = [
  { num: '۱', title: 'مشاوره',        desc: 'بررسی نیازها و ارائه راهکارهای اولیه تخصصی.' },
  { num: '۲', title: 'اندازه‌گیری',   desc: 'برداشت دقیق ابعاد فضا توسط تیم فنی.'        },
  { num: '۳', title: 'طراحی سه‌بعدی', desc: 'ارائه طرح ۳D پیش از شروع ساخت.'             },
  { num: '۴', title: 'تولید',         desc: 'ساخت قطعات در کارگاه مجهز توسکا چوب.'        },
  { num: '۵', title: 'نصب',           desc: 'اجرای تمیز و دقیق در محل پروژه.'             },
  { num: '۶', title: 'پشتیبانی',      desc: 'خدمات و گارانتی پس از تحویل نهایی.'          },
];

const PROJECTS = [
  { id: 1, img: p1, cat: 'کابینت',    span: 'md:col-span-2 md:row-span-2' },
  { id: 2, img: p2, cat: 'کمد',       span: 'md:col-span-1 md:row-span-1' },
  { id: 3, img: p3, cat: 'تی وی وال', span: 'md:col-span-1 md:row-span-1' },
  { id: 5, img: p5, cat: 'کابینت',    span: 'md:col-span-2 md:row-span-1' },
];

const CLIENTS = ['ASP', 'گنو', 'آلدوز آذربایجان', 'توسعه صنعتی ایران', 'آباد راهان'];

// ─── Helper Components ────────────────────────────────────────────────

const FadeIn = ({
  children, delay = 0, className = "", direction = "up"
}: {
  children: React.ReactNode; delay?: number; className?: string;
  direction?: "up" | "left" | "right" | "none";
}) => {
  const y = direction === "up" ? 36 : 0;
  const x = direction === "left" ? 36 : direction === "right" ? -36 : 0;
  return (
    <motion.div
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Counter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(value / 55) || 1;
    const delay = Math.max((2000 / value) * 2, 20);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else setCount(start);
    }, delay);
    return () => clearInterval(timer);
  }, [value, inView]);

  const toPersian = (n: number) =>
    n.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d]);

  return (
    <span ref={ref} dir="rtl" className="inline-block tabular-nums">
      {toPersian(count)}{suffix}
    </span>
  );
};

// ─── Loading Screen ───────────────────────────────────────────────────
const LoadingScreen = ({ onDone }: { onDone: () => void }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 1900);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      key="loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.75, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] bg-jet flex flex-col items-center justify-center"
      aria-hidden="true"
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-center select-none"
      >
        <h1 className="text-5xl md:text-7xl font-black text-sand tracking-tight mb-1.5">
          توسکا چوب
        </h1>
        <p className="text-fog text-[10px] tracking-[0.35em] mb-12 uppercase">
          از سال ۱۳۷۳
        </p>
        {/* Animated progress bar */}
        <div className="w-44 h-[1.5px] bg-ash mx-auto overflow-hidden">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="h-full w-full bg-walnut"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Scroll To Top ────────────────────────────────────────────────────
const ScrollToTop = ({ visible }: { visible: boolean }) => (
  <AnimatePresence>
    {visible && (
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="بازگشت به بالای صفحه"
        className="scroll-top-btn fixed bottom-6 right-6 z-[60] w-11 h-11 bg-walnut text-jet flex items-center justify-center hover:bg-copper hover:scale-110 shadow-lg shadow-walnut/20"
      >
        <ArrowUp size={20} strokeWidth={2.5} />
      </motion.button>
    )}
  </AnimatePresence>
);

// ─── Main App ─────────────────────────────────────────────────────────
export default function App() {
  const [isLoading,      setIsLoading]      = useState(true);
  const [isScrolled,     setIsScrolled]     = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFilter,   setActiveFilter]   = useState('همه');
  const [activeSection,  setActiveSection]  = useState('home');
  const [showScrollTop,  setShowScrollTop]  = useState(false);
  const [lightboxIndex,  setLightboxIndex]  = useState<number | null>(null);

  const { scrollY } = useScroll();
  const heroY       = useTransform(scrollY, [0, 900], [0, 220]);
  const heroOpacity = useTransform(scrollY, [0, 700], [1, 0]);

  const filteredProjects = activeFilter === 'همه'
    ? PROJECTS
    : PROJECTS.filter(p => p.cat === activeFilter);

  // RTL conventions: left key → advances forward, right key → goes back
  const lightboxPrev = useCallback(() => {
    setLightboxIndex(i => i !== null ? (i - 1 + filteredProjects.length) % filteredProjects.length : null);
  }, [filteredProjects.length]);

  const lightboxNext = useCallback(() => {
    setLightboxIndex(i => i !== null ? (i + 1) % filteredProjects.length : null);
  }, [filteredProjects.length]);

  // ── Lifecycle effects ──────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.dir  = 'rtl';
    document.documentElement.lang = 'fa';
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 60);
      setShowScrollTop(y > 450);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Active section via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    NAV_LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  // Close lightbox when filter changes
  useEffect(() => { setLightboxIndex(null); }, [activeFilter]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     setLightboxIndex(null);
      if (e.key === 'ArrowLeft')  lightboxNext();
      if (e.key === 'ArrowRight') lightboxPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex, lightboxNext, lightboxPrev]);

  // Lock body scroll when lightbox or mobile menu is open
  useEffect(() => {
    document.body.style.overflow = (lightboxIndex !== null || mobileMenuOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIndex, mobileMenuOpen]);

  // ── Form ──────────────────────────────────────────────────────────
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (_data: ContactFormValues) => {
    await new Promise(r => setTimeout(r, 1400));
    toast.success('درخواست شما ثبت شد', {
      description: 'کارشناسان توسکا چوب در اسرع وقت با شما تماس خواهند گرفت.',
      duration: 5000,
    });
    reset();
  };

  // ── Smooth scroll helper ──────────────────────────────────────────
  const smoothScrollTo = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const id = href.replace('#', '');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileMenuOpen(false);
  };

  // ── Render ────────────────────────────────────────────────────────
  return (
    <>
      <Toaster
        position="bottom-center"
        dir="rtl"
        toastOptions={{
          style: {
            background: '#1a1a0e',
            border: '1px solid rgba(184,134,78,0.35)',
            color: '#f2ede7',
            fontFamily: 'Vazirmatn, sans-serif',
          },
        }}
      />

      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && <LoadingScreen onDone={() => setIsLoading(false)} />}
      </AnimatePresence>

      {/* Scroll To Top */}
      <ScrollToTop visible={showScrollTop} />

      {/* ── Floating Action Buttons ── */}
      <div className="fixed bottom-6 left-6 z-[60] flex flex-col gap-3">
        {/* Instagram — coming soon */}
        <button
          aria-label="اینستاگرام توسکا چوب (به زودی)"
          onClick={() => toast('اینستاگرام به‌زودی فعال می‌شود', { duration: 3500 })}
          className="w-11 h-11 rounded-full bg-jet/80 border border-ash flex items-center justify-center text-fog hover:text-sand hover:border-sand/40 transition-all duration-300"
        >
          <SiInstagram size={19} />
        </button>

        {/* Telegram */}
        <a
          href="https://t.me/tooska_chob"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="تلگرام توسکا چوب"
          className="w-11 h-11 rounded-full bg-[#2AABEE] flex items-center justify-center text-white
                     shadow-[0_4px_18px_rgba(42,171,238,0.22)] hover:scale-110 hover:shadow-[0_6px_24px_rgba(42,171,238,0.35)]
                     transition-all duration-300"
        >
          <SiTelegram size={22} />
        </a>
      </div>

      {/* ── Navbar ── */}
      <nav
        role="navigation"
        aria-label="ناوبر اصلی"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
          isScrolled ? 'glass py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <a href="#home" onClick={smoothScrollTo('#home')} className="flex flex-col items-start group">
            <span className="text-2xl font-black text-walnut tracking-tight group-hover:text-copper transition-colors duration-300">
              توسکا چوب
            </span>
            <span className="text-fog text-[10px] tracking-widest uppercase">از ۱۳۷۳</span>
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <a
                key={link.id}
                href={link.href}
                onClick={smoothScrollTo(link.href)}
                className={`nav-link text-sm font-medium transition-colors duration-300 ${
                  activeSection === link.id ? 'text-walnut active' : 'text-sand/75 hover:text-walnut'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <a
            href="#contact"
            onClick={smoothScrollTo('#contact')}
            className="btn-primary hidden lg:inline-flex px-6 py-2.5 text-sm"
          >
            مشاوره رایگان
          </a>

          <button
            className="lg:hidden text-sand hover:text-walnut transition-colors"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="باز کردن منو"
            aria-expanded={mobileMenuOpen}
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] bg-jet flex flex-col p-8"
            role="dialog"
            aria-modal="true"
            aria-label="منوی موبایل"
          >
            <div className="flex justify-between items-center mb-14">
              <div className="flex flex-col items-start">
                <span className="text-2xl font-black text-walnut">توسکا چوب</span>
                <span className="text-fog text-[10px] tracking-widest mt-1">از ۱۳۷۳</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="بستن منو"
                className="text-sand hover:text-walnut transition-colors p-1"
              >
                <X size={30} />
              </button>
            </div>
            <nav className="flex flex-col gap-0">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.id}
                  href={link.href}
                  onClick={smoothScrollTo(link.href)}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 + 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className={`text-xl font-medium border-b border-ash py-5 transition-colors ${
                    activeSection === link.id ? 'text-walnut' : 'text-sand hover:text-walnut'
                  }`}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
            <div className="mt-auto pt-10">
              <a
                href="#contact"
                onClick={smoothScrollTo('#contact')}
                className="btn-primary w-full py-4 text-base"
              >
                مشاوره رایگان
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* ══════════════════════════════════════
            HERO
        ══════════════════════════════════════ */}
        <section id="home" className="relative h-screen min-h-[700px] w-full flex flex-col justify-center overflow-hidden bg-jet">
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
            <img
              src={heroImg}
              alt="نمونه کار دکوراسیون داخلی توسکا چوب"
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-jet via-jet/70 to-jet/30" />
            <div className="absolute inset-0 bg-black/15 mix-blend-multiply" />
          </motion.div>

          <div className="container relative z-10 mx-auto px-6 lg:px-12 mt-20">
            <motion.div
              initial="hidden" animate="visible"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.18 } } }}
              className="max-w-4xl"
            >
              <motion.div
                variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } } }}
                className="mb-6"
              >
                <div className="inline-flex items-center border border-walnut/35 bg-jet/50 backdrop-blur-sm px-4 py-1.5 mb-7 text-sm text-sand gap-2">
                  <span className="text-walnut font-semibold">از سال ۱۳۷۳</span>
                  <span className="text-ash">|</span>
                  <span className="text-fog">بیش از ۳۲ سال تجربه</span>
                </div>
                <h1 className="text-6xl md:text-8xl lg:text-[118px] font-black leading-[1.05] text-sand">
                  توسکا چوب
                </h1>
              </motion.div>

              <motion.p
                variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } } }}
                className="text-lg md:text-2xl text-fog max-w-2xl leading-relaxed mb-10 font-light"
              >
                طراحی و اجرای کابینت، دکوراسیون داخلی، تی وی وال، کمد دیواری و درب های چوبی.
              </motion.p>

              <motion.div
                variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } } }}
                className="flex flex-wrap gap-4"
              >
                <a href="#contact" onClick={smoothScrollTo('#contact')} className="btn-primary px-10 py-4 text-lg">
                  مشاوره رایگان
                </a>
                <a href="#contact" onClick={smoothScrollTo('#contact')} className="btn-outline px-10 py-4 text-lg">
                  تماس با ما
                </a>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
          >
            <motion.div
              animate={{ y: [0, 9, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              className="text-walnut/70"
            >
              <ArrowDown size={22} strokeWidth={1.5} />
            </motion.div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════
            STATS BAR
        ══════════════════════════════════════ */}
        <section aria-label="آمار و ارقام" className="bg-charcoal border-y border-ash py-12 relative z-20">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-x-reverse md:divide-ash">
              {[
                { n: 32,  s: '+', l: 'سال تجربه'          },
                { n: 1000, s: '+', l: 'پروژه اجرا شده'    },
                { n: 6,   s: '',  l: 'نوع خدمت تخصصی'     },
                { n: 6,   s: '',  l: 'ماه ضمانت'           },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center justify-center text-center px-4">
                  <div className="text-4xl md:text-5xl font-black text-walnut mb-2">
                    <Counter value={stat.n} suffix={stat.s} />
                  </div>
                  <div className="text-sm text-fog font-medium">{stat.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            SERVICES
        ══════════════════════════════════════ */}
        <section id="services" className="py-24 md:py-32 bg-sand text-jet">
          <div className="container mx-auto px-6 lg:px-12">
            <FadeIn className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
              <span className="section-heading text-copper">خدمات توسکا چوب</span>
              <h2 className="text-3xl md:text-5xl font-black text-jet">تسلط بر طراحی و اجرای فضا</h2>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              {SERVICES.map((s, i) => (
                <FadeIn key={i} delay={i * 0.08} className={s.span}>
                  <div className="group relative h-[340px] md:h-[390px] overflow-hidden cursor-default">
                    <img
                      src={s.img}
                      alt={s.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-105"
                    />
                    {/* Always-visible label */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-jet/90 via-jet/50 to-transparent p-7 pt-14">
                      <h3 className="service-card-text text-xl font-bold text-sand group-hover:text-walnut transition-colors duration-400">
                        {s.title}
                      </h3>
                    </div>
                    {/* Hover overlay with description */}
                    <div className="service-card-overlay absolute inset-0 bg-jet/75 opacity-0 group-hover:opacity-100 flex items-end p-7">
                      <div>
                        <h3 className="text-xl font-bold text-walnut mb-2">{s.title}</h3>
                        <p className="service-card-desc text-sand/85 leading-relaxed text-sm">{s.desc}</p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            WHY US
        ══════════════════════════════════════ */}
        <section id="why-us" className="py-24 md:py-32 bg-jet border-t border-ash grain-bg relative">
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="flex flex-col lg:flex-row gap-16 items-center">

              {/* Content — full width, no image */}
              <div className="w-full">
                <FadeIn direction="left">
                  <span className="section-heading">چرا توسکا چوب؟</span>
                  <h2 className="text-3xl md:text-5xl font-black mb-7 leading-tight">
                    پشتوانه‌ای از اصالت<br />و تعهد به کیفیت
                  </h2>
                  <p className="text-fog text-lg leading-relaxed mb-12 max-w-xl">
                    ما معتقدیم کیفیت یک اتفاق نیست، بلکه حاصل سال‌ها تجربه، انتخاب متریال درجه یک و تعهد به خلق ارزش برای مشتریان است.
                  </p>
                </FadeIn>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
                  {FEATURES.map((feat, i) => (
                    <FadeIn key={i} delay={i * 0.07} direction="left">
                      <div className="flex items-start gap-4 group">
                        <div className="flex-shrink-0 text-walnut mt-0.5 group-hover:scale-110 transition-transform duration-300">
                          {feat.icon}
                        </div>
                        <h4 className="text-base font-medium text-sand group-hover:text-walnut transition-colors duration-300">
                          {feat.title}
                        </h4>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            PROCESS
        ══════════════════════════════════════ */}
        <section id="process" className="py-24 md:py-32 bg-linen text-jet">
          <div className="container mx-auto px-6 lg:px-12">
            <FadeIn className="text-center max-w-3xl mx-auto mb-24">
              <span className="section-heading text-copper">فرآیند انجام پروژه</span>
              <h2 className="text-3xl md:text-5xl font-black text-jet">مسیر تحقق یک ایده</h2>
            </FadeIn>

            <div className="relative">
              {/* Desktop connector line */}
              <div className="hidden lg:block absolute top-11 left-0 w-full h-[2px] bg-sand/70" aria-hidden="true" />

              <div className="flex flex-col lg:flex-row gap-12 lg:gap-4 justify-between">
                {PROCESS_STEPS.map((step, i) => (
                  <FadeIn key={i} delay={i * 0.09} className="relative flex-1 group">
                    {i !== PROCESS_STEPS.length - 1 && (
                      <div className="lg:hidden absolute top-11 right-11 w-[2px] h-[calc(100%+3rem)] bg-sand/60 -z-10" aria-hidden="true" />
                    )}
                    <div className="flex lg:flex-col gap-6 lg:gap-7 items-start lg:items-center text-right lg:text-center">
                      <div className={`process-step-circle w-22 h-22 min-w-[5.5rem] min-h-[5.5rem] rounded-full
                                       bg-linen border-[3px] border-sand flex items-center justify-center
                                       text-2xl font-black text-clay relative z-10
                                       group-hover:bg-walnut group-hover:border-walnut group-hover:text-jet`}>
                        {step.num}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold mb-2 text-jet group-hover:text-clay transition-colors duration-300">
                          {step.title}
                        </h4>
                        <p className="text-sm text-jet/65 leading-relaxed max-w-[180px] mx-auto">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            PORTFOLIO
        ══════════════════════════════════════ */}
        <section id="portfolio" className="py-24 md:py-32 bg-charcoal">
          <div className="container mx-auto px-6 lg:px-12">
            <FadeIn className="mb-14">
              <span className="section-heading">نمونه کارهای ما</span>
              <h2 className="text-3xl md:text-5xl font-black text-sand">تجلی زیبایی در اجرا</h2>
            </FadeIn>

            <motion.div layout className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[240px] md:auto-rows-[280px]">
              <AnimatePresence>
                {filteredProjects.map((p, idx) => (
                  <motion.div
                    layout
                    key={p.id}
                    initial={{ opacity: 0, scale: 0.93 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.93 }}
                    transition={{ duration: 0.38 }}
                    className={`portfolio-card relative overflow-hidden group cursor-pointer ${p.span}`}
                    onClick={() => setLightboxIndex(idx)}
                    role="button"
                    tabIndex={0}
                    aria-label={`مشاهده تصویر ${p.cat}`}
                    onKeyDown={e => e.key === 'Enter' && setLightboxIndex(idx)}
                  >
                    <img
                      src={p.img}
                      alt={`نمونه کار ${p.cat} توسکا چوب`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-[1.06]"
                    />
                    {/* Category badge */}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-jet/70 backdrop-blur-sm text-xs text-fog font-medium">
                      {p.cat}
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-jet/70 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col items-center justify-center gap-3 p-5 text-center">
                      <div className="w-10 h-10 rounded-full border border-walnut/60 flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-walnut">
                          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <span className="text-xs text-fog font-medium">به زودی اضافه می‌شود</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            CLIENTS
        ══════════════════════════════════════ */}
        <section id="clients" className="py-20 bg-jet border-t border-ash">
          <div className="container mx-auto px-6 lg:px-12">
            <FadeIn className="text-center mb-14">
              <h2 className="text-xs font-bold text-fog tracking-[0.3em] uppercase">اعتماد بهترین‌ها</h2>
            </FadeIn>

            <div
              role="list"
              aria-label="مشتریان توسکا چوب"
              className="flex flex-wrap justify-center items-center gap-x-10 gap-y-8 md:gap-x-20"
            >
              {CLIENTS.map((client, i) => (
                <FadeIn key={i} delay={i * 0.1} direction="up">
                  <div
                    role="listitem"
                    className="text-xl md:text-2xl font-black text-sand/80 hover:text-walnut transition-colors duration-400 cursor-default select-none"
                  >
                    {client}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            CONTACT
        ══════════════════════════════════════ */}
        <section id="contact" className="py-24 md:py-32 bg-sand text-jet">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="flex flex-col lg:flex-row gap-16">

              {/* Info Panel */}
              <FadeIn className="w-full lg:w-5/12" direction="right">
                <span className="section-heading text-copper">تماس با ما</span>
                <h2 className="text-3xl md:text-4xl font-black mb-10 leading-snug">
                  در مسیر خلق یک اثر،<br />همراه شما هستیم.
                </h2>

                <address className="not-italic space-y-7 text-jet/80">
                  <div className="flex gap-4 items-start group">
                    <MapPin className="text-walnut shrink-0 mt-1 group-hover:scale-110 transition-transform" size={22} />
                    <div>
                      <h3 className="font-bold text-jet mb-1">آدرس کارگاه</h3>
                      <p className="leading-relaxed text-sm">تهران، شهرک صنعتی قلعه میر،<br />کوچه گلبو، پلاک ۲۰</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start group">
                    <Phone className="text-walnut shrink-0 mt-1 group-hover:scale-110 transition-transform" size={22} />
                    <div>
                      <h3 className="font-bold text-jet mb-1">تلفن تماس</h3>
                      <a href="tel:+989121331602" className="block text-sm hover:text-walnut transition-colors" dir="ltr">
                        ۰۹۱۲ ۱۳۳ ۱۶۰۲
                      </a>
                      <a href="tel:+989123594953" className="block text-sm hover:text-walnut transition-colors mt-0.5" dir="ltr">
                        ۰۹۱۲ ۳۵۹ ۴۹۵۳
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start group">
                    <SiTelegram className="text-walnut shrink-0 mt-1 group-hover:scale-110 transition-transform" size={22} />
                    <div>
                      <h3 className="font-bold text-jet mb-1">تلگرام</h3>
                      <a href="https://t.me/tooska_chob" target="_blank" rel="noreferrer" className="text-sm hover:text-walnut transition-colors font-sans" dir="ltr">
                        @tooska_chob
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start group">
                    <Mail className="text-walnut shrink-0 mt-1 group-hover:scale-110 transition-transform" size={22} />
                    <div>
                      <h3 className="font-bold text-jet mb-1">ایمیل</h3>
                      <a href="mailto:tooskachoob12@gmail.com" className="text-sm hover:text-walnut transition-colors font-sans" dir="ltr">
                        tooskachoob12@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <CalendarDays className="text-walnut shrink-0 mt-1" size={22} />
                    <div>
                      <h3 className="font-bold text-jet mb-2">ساعات کاری</h3>
                      <dl className="space-y-1 text-sm">
                        <div className="flex justify-between gap-8">
                          <dt>شنبه تا چهارشنبه</dt><dd className="font-medium">۸ صبح – ۹ شب</dd>
                        </div>
                        <div className="flex justify-between gap-8">
                          <dt>پنجشنبه</dt><dd className="font-medium">۸ صبح – ۲ ظهر</dd>
                        </div>
                        <div className="flex justify-between gap-8 text-clay font-semibold">
                          <dt>جمعه</dt><dd>تعطیل</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </address>
              </FadeIn>

              {/* Contact Form */}
              <FadeIn className="w-full lg:w-7/12" direction="left">
                <div className="bg-white p-8 md:p-12 shadow-xl shadow-jet/5 border border-linen">
                  <h2 className="text-2xl font-bold mb-8 text-jet">ارسال درخواست مشاوره</h2>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label htmlFor="name" className="block text-sm font-medium text-jet/70">
                          نام و نام خانوادگی <span className="text-red-600" aria-hidden>*</span>
                        </label>
                        <input
                          id="name"
                          {...register('name')}
                          placeholder="علی رضایی"
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? 'name-error' : undefined}
                          className="form-input w-full bg-sand border-none focus:ring-2 focus:ring-walnut px-4 py-3 outline-none"
                        />
                        {errors.name && (
                          <p id="name-error" role="alert" className="text-xs text-red-600 font-medium">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="phone" className="block text-sm font-medium text-jet/70">
                          شماره تماس <span className="text-red-600" aria-hidden>*</span>
                        </label>
                        <input
                          id="phone"
                          {...register('phone')}
                          dir="ltr"
                          placeholder="09121234567"
                          inputMode="tel"
                          aria-invalid={!!errors.phone}
                          aria-describedby={errors.phone ? 'phone-error' : undefined}
                          className="form-input w-full bg-sand border-none focus:ring-2 focus:ring-walnut px-4 py-3 outline-none text-right font-sans"
                        />
                        {errors.phone && (
                          <p id="phone-error" role="alert" className="text-xs text-red-600 font-medium">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label htmlFor="email" className="block text-sm font-medium text-jet/70">
                          ایمیل <span className="text-fog text-xs">(اختیاری)</span>
                        </label>
                        <input
                          id="email"
                          {...register('email')}
                          dir="ltr"
                          type="email"
                          placeholder="example@gmail.com"
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? 'email-error' : undefined}
                          className="form-input w-full bg-sand border-none focus:ring-2 focus:ring-walnut px-4 py-3 outline-none text-right font-sans"
                        />
                        {errors.email && (
                          <p id="email-error" role="alert" className="text-xs text-red-600 font-medium">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="service" className="block text-sm font-medium text-jet/70">
                          نوع خدمت <span className="text-red-600" aria-hidden>*</span>
                        </label>
                        <select
                          id="service"
                          {...register('service')}
                          aria-invalid={!!errors.service}
                          aria-describedby={errors.service ? 'service-error' : undefined}
                          className="form-input w-full bg-sand border-none focus:ring-2 focus:ring-walnut px-4 py-3 outline-none appearance-none"
                        >
                          <option value="">انتخاب کنید...</option>
                          <option>کابینت آشپزخانه</option>
                          <option>کمد دیواری</option>
                          <option>تی وی وال</option>
                          <option>دکوراسیون داخلی</option>
                          <option>درب های چوبی</option>
                          <option>پارتیشن</option>
                        </select>
                        {errors.service && (
                          <p id="service-error" role="alert" className="text-xs text-red-600 font-medium">
                            {errors.service.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="message" className="block text-sm font-medium text-jet/70">
                        پیام / توضیحات <span className="text-red-600" aria-hidden>*</span>
                      </label>
                      <textarea
                        id="message"
                        {...register('message')}
                        rows={4}
                        placeholder="توضیح کوتاهی درباره پروژه مورد نظر بنویسید..."
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? 'message-error' : undefined}
                        className="form-input w-full bg-sand border-none focus:ring-2 focus:ring-walnut px-4 py-3 outline-none resize-none"
                      />
                      {errors.message && (
                        <p id="message-error" role="alert" className="text-xs text-red-600 font-medium">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full py-4 text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                          </svg>
                          در حال ارسال...
                        </span>
                      ) : 'ارسال درخواست'}
                    </button>
                  </form>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
      </main>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="bg-jet pt-20 border-t border-ash text-sand">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

            {/* Brand */}
            <div className="space-y-5">
              <div>
                <h3 className="text-2xl font-black text-walnut mb-0.5">توسکا چوب</h3>
                <p className="text-fog text-xs uppercase tracking-widest">از سال ۱۳۷۳</p>
              </div>
              <p className="text-sm text-fog leading-relaxed">
                طراحی و اجرای کامل فضاهای مسکونی و اداری با بیش از ۳۲ سال سابقه درخشان در دکوراسیون داخلی ایران.
              </p>
              <div>
                <p className="text-xs text-fog mb-3 font-medium">شبکه‌های اجتماعی</p>
                <div className="flex gap-3">
                  <a
                    href="https://t.me/tooska_chob"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="تلگرام توسکا چوب"
                    className="w-9 h-9 bg-ash flex items-center justify-center text-fog hover:bg-walnut hover:text-jet transition-all duration-300"
                  >
                    <SiTelegram size={16} />
                  </a>
                  <button
                    aria-label="اینستاگرام توسکا چوب (به زودی)"
                    onClick={() => toast('اینستاگرام به‌زودی فعال می‌شود', { duration: 3500 })}
                    className="w-9 h-9 bg-ash flex items-center justify-center text-fog hover:bg-walnut hover:text-jet transition-all duration-300"
                  >
                    <SiInstagram size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-sm font-bold mb-5 text-sand uppercase tracking-wider">خدمات ما</h4>
              <ul className="space-y-3">
                {SERVICES.map(s => (
                  <li key={s.title}>
                    <a
                      href="#services"
                      onClick={smoothScrollTo('#services')}
                      className="text-sm text-fog hover:text-walnut transition-colors duration-300"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="text-sm font-bold mb-5 text-sand uppercase tracking-wider">لینک‌های سریع</h4>
              <ul className="space-y-3">
                {NAV_LINKS.map(l => (
                  <li key={l.id}>
                    <a
                      href={l.href}
                      onClick={smoothScrollTo(l.href)}
                      className="text-sm text-fog hover:text-walnut transition-colors duration-300"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hours + contact */}
            <div>
              <h4 className="text-sm font-bold mb-5 text-sand uppercase tracking-wider">اطلاعات تماس</h4>
              <ul className="space-y-4 text-sm text-fog">
                <li>
                  <p className="text-sand font-medium mb-1">ساعات کاری</p>
                  <p>شنبه – چهارشنبه: ۸ تا ۲۱</p>
                  <p>پنجشنبه: ۸ تا ۱۴</p>
                </li>
                <li className="pt-2 border-t border-ash">
                  <a href="tel:+989121331602" className="hover:text-walnut transition-colors font-sans" dir="ltr">
                    0912 133 1602
                  </a>
                </li>
                <li>
                  <a href="tel:+989123594953" className="hover:text-walnut transition-colors font-sans" dir="ltr">
                    0912 359 4953
                  </a>
                </li>
                <li>
                  <a href="mailto:tooskachoob12@gmail.com" className="hover:text-walnut transition-colors text-xs font-sans" dir="ltr">
                    tooskachoob12@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-ash py-6">
          <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs text-fog">
              &copy; ۱۴۰۴ توسکا چوب. تمامی حقوق محفوظ است.
            </p>
            <div className="flex gap-6 text-xs text-fog">
              <a href="#" className="hover:text-sand transition-colors">حریم خصوصی</a>
              <a href="#" className="hover:text-sand transition-colors">شرایط استفاده</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════
          LIGHTBOX
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] bg-jet/96 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
            onClick={() => setLightboxIndex(null)}
            role="dialog"
            aria-modal="true"
            aria-label="نمایش تصویر بزرگ"
          >
            {/* Close */}
            <button
              className="lightbox-btn absolute top-5 right-5 z-[210] w-10 h-10 bg-ash/60 flex items-center justify-center text-sand"
              onClick={() => setLightboxIndex(null)}
              aria-label="بستن"
            >
              <X size={22} strokeWidth={1.8} />
            </button>

            {/* Counter badge */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 text-xs text-fog bg-ash/50 px-3 py-1 select-none" dir="ltr">
              {lightboxIndex + 1} / {filteredProjects.length}
            </div>

            {/* Prev (right side in RTL) */}
            <button
              className="lightbox-btn absolute right-4 top-1/2 -translate-y-1/2 z-[210] w-11 h-11 bg-ash/60 flex items-center justify-center text-sand"
              onClick={e => { e.stopPropagation(); lightboxPrev(); }}
              aria-label="تصویر قبلی"
            >
              <ChevronRight size={24} strokeWidth={1.8} />
            </button>

            {/* Next (left side in RTL) */}
            <button
              className="lightbox-btn absolute left-4 top-1/2 -translate-y-1/2 z-[210] w-11 h-11 bg-ash/60 flex items-center justify-center text-sand"
              onClick={e => { e.stopPropagation(); lightboxNext(); }}
              aria-label="تصویر بعدی"
            >
              <ChevronLeft size={24} strokeWidth={1.8} />
            </button>

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.img
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                src={filteredProjects[lightboxIndex]?.img}
                alt={`تصویر پروژه ${filteredProjects[lightboxIndex]?.cat}`}
                className="max-w-full max-h-[82vh] object-contain shadow-2xl"
                onClick={e => e.stopPropagation()}
                draggable={false}
              />
            </AnimatePresence>

            {/* Category label */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-walnut text-jet text-xs font-bold select-none">
              {filteredProjects[lightboxIndex]?.cat}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
