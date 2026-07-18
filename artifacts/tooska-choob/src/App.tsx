import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Toaster, toast } from 'sonner';
import { 
  Menu, X, Phone, Mail, MapPin, ChevronLeft, ChevronDown, CheckCircle2,
  Clock, CalendarDays, ArrowDown, Map, ShieldCheck, Wrench, HeadphonesIcon, DraftingCompass, Ruler
} from 'lucide-react';
import { SiInstagram, SiTelegram } from 'react-icons/si';

// --- Images ---
import heroImg from "../attached_assets/generated_images/hero.jpg";
import sKitchen from "../attached_assets/generated_images/service_kitchen.jpg";
import sDoor from "../attached_assets/generated_images/service_door.jpg";
import sTvwall from "../attached_assets/generated_images/service_tvwall.jpg";
import sWardrobe from "../attached_assets/generated_images/service_wardrobe.jpg";
import sDecor from "../attached_assets/generated_images/service_decor.jpg";
import sPartition from "../attached_assets/generated_images/service_partition.jpg";
import aboutImg from "../attached_assets/generated_images/about_workshop.jpg";
import p1 from "../attached_assets/generated_images/portfolio_1.jpg";
import p2 from "../attached_assets/generated_images/portfolio_2.jpg";
import p3 from "../attached_assets/generated_images/portfolio_3.jpg";
import p4 from "../attached_assets/generated_images/portfolio_4.jpg";
import p5 from "../attached_assets/generated_images/portfolio_5.jpg";
import p6 from "../attached_assets/generated_images/portfolio_6.jpg";
import p7 from "../attached_assets/generated_images/portfolio_7.jpg";
import p8 from "../attached_assets/generated_images/portfolio_8.jpg";

// --- Form Schema ---
const contactSchema = z.object({
  name: z.string().min(2, 'نام باید حداقل ۲ حرف باشد'),
  phone: z.string().min(11, 'شماره تماس معتبر نیست'),
  email: z.string().email('ایمیل معتبر نیست').optional().or(z.literal('')),
  service: z.string().min(1, 'لطفاً نوع خدمت را انتخاب کنید'),
  message: z.string().min(10, 'پیام باید حداقل ۱۰ حرف باشد')
});
type ContactFormValues = z.infer<typeof contactSchema>;

// --- Helper Components ---
const FadeIn = ({ children, delay = 0, className = "", direction = "up" }: { children: React.ReactNode, delay?: number, className?: string, direction?: "up" | "left" | "right" | "none" }) => {
  const y = direction === "up" ? 40 : 0;
  const x = direction === "left" ? 40 : direction === "right" ? -40 : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const PersianNumber = ({ num }: { num: number | string }) => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return <>{num.toString().replace(/\d/g, x => persianDigits[parseInt(x)])}</>;
};

const Counter = ({ value, suffix = "", prefix = "" }: { value: number, suffix?: string, prefix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = value;
      if (start === end) return;
      const totalDur = 2000;
      const incrementTime = (totalDur / end) * 2;
      const timer = setInterval(() => {
        start += Math.ceil(end / 50) || 1;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, incrementTime);
      return () => clearInterval(timer);
    }
  }, [value, inView]);

  return (
    <span ref={ref} dir="rtl" className="inline-block">
      {prefix}<PersianNumber num={count} />{suffix}
    </span>
  );
};

// --- Main App Component ---
export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('همه');
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 250]);
  const heroOpacity = useTransform(scrollY, [0, 800], [1, 0]);

  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'fa';
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormValues) => {
    await new Promise(r => setTimeout(r, 1500));
    toast.success('درخواست شما با موفقیت ثبت شد. به زودی با شما تماس خواهیم گرفت.');
    reset();
  };

  // --- Data Arrays ---
  const navLinks = [
    { label: 'خانه', href: '#home' },
    { label: 'خدمات', href: '#services' },
    { label: 'چرا توسکا چوب', href: '#why-us' },
    { label: 'فرآیند', href: '#process' },
    { label: 'نمونه کارها', href: '#portfolio' },
    { label: 'مشتریان', href: '#clients' },
    { label: 'تماس با ما', href: '#contact' },
  ];

  const services = [
    { title: 'کابینت آشپزخانه', desc: 'طراحی و اجرای کابینت‌های سفارشی با بالاترین کیفیت متریال.', img: sKitchen, span: 'col-span-1 md:col-span-2' },
    { title: 'کمد دیواری', desc: 'کمدهای مدرن و کلاسیک با فضاسازی هوشمندانه و ارگونومیک.', img: sWardrobe, span: 'col-span-1' },
    { title: 'تی وی وال', desc: 'دیوارهای دکوراتیو و نقاط کانونی خیره‌کننده برای نشیمن.', img: sTvwall, span: 'col-span-1' },
    { title: 'دکوراسیون داخلی', desc: 'طراحی جامع و یکپارچه فضاهای مسکونی و اداری.', img: sDecor, span: 'col-span-1 md:col-span-2' },
    { title: 'درب های چوبی', desc: 'درب‌های تمام چوب، روکش چوب و مدرن با دوام بی‌نظیر.', img: sDoor, span: 'col-span-1 md:col-span-2' },
    { title: 'پارتیشن', desc: 'جداکننده‌های فضا با طراحی خلاقانه و کاربردی.', img: sPartition, span: 'col-span-1' },
  ];

  const features = [
    { icon: <ShieldCheck size={24} />, title: 'بیش از ۳۲ سال تجربه' },
    { icon: <Map size={24} />, title: 'اجرای پروژه در سراسر ایران' },
    { icon: <DraftingCompass size={24} />, title: 'طراحی سه بعدی' },
    { icon: <HeadphonesIcon size={24} />, title: 'مشاوره تخصصی' },
    { icon: <Ruler size={24} />, title: 'اندازه گیری در محل' },
    { icon: <CheckCircle2 size={24} />, title: 'ضمانت ۶ ماهه (به جز یراق آلات)' },
    { icon: <Wrench size={24} />, title: 'ضمانت نصب' },
    { icon: <Clock size={24} />, title: 'خدمات پس از فروش' }
  ];

  const processSteps = [
    { num: '۱', title: 'مشاوره', desc: 'بررسی نیازها و ارائه راهکارهای اولیه تخصصی.' },
    { num: '۲', title: 'اندازه‌گیری', desc: 'برداشت دقیق ابعاد فضا توسط تیم فنی.' },
    { num: '۳', title: 'طراحی سه‌بعدی', desc: 'ارائه طرح 3D پیش از شروع ساخت.' },
    { num: '۴', title: 'تولید', desc: 'ساخت قطعات در کارگاه مجهز توسکا چوب.' },
    { num: '۵', title: 'نصب', desc: 'اجرای تمیز و دقیق در محل پروژه.' },
    { num: '۶', title: 'پشتیبانی', desc: 'خدمات و گارانتی پس از تحویل نهایی.' },
  ];

  const projects = [
    { id: 1, img: p1, cat: 'کابینت', span: 'md:col-span-2 md:row-span-2' },
    { id: 2, img: p2, cat: 'کمد', span: 'md:col-span-1 md:row-span-1' },
    { id: 3, img: p3, cat: 'تی وی وال', span: 'md:col-span-1 md:row-span-1' },
    { id: 4, img: p4, cat: 'دکوراسیون', span: 'md:col-span-1 md:row-span-2' },
    { id: 5, img: p5, cat: 'کابینت', span: 'md:col-span-2 md:row-span-1' },
    { id: 6, img: p6, cat: 'درب', span: 'md:col-span-1 md:row-span-1' },
    { id: 7, img: p7, cat: 'دکوراسیون', span: 'md:col-span-1 md:row-span-1' },
    { id: 8, img: p8, cat: 'کمد', span: 'md:col-span-1 md:row-span-1' },
  ];
  
  const filteredProjects = activeFilter === 'همه' ? projects : projects.filter(p => p.cat === activeFilter);
  const clients = ['ASP', 'گنو', 'آلدوز آذربایجان', 'توسعه صنعتی ایران', 'آباد راهان'];

  return (
    <>
      <Toaster position="bottom-center" theme="dark" dir="rtl" toastOptions={{ style: { background: 'var(--color-charcoal)', borderColor: 'var(--color-walnut)', color: 'var(--color-sand)' } }} />

      {/* Floating Buttons */}
      <div className="fixed bottom-6 left-6 z-[60] flex flex-col gap-3">
        <div className="relative group">
          <a href="#" onClick={(e) => e.preventDefault()}
             className="w-12 h-12 rounded-full bg-jet/80 border border-ash flex items-center justify-center text-fog transition-all duration-300">
            <SiInstagram size={20} />
          </a>
          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 bg-jet border border-ash text-xs text-sand whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded pointer-events-none">
            به زودی فعال می‌شود
          </div>
        </div>
        
        <a href="https://t.me/tooska_chob" target="_blank" rel="noreferrer"
           className="w-12 h-12 rounded-full bg-[#2AABEE] flex items-center justify-center text-white shadow-[0_4px_20px_rgba(42,171,238,0.25)] hover:scale-110 transition-transform duration-300">
          <SiTelegram size={24} />
        </a>
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${isScrolled ? 'glass py-4' : 'bg-transparent border-transparent py-6'}`}>
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div className="flex flex-col items-start">
            <span className="text-2xl font-black text-walnut tracking-tight">توسکا چوب</span>
            <span className="text-fog text-[10px] tracking-widest mt-1 uppercase">از ۱۳۷۳</span>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-sm font-medium text-sand/80 hover:text-walnut transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:block">
            <a href="#contact" className="btn-primary px-6 py-2.5 text-sm">
              مشاوره رایگان
            </a>
          </div>

          <button className="lg:hidden text-sand" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] bg-jet flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-16">
              <div className="flex flex-col items-start">
                <span className="text-2xl font-black text-walnut">توسکا چوب</span>
                <span className="text-fog text-[10px] tracking-widest mt-1">از ۱۳۷۳</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-sand"><X size={32}/></button>
            </div>
            <div className="flex flex-col gap-6 text-xl font-medium">
              {navLinks.map((link) => (
                <a 
                  key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)}
                  className="text-sand hover:text-walnut border-b border-ash pb-4 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* HERO */}
        <section id="home" className="relative h-screen min-h-[700px] w-full flex flex-col justify-center overflow-hidden bg-jet">
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
            <img src={heroImg} alt="Tooska Choob Interior" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-jet via-jet/70 to-jet/30" />
            <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
          </motion.div>

          <div className="container relative z-10 mx-auto px-6 lg:px-12 mt-20">
            <motion.div 
              initial="hidden" animate="visible"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } }}
              className="max-w-4xl"
            >
              <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } } }} className="mb-6">
                <div className="inline-flex items-center border border-walnut/40 bg-jet/50 backdrop-blur-sm px-4 py-1.5 mb-6 text-sm text-sand">
                  <span className="text-walnut font-medium">از سال ۱۳۷۳</span>
                  <span className="mx-3 text-ash">|</span>
                  <span>بیش از ۳۲ سال تجربه</span>
                </div>
                <h1 className="text-6xl md:text-8xl lg:text-[120px] font-black leading-[1.1] text-sand">
                  توسکا چوب
                </h1>
              </motion.div>
              
              <motion.p 
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } } }}
                className="text-lg md:text-2xl text-fog max-w-2xl leading-relaxed mb-10 font-light"
              >
                طراحی و اجرای کابینت، دکوراسیون داخلی، تی وی وال، کمد دیواری و درب های چوبی.
              </motion.p>
              
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } } }}
                className="flex flex-wrap gap-4"
              >
                <a href="#contact" className="btn-primary px-10 py-4 text-lg">مشاوره رایگان</a>
                <a href="#contact" className="btn-outline px-10 py-4 text-lg">تماس با ما</a>
              </motion.div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
          >
            <motion.div 
              animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="text-walnut"
            >
              <ArrowDown size={24} strokeWidth={1.5} />
            </motion.div>
          </motion.div>
        </section>

        {/* STATS BAR */}
        <section className="bg-charcoal border-y border-ash py-12 relative z-20">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-transparent md:divide-x md:divide-x-reverse md:divide-ash">
              {[
                { n: 32, s: '+', l: 'سال تجربه' },
                { n: 500, s: '+', l: 'پروژه اجرا شده' },
                { n: 6, s: '', l: 'نوع خدمت تخصصی' },
                { n: 6, s: '', l: 'ماه ضمانت' }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center justify-center text-center px-4">
                  <div className="text-4xl md:text-5xl font-bold text-walnut mb-2">
                    <Counter value={stat.n} suffix={stat.s} />
                  </div>
                  <div className="text-sm text-fog font-medium">{stat.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES (LIGHT SECTION) */}
        <section id="services" className="py-24 md:py-32 bg-sand text-jet">
          <div className="container mx-auto px-6 lg:px-12">
            <FadeIn className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
              <div className="section-heading text-copper">خدمات توسکا چوب</div>
              <h2 className="text-3xl md:text-5xl font-black text-jet">تسلط بر چوب و فضا</h2>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {services.map((s, i) => (
                <FadeIn key={i} delay={i * 0.1} className={s.span}>
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="group relative h-[350px] md:h-[400px] overflow-hidden bg-linen flex flex-col"
                  >
                    <img src={s.img} alt={s.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-jet/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="absolute inset-0 p-8 flex flex-col justify-end text-sand">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex flex-col">
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-walnut transition-colors">{s.title}</h3>
                        <p className="text-sand/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 leading-relaxed">
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* WHY US (DARK SECTION) */}
        <section id="why-us" className="py-24 md:py-32 bg-jet border-t border-ash grain-bg relative">
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <FadeIn className="w-full lg:w-5/12 order-2 lg:order-1" direction="right">
                <div className="relative">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img src={aboutImg} alt="Workshop" className="w-full h-full object-cover grayscale-[20%] sepia-[10%]" />
                  </div>
                  <div className="absolute -bottom-6 -left-6 w-full h-full border border-walnut z-[-1]" />
                  <div className="absolute top-1/2 -right-8 -translate-y-1/2 w-16 h-32 bg-clay mix-blend-screen opacity-50 blur-2xl" />
                </div>
              </FadeIn>

              <div className="w-full lg:w-7/12 order-1 lg:order-2">
                <FadeIn direction="left">
                  <div className="section-heading">چرا توسکا چوب؟</div>
                  <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">پشتوانه‌ای از اصالت<br />و تعهد به کیفیت</h2>
                  <p className="text-fog text-lg leading-relaxed mb-12 max-w-xl">
                    ما معتقدیم کیفیت یک اتفاق نیست، بلکه حاصل سال‌ها تجربه، انتخاب متریال درجه یک و تعهد به خلق ارزش برای مشتریان است.
                  </p>
                </FadeIn>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
                  {features.map((feat, i) => (
                    <FadeIn key={i} delay={i * 0.1} direction="left" className="flex items-start gap-4">
                      <div className="flex-shrink-0 text-walnut mt-1">
                        {feat.icon}
                      </div>
                      <h4 className="text-lg font-medium text-sand">{feat.title}</h4>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROCESS (LIGHT SECTION) */}
        <section id="process" className="py-24 md:py-32 bg-linen text-jet">
          <div className="container mx-auto px-6 lg:px-12">
            <FadeIn className="text-center max-w-3xl mx-auto mb-24">
              <div className="section-heading text-copper">فرآیند انجام پروژه</div>
              <h2 className="text-3xl md:text-5xl font-black text-jet">مسیر تحقق یک ایده</h2>
            </FadeIn>

            <div className="relative">
              {/* Desktop Line */}
              <div className="hidden lg:block absolute top-12 left-0 w-full h-[2px] bg-sand" />
              
              <div className="flex flex-col lg:flex-row gap-12 lg:gap-4 justify-between">
                {processSteps.map((step, i) => (
                  <FadeIn key={i} delay={i * 0.1} className="relative flex-1 group">
                    {/* Mobile Line */}
                    {i !== processSteps.length - 1 && (
                      <div className="lg:hidden absolute top-12 right-12 w-[2px] h-[calc(100%+3rem)] bg-sand -z-10" />
                    )}
                    
                    <div className="flex lg:flex-col gap-6 lg:gap-8 items-start lg:items-center text-right lg:text-center">
                      <div className="w-24 h-24 rounded-full bg-linen border-4 border-sand flex items-center justify-center text-2xl font-black text-clay relative z-10 group-hover:bg-walnut group-hover:border-walnut group-hover:text-jet transition-all duration-300">
                        <PersianNumber num={step.num} />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-3 text-jet">{step.title}</h4>
                        <p className="text-sm text-jet/70 leading-relaxed max-w-[200px] mx-auto">{step.desc}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PORTFOLIO (DARK SECTION) */}
        <section id="portfolio" className="py-24 md:py-32 bg-charcoal">
          <div className="container mx-auto px-6 lg:px-12">
            <FadeIn className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div>
                <div className="section-heading">نمونه کارهای ما</div>
                <h2 className="text-3xl md:text-5xl font-black text-sand">تجلی زیبایی در اجرا</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {['همه', 'کابینت', 'کمد', 'تی وی وال', 'دکوراسیون', 'درب'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-6 py-2.5 text-sm transition-all duration-300 ${activeFilter === cat ? 'bg-walnut text-jet font-bold' : 'bg-jet text-fog hover:bg-ash hover:text-sand'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </FadeIn>

            <motion.div layout className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px] md:auto-rows-[300px]">
              <AnimatePresence>
                {filteredProjects.map((p) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    key={p.id} 
                    className={`relative overflow-hidden group cursor-pointer ${p.span}`}
                    onClick={() => setLightboxImg(p.img)}
                  >
                    <img src={p.img} alt={p.cat} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    
                    {/* Elegant overlay for placeholder state */}
                    <div className="absolute inset-0 bg-jet/80 flex flex-col items-center justify-center p-6 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <span className="px-3 py-1 bg-walnut text-jet text-xs font-bold mb-4">{p.cat}</span>
                      <h4 className="text-lg font-medium text-sand mb-2">تصویر پروژه</h4>
                      <p className="text-sm text-fog font-light">به زودی اضافه می‌شود</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* CLIENTS (DARK CONTINUED) */}
        <section id="clients" className="py-20 bg-jet border-t border-ash overflow-hidden">
          <div className="container mx-auto px-6 lg:px-12">
            <FadeIn className="text-center mb-12">
              <h2 className="text-sm font-bold text-fog tracking-widest uppercase">اعتماد بهترین‌ها</h2>
            </FadeIn>
            
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 md:gap-x-24 opacity-60">
              {clients.map((client, i) => (
                <FadeIn key={i} delay={i * 0.1} direction="up" className="text-xl md:text-3xl font-black text-ash hover:text-walnut transition-colors duration-300">
                  {client}
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT (LIGHT SECTION) */}
        <section id="contact" className="py-24 md:py-32 bg-sand text-jet relative">
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="flex flex-col lg:flex-row gap-16">
              
              {/* Contact Info */}
              <FadeIn className="w-full lg:w-5/12" direction="right">
                <div className="section-heading text-copper">تماس با ما</div>
                <h2 className="text-3xl md:text-5xl font-black mb-12">در مسیر خلق یک اثر، همراه شما هستیم.</h2>
                
                <div className="space-y-8 text-jet/80">
                  <div className="flex gap-4 items-start">
                    <MapPin className="text-walnut shrink-0 mt-1" size={24} />
                    <div>
                      <h4 className="font-bold text-jet mb-1">آدرس</h4>
                      <p className="leading-relaxed">تهران، شهرک صنعتی قلعه میر،<br />کوچه گلبو، پلاک ۲۰</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <Phone className="text-walnut shrink-0 mt-1" size={24} />
                    <div>
                      <h4 className="font-bold text-jet mb-1">تلفن تماس</h4>
                      <p dir="ltr" className="text-right">0912 133 1602</p>
                      <p dir="ltr" className="text-right">0912 359 4953</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <Mail className="text-walnut shrink-0 mt-1" size={24} />
                    <div>
                      <h4 className="font-bold text-jet mb-1">ایمیل</h4>
                      <p className="font-sans">tooskachoob12@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <CalendarDays className="text-walnut shrink-0 mt-1" size={24} />
                    <div>
                      <h4 className="font-bold text-jet mb-1">ساعات کاری</h4>
                      <p>شنبه تا چهارشنبه: ۸ صبح تا ۹ شب</p>
                      <p>پنجشنبه: ۸ صبح تا ۲ ظهر</p>
                      <p className="text-clay font-medium">جمعه: تعطیل</p>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* Form */}
              <FadeIn className="w-full lg:w-7/12" direction="left">
                <div className="bg-white p-8 md:p-12 shadow-xl shadow-jet/5 border border-linen">
                  <h3 className="text-2xl font-bold mb-8 text-jet">ارسال درخواست مشاوره</h3>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-jet/70">نام و نام خانوادگی *</label>
                        <input {...register('name')} className="w-full bg-sand border-none focus:ring-2 focus:ring-walnut px-4 py-3 outline-none" />
                        {errors.name && <span className="text-xs text-red-600">{errors.name.message}</span>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-jet/70">شماره تماس *</label>
                        <input {...register('phone')} dir="ltr" className="w-full bg-sand border-none focus:ring-2 focus:ring-walnut px-4 py-3 outline-none text-right" />
                        {errors.phone && <span className="text-xs text-red-600">{errors.phone.message}</span>}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-jet/70">ایمیل (اختیاری)</label>
                        <input {...register('email')} dir="ltr" className="w-full bg-sand border-none focus:ring-2 focus:ring-walnut px-4 py-3 outline-none text-right font-sans" />
                        {errors.email && <span className="text-xs text-red-600">{errors.email.message}</span>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-jet/70">نوع خدمت *</label>
                        <select {...register('service')} className="w-full bg-sand border-none focus:ring-2 focus:ring-walnut px-4 py-3 outline-none appearance-none">
                          <option value="">انتخاب کنید...</option>
                          <option value="کابینت آشپزخانه">کابینت آشپزخانه</option>
                          <option value="کمد دیواری">کمد دیواری</option>
                          <option value="تی وی وال">تی وی وال</option>
                          <option value="دکوراسیون داخلی">دکوراسیون داخلی</option>
                          <option value="درب های چوبی">درب های چوبی</option>
                          <option value="پارتیشن">پارتیشن</option>
                        </select>
                        {errors.service && <span className="text-xs text-red-600">{errors.service.message}</span>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-jet/70">پیام / توضیحات *</label>
                      <textarea {...register('message')} rows={4} className="w-full bg-sand border-none focus:ring-2 focus:ring-walnut px-4 py-3 outline-none resize-none" />
                      {errors.message && <span className="text-xs text-red-600">{errors.message.message}</span>}
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full btn-primary py-4 text-lg mt-4 disabled:opacity-70"
                    >
                      {isSubmitting ? 'در حال ارسال...' : 'ارسال درخواست'}
                    </button>
                  </form>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-jet pt-20 border-t border-ash text-sand">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-black text-walnut mb-2">توسکا چوب</h3>
                <p className="text-sm text-fog uppercase tracking-widest">معماری فضا و چوب</p>
              </div>
              <p className="text-sm text-fog leading-relaxed">
                طراحی و اجرای دکوراسیون داخلی با بیش از ۳۲ سال سابقه درخشان در صنعت چوب.
              </p>
              <div className="flex gap-4">
                <a href="https://t.me/tooska_chob" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-ash flex items-center justify-center text-fog hover:bg-walnut hover:text-jet transition-colors">
                  <SiTelegram size={18} />
                </a>
                <div className="relative group">
                  <a href="#" onClick={(e)=>e.preventDefault()} className="w-10 h-10 rounded-full bg-ash flex items-center justify-center text-fog transition-colors cursor-default">
                    <SiInstagram size={18} />
                  </a>
                  <span className="absolute -top-8 right-1/2 translate-x-1/2 px-2 py-1 bg-charcoal border border-ash text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">به زودی</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 text-sand">خدمات ما</h4>
              <ul className="space-y-4">
                {services.map(s => (
                  <li key={s.title}>
                    <a href="#services" className="text-sm text-fog hover:text-walnut transition-colors">{s.title}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 text-sand">لینک‌های سریع</h4>
              <ul className="space-y-4">
                {navLinks.map(l => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm text-fog hover:text-walnut transition-colors">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 text-sand">ساعات کاری</h4>
              <ul className="space-y-4 text-sm text-fog">
                <li className="flex justify-between border-b border-ash pb-2">
                  <span>شنبه - چهارشنبه</span>
                  <span>۰۸:۰۰ - ۲۱:۰۰</span>
                </li>
                <li className="flex justify-between border-b border-ash pb-2">
                  <span>پنجشنبه</span>
                  <span>۰۸:۰۰ - ۱۴:۰۰</span>
                </li>
                <li className="flex justify-between text-clay font-bold">
                  <span>جمعه</span>
                  <span>تعطیل</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-ash py-6">
          <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-fog">
              © <PersianNumber num={1403} /> توسکا چوب. تمامی حقوق محفوظ است.
            </p>
            <div className="flex gap-6 text-xs text-fog">
              <a href="#" className="hover:text-sand">حریم خصوصی</a>
              <a href="#" className="hover:text-sand">شرایط استفاده</a>
            </div>
          </div>
        </div>
      </footer>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-jet/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-12 cursor-pointer"
            onClick={() => setLightboxImg(null)}
          >
            <button className="absolute top-6 right-6 text-sand hover:text-walnut z-[210] p-2" onClick={() => setLightboxImg(null)}>
              <X size={32} />
            </button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              src={lightboxImg} alt="Portfolio Fullscreen" 
              className="max-w-full max-h-full object-contain shadow-2xl" 
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
