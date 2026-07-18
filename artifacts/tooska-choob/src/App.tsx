import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Toaster, toast } from 'sonner';
import { Menu, X, Phone, Mail, MapPin, ChevronLeft, Star, ChevronDown, CheckCircle2 } from 'lucide-react';
import { SiInstagram, SiWhatsapp } from 'react-icons/si';

// --- Images ---
import heroImg from "../attached_assets/generated_images/hero.jpg";
import sKitchen from "../attached_assets/generated_images/service_kitchen.jpg";
import sDoor from "../attached_assets/generated_images/service_door.jpg";
import sTvwall from "../attached_assets/generated_images/service_tvwall.jpg";
import sWardrobe from "../attached_assets/generated_images/service_wardrobe.jpg";
import sDecor from "../attached_assets/generated_images/service_decor.jpg";
import sConsult from "../attached_assets/generated_images/service_consult.jpg";
import aboutImg from "../attached_assets/generated_images/about_workshop.jpg";
import p1 from "../attached_assets/generated_images/portfolio_1.jpg";
import p2 from "../attached_assets/generated_images/portfolio_2.jpg";
import p3 from "../attached_assets/generated_images/portfolio_3.jpg";
import p4 from "../attached_assets/generated_images/portfolio_4.jpg";
import p5 from "../attached_assets/generated_images/portfolio_5.jpg";
import p6 from "../attached_assets/generated_images/portfolio_6.jpg";
import p7 from "../attached_assets/generated_images/portfolio_7.jpg";
import p8 from "../attached_assets/generated_images/portfolio_8.jpg";
import avatar1 from "../attached_assets/generated_images/avatar_1.jpg";
import avatar2 from "../attached_assets/generated_images/avatar_2.jpg";
import avatar3 from "../attached_assets/generated_images/avatar_3.jpg";

// --- Types & Schemas ---
const contactSchema = z.object({
  name: z.string().min(2, 'نام باید حداقل ۲ حرف باشد'),
  phone: z.string().min(11, 'شماره تماس معتبر نیست'),
  email: z.string().email('ایمیل معتبر نیست').optional().or(z.literal('')),
  service: z.string().min(1, 'لطفاً نوع خدمت را انتخاب کنید'),
  message: z.string().min(10, 'پیام باید حداقل ۱۰ حرف باشد')
});
type ContactFormValues = z.infer<typeof contactSchema>;

// --- Helper Components ---
const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
    className={className}
  >
    {children}
  </motion.div>
);

const Counter = ({ value, suffix = "" }: { value: number, suffix?: string }) => {
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

  return <span ref={ref} dir="ltr" className="inline-block">{count}{suffix}</span>;
};

// --- Main App Component ---
export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('همه');

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
    toast.success('پیام شما با موفقیت ارسال شد. به زودی تماس خواهیم گرفت.');
    reset();
  };

  // --- Data Arrays ---
  const navLinks = [
    { label: 'خانه', href: '#home' },
    { label: 'خدمات', href: '#services' },
    { label: 'پروژه‌ها', href: '#portfolio' },
    { label: 'درباره ما', href: '#about' },
    { label: 'سوالات متداول', href: '#faq' },
    { label: 'تماس', href: '#contact' },
  ];

  const services = [
    { title: 'کابینت آشپزخانه', desc: 'طراحی و اجرای کابینت‌های لوکس با تلفیق چوب طبیعی و متریال‌های مدرن.', img: sKitchen },
    { title: 'درب‌های داخلی', desc: 'درب‌های تمام چوب با جزئیات دقیق و استحکام بی‌نظیر برای فضاهای خاص.', img: sDoor },
    { title: 'دیوار TV', desc: 'دیوارهای دکوراتیو چوبی، نقطه‌ی کانونی و شاهکار نشیمن شما.', img: sTvwall },
    { title: 'کمد و جاکفشی', desc: 'کمدهای دیواری سفارشی با طراحی ارگونومیک و نورپردازی هوشمند.', img: sWardrobe },
    { title: 'دکوراسیون داخلی', desc: 'طراحی جامع و اجرای دکوراسیون چوبی متناسب با سبک زندگی شما.', img: sDecor },
    { title: 'مشاوره طراحی', desc: 'همراهی شما از ایده تا اجرا توسط مهندسین و طراحان برجسته.', img: sConsult },
  ];

  const projects = [
    { id: 1, img: p1, cat: 'کابینت', title: 'آشپزخانه مدرن نیاوران', colClass: 'md:col-span-2 md:row-span-2' },
    { id: 2, img: p2, cat: 'کمد', title: 'کلوزت روم اختصاصی', colClass: 'md:col-span-1 md:row-span-1' },
    { id: 3, img: p3, cat: 'دیوار TV', title: 'دیوار TV طرح سنگ و چوب', colClass: 'md:col-span-1 md:row-span-1' },
    { id: 4, img: p4, cat: 'دکوراسیون', title: 'طراحی داخلی ویلای لواسان', colClass: 'md:col-span-1 md:row-span-1' },
    { id: 5, img: p5, cat: 'کابینت', title: 'آشپزخانه نئوکلاسیک', colClass: 'md:col-span-1 md:row-span-1' },
    { id: 6, img: p6, cat: 'درب', title: 'درب‌های تمام چوب بلوط', colClass: 'md:col-span-1 md:row-span-1' },
    { id: 7, img: p7, cat: 'دکوراسیون', title: 'طراحی فضای نشیمن', colClass: 'md:col-span-2 md:row-span-1' },
    { id: 8, img: p8, cat: 'کمد', title: 'کمد دیواری هوشمند', colClass: 'md:col-span-1 md:row-span-1' },
  ];

  const filteredProjects = activeFilter === 'همه' ? projects : projects.filter(p => p.cat === activeFilter);

  const processSteps = [
    { num: '۰۱', title: 'مشاوره اولیه', desc: 'بررسی نیازها، سلیقه و بودجه شما در یک جلسه رایگان.' },
    { num: '۰۲', title: 'طراحی و رندر', desc: 'خلق مدل سه‌بعدی دقیق از فضا پیش از شروع ساخت.' },
    { num: '۰۳', title: 'تأیید و قرارداد', desc: 'نهایی‌سازی متریال‌ها، زمان‌بندی و عقد قرارداد رسمی.' },
    { num: '۰۴', title: 'ساخت و اجرا', desc: 'تولید قطعات با دقت میلی‌متری در کارگاه تخصصی ما.' },
    { num: '۰۵', title: 'تحویل نهایی', desc: 'نصب بی‌نقص، کنترل کیفیت نهایی و تحویل کلید.' },
  ];

  const testimonials = [
    { text: 'کیفیت اجرای کابینت‌های ما بی‌نظیر بود. دقت در جزئیات و استفاده از بهترین یراق‌آلات نشان‌دهنده تعهد تیم توسکا چوب است. آشپزخانه ما حالا قلب تپنده خانه‌مان شده است.', name: 'علیرضا مجیدی', role: 'پروژه ویلای لواسان', avatar: avatar1, stars: 5 },
    { text: 'تیم طراحی توسکا چوب دقیقاً همان چیزی را که در ذهن داشتم به تصویر کشید و در اجرا حتی فراتر از انتظارم عمل کردند. کلوزت روم اختصاصی من شاهکار است.', name: 'سارا تهرانی', role: 'پروژه برج چناران', avatar: avatar2, stars: 5 },
    { text: 'به عنوان یک معمار، همیشه به دنبال پیمانکارانی هستم که زبان طراحی را بفهمند. توسکا چوب نه‌تنها کیفیت بالایی دارد، بلکه در زمان‌بندی نیز بسیار دقیق است.', name: 'مهندس کیوان راد', role: 'دفتر معماری راد', avatar: avatar3, stars: 5 },
  ];

  const faqs = [
    { q: 'مدت زمان اجرای یک پروژه کابینت چقدر است؟', a: 'بسته به ابعاد و پیچیدگی طراحی، معمولاً بین ۳۰ تا ۴۵ روز کاری پس از تأیید نهایی طرح و عقد قرارداد زمان می‌برد.' },
    { q: 'آیا امکان مشاهده نمونه‌کارها به صورت حضوری وجود دارد؟', a: 'بله، با هماهنگی قبلی می‌توانید از شوروم ما و همچنین کارگاه تولیدی بازدید فرمایید تا کیفیت متریال‌ها را از نزدیک بسنجید.' },
    { q: 'ضمانت محصولات شما چند ساله است؟', a: 'تمامی محصولات توسکا چوب دارای ۵ سال گارانتی تعویض یراق‌آلات و تضمین کیفیت رنگ و متریال می‌باشند.' },
    { q: 'آیا طراحی سه‌بعدی قبل از اجرا ارائه می‌دهید؟', a: 'قطعاً. پیش از شروع مراحل ساخت، رندرهای واقع‌گرایانه سه‌بعدی به شما ارائه می‌شود تا در صورت نیاز تغییرات اعمال گردد.' },
    { q: 'روش پرداخت و شرایط قرارداد چگونه است؟', a: 'پرداخت در سه مرحله انجام می‌شود: ۵۰٪ پیش‌پرداخت، ۳۰٪ پس از اتمام ساخت در کارگاه، و ۲۰٪ پس از نصب و تحویل نهایی.' },
    { q: 'آیا خدمات نصب و راه‌اندازی را نیز انجام می‌دهید؟', a: 'بله، تیم نصب حرفه‌ای ما تمامی قطعات را با نهایت دقت و رعایت استانداردهای ایمنی در محل پروژه شما نصب می‌کنند.' },
  ];
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      <Toaster position="bottom-center" theme="dark" dir="rtl" />

      {/* Floating Buttons */}
      <div className="fixed bottom-8 left-6 z-[60] flex flex-col gap-4">
        <a href="https://instagram.com/tooskachoob" target="_blank" rel="noreferrer" 
           className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-[0_4px_20px_rgba(220,39,67,0.3)] hover:scale-110 transition-transform duration-300">
          <SiInstagram size={24} />
        </a>
        <a href="https://wa.me/989123456789" target="_blank" rel="noreferrer"
           className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-[0_4px_20px_rgba(37,211,102,0.3)] hover:scale-110 transition-transform duration-300">
          <SiWhatsapp size={28} />
        </a>
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 border-b ${isScrolled ? 'glass border-walnut/20 py-4' : 'bg-transparent border-transparent py-6'}`}>
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div className="flex flex-col items-start">
            <span className="text-2xl font-bold text-walnut tracking-tight">توسکا چوب</span>
            <span className="text-silver text-[10px] uppercase tracking-wider mt-1 hidden sm:block">طراحی و اجرای دکوراسیون داخلی</span>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-sm font-medium text-parchment hover:text-walnut transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:block">
            <a href="#contact" className="btn-outline px-6 py-2.5 text-sm rounded-none">
              مشاوره رایگان
            </a>
          </div>

          <button className="lg:hidden text-parchment" onClick={() => setMobileMenuOpen(true)}>
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
            className="fixed inset-0 z-[100] bg-coal flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-16">
              <span className="text-2xl font-bold text-walnut">توسکا چوب</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-silver hover:text-parchment"><X size={32}/></button>
            </div>
            <div className="flex flex-col gap-8 text-xl font-medium">
              {navLinks.map((link) => (
                <a 
                  key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)}
                  className="text-parchment hover:text-walnut border-b border-ash pb-4 transition-colors"
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
        <section id="home" className="relative h-screen min-h-[700px] w-full flex flex-col justify-center overflow-hidden">
          <motion.div 
            initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 15, ease: "easeOut" }}
            className="absolute inset-0 z-0"
          >
            <img src={heroImg} alt="Luxury Interior" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-coal via-coal/60 to-transparent" />
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>

          <div className="container relative z-10 mx-auto px-6 lg:px-12 mt-20">
            <motion.div 
              initial="hidden" animate="visible"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } }}
              className="max-w-4xl"
            >
              <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } } }}>
                <h1 className="text-[56px] md:text-7xl lg:text-[110px] font-black leading-[1.1] mb-6">
                  هنر چوب،<br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-walnut via-gold to-walnut">معماری فضا</span>
                </h1>
              </motion.div>
              
              <motion.p 
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } } }}
                className="text-lg md:text-xl text-silver max-w-2xl leading-relaxed mb-10"
              >
                توسکا چوب، بیش از یک شرکت دکوراسیون — ما فضاهایی می‌سازیم که ماندگار می‌شوند. تلفیقی از اصالت چوب و طراحی مینیمال.
              </motion.p>
              
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } } }}
                className="flex flex-wrap gap-4"
              >
                <a href="#portfolio" className="btn-primary px-8 py-4 min-w-[200px]">مشاهده پروژه‌ها</a>
                <a href="#contact" className="btn-outline px-8 py-4 min-w-[200px]">مشاوره رایگان</a>
              </motion.div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
          >
            <span className="text-silver text-xs uppercase tracking-[0.2em]">اسکرول کنید</span>
            <div className="w-[1px] h-12 bg-silver/20 overflow-hidden relative">
              <motion.div 
                animate={{ y: [-48, 48] }} 
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute top-0 left-0 w-full h-full bg-walnut"
              />
            </div>
          </motion.div>

          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent z-10" />
        </section>

        {/* STATS */}
        <section className="bg-charcoal border-b border-ash py-16">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-transparent md:divide-x md:divide-x-reverse md:divide-ash">
              {[
                { n: 15, s: '+', l: 'سال تجربه' },
                { n: 500, s: '+', l: 'پروژه اجرا شده' },
                { n: 3, s: '', l: 'شهر فعال' },
                { n: 100, s: '٪', l: 'رضایت مشتری' }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center justify-center text-center px-4">
                  <div className="text-4xl md:text-5xl font-bold text-walnut mb-2">
                    <Counter value={stat.n} suffix={stat.s} />
                  </div>
                  <div className="text-sm text-silver">{stat.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="py-24 md:py-32 bg-coal">
          <div className="container mx-auto px-6 lg:px-12">
            <FadeIn className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
              <div className="section-heading">خدمات ما</div>
              <h2 className="text-3xl md:text-5xl font-bold">شاهکارهای سفارشی چوبی</h2>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {services.map((s, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="group relative h-[450px] overflow-hidden rounded-none border border-ash hover:border-walnut/50 transition-colors duration-500 bg-charcoal flex flex-col"
                  >
                    <div className="h-[60%] overflow-hidden relative">
                      <img src={s.img} alt={s.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal to-transparent opacity-80" />
                    </div>
                    <div className="flex-1 p-6 glass relative z-10 flex flex-col justify-center border-t border-transparent group-hover:border-walnut/30 transition-colors">
                      <h3 className="text-xl font-bold text-parchment mb-3">{s.title}</h3>
                      <p className="text-sm text-silver leading-relaxed">{s.desc}</p>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-walnut scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* PORTFOLIO */}
        <section id="portfolio" className="py-24 md:py-32 bg-charcoal grain-bg border-y border-ash">
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <FadeIn className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div>
                <div className="section-heading">نمونه‌کارهای ما</div>
                <h2 className="text-3xl md:text-5xl font-bold">تجلی زیبایی در اجرا</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {['همه', 'کابینت', 'کمد', 'دیوار TV', 'دکوراسیون'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-5 py-2 text-sm border transition-all duration-300 ${activeFilter === cat ? 'bg-walnut border-walnut text-coal font-medium' : 'bg-transparent border-ash text-silver hover:border-walnut hover:text-parchment'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </FadeIn>

            <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[250px]">
              <AnimatePresence>
                {filteredProjects.map((p) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    key={p.id} 
                    className={`relative overflow-hidden group cursor-pointer ${p.colClass}`}
                    onClick={() => setLightboxImg(p.img)}
                  >
                    <img src={p.img} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-coal/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-6 text-center">
                      <span className="text-walnut text-xs tracking-widest mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{p.cat}</span>
                      <h4 className="text-xl font-bold text-parchment transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">{p.title}</h4>
                      <div className="mt-6 w-10 h-10 rounded-full border border-walnut flex items-center justify-center text-walnut transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100 hover:bg-walnut hover:text-coal">
                        <ChevronLeft size={20} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* WHY US */}
        <section className="py-24 md:py-32 bg-coal">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <FadeIn className="w-full lg:w-1/2 order-2 lg:order-1">
                <div className="relative">
                  <div className="aspect-[4/5] overflow-hidden border border-ash">
                    <img src={aboutImg} alt="Tooska Choob Workshop" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-3/4 h-3/4 border-b border-r border-walnut z-[-1]" />
                </div>
              </FadeIn>

              <div className="w-full lg:w-1/2 order-1 lg:order-2">
                <FadeIn>
                  <div className="section-heading">چرا توسکا چوب؟</div>
                  <h2 className="text-3xl md:text-5xl font-bold mb-12">چرا صدها خانواده ما را انتخاب کردند؟</h2>
                </FadeIn>

                <div className="space-y-10">
                  {[
                    { title: 'کیفیت بی‌رقیب', desc: 'بهترین متریال چوب اروپایی و ایرانی با استانداردهای جهانی.' },
                    { title: 'طراحی منحصربه‌فرد', desc: 'هر پروژه یک شاهکار یکتاست که متناسب با سلیقه شما خلق می‌شود.' },
                    { title: 'اجرای دقیق', desc: 'تیم متخصص با ۱۵ سال سابقه، دقت میلی‌متری در تمامی مراحل.' },
                    { title: 'ضمانت ۵ ساله', desc: 'تعهد به کیفیت پس از تحویل و همراهی همیشگی با مشتریان.' }
                  ].map((feat, i) => (
                    <FadeIn key={i} delay={i * 0.1} className="flex gap-6">
                      <div className="mt-1 flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-none bg-dark-walnut text-walnut">
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-2">{feat.title}</h4>
                        <p className="text-silver leading-relaxed">{feat.desc}</p>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="py-24 md:py-32 bg-charcoal border-y border-ash overflow-hidden">
          <div className="container mx-auto px-6 lg:px-12">
            <FadeIn className="text-center max-w-3xl mx-auto mb-20">
              <div className="section-heading">فرآیند انجام پروژه</div>
              <h2 className="text-3xl md:text-5xl font-bold">مسیر خلق رویای شما</h2>
            </FadeIn>

            <div className="relative">
              {/* Desktop Line */}
              <div className="hidden lg:block absolute top-10 left-0 w-full h-[1px] bg-ash" />
              
              <div className="flex flex-col lg:flex-row gap-12 lg:gap-6 justify-between">
                {processSteps.map((step, i) => (
                  <FadeIn key={i} delay={i * 0.15} className="relative flex-1 group">
                    {/* Mobile Line */}
                    {i !== processSteps.length - 1 && (
                      <div className="lg:hidden absolute top-10 right-10 w-[1px] h-full bg-ash -z-10" />
                    )}
                    
                    <div className="flex lg:flex-col gap-6 lg:gap-8 items-start lg:items-center text-right lg:text-center">
                      <div className="w-20 h-20 rounded-full bg-coal border border-walnut flex items-center justify-center text-xl font-bold text-walnut relative z-10 group-hover:bg-walnut group-hover:text-coal transition-colors duration-500 shadow-[0_0_15px_rgba(196,154,108,0.1)] group-hover:shadow-[0_0_20px_rgba(196,154,108,0.4)]">
                        {step.num}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold mb-3 text-parchment group-hover:text-walnut transition-colors">{step.title}</h4>
                        <p className="text-sm text-silver leading-relaxed max-w-[200px] mx-auto">{step.desc}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 md:py-32 bg-coal grain-bg relative">
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <FadeIn className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
              <div className="section-heading">نظرات مشتریان</div>
              <h2 className="text-3xl md:text-5xl font-bold">آنچه درباره ما می‌گویند</h2>
            </FadeIn>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="glass p-8 md:p-10 h-full flex flex-col relative group hover:-translate-y-2 transition-transform duration-500">
                    <span className="text-6xl text-walnut/20 absolute top-6 right-8 font-serif leading-none group-hover:text-walnut/40 transition-colors">"</span>
                    <p className="text-silver leading-relaxed mb-8 flex-1 relative z-10 pt-4">
                      {t.text}
                    </p>
                    <div className="flex items-center gap-4 mt-auto border-t border-ash pt-6">
                      <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full object-cover border border-walnut/30" />
                      <div>
                        <h4 className="font-bold text-parchment">{t.name}</h4>
                        <p className="text-xs text-silver mt-1">{t.role}</p>
                      </div>
                      <div className="mr-auto flex text-walnut gap-1">
                        {[...Array(t.stars)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-24 md:py-32 bg-charcoal border-y border-ash">
          <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
            <FadeIn className="text-center mb-16">
              <div className="section-heading">سوالات متداول</div>
              <h2 className="text-3xl md:text-4xl font-bold">پاسخ به پرسش‌های شما</h2>
            </FadeIn>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <FadeIn key={i} delay={i * 0.05}>
                  <div className="border border-ash bg-coal">
                    <button 
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-6 text-right focus:outline-none"
                    >
                      <span className={`font-bold transition-colors ${openFaq === i ? 'text-walnut' : 'text-parchment'}`}>{faq.q}</span>
                      <ChevronDown className={`text-silver transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-walnut' : ''}`} size={20} />
                    </button>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 pt-0 text-silver leading-relaxed border-t border-ash/50 mt-2">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="py-24 md:py-32 bg-coal relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1/3 h-full bg-charcoal hidden lg:block" />
          
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="flex flex-col lg:flex-row gap-16 items-stretch">
              
              {/* Info Panel */}
              <FadeIn className="w-full lg:w-1/3 py-8">
                <div className="section-heading">ارتباط با ما</div>
                <h2 className="text-3xl md:text-5xl font-bold mb-8">آماده‌ی خلق فضای رویایی شما هستیم</h2>
                <p className="text-silver mb-12 leading-relaxed">
                  تیم طراحی و مهندسی ما آماده شنیدن ایده‌های شماست. با ما تماس بگیرید تا اولین قدم را برداریم.
                </p>

                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 border border-walnut/30 bg-dark-walnut flex items-center justify-center text-walnut shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-parchment mb-1">آدرس استودیو</h4>
                      <p className="text-sm text-silver leading-relaxed">تهران، نیاوران، خیابان ولیعصر، پلاک ۱۲</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-12 h-12 border border-walnut/30 bg-dark-walnut flex items-center justify-center text-walnut shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-parchment mb-1">تلفن‌های تماس</h4>
                      <p className="text-sm text-silver flex flex-col gap-1" dir="ltr">
                        <span>021 - 1234 5678</span>
                        <span>0912 345 6789</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 border border-walnut/30 bg-dark-walnut flex items-center justify-center text-walnut shrink-0">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-parchment mb-1">ایمیل</h4>
                      <p className="text-sm text-silver" dir="ltr">info@tooskachoob.ir</p>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* Form */}
              <FadeIn className="w-full lg:w-2/3">
                <div className="glass p-8 md:p-12 border border-ash h-full">
                  <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full justify-between gap-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm text-silver mb-2">نام و نام خانوادگی</label>
                        <input 
                          {...register('name')}
                          className={`w-full bg-coal border ${errors.name ? 'border-destructive' : 'border-ash focus:border-walnut'} px-4 py-3 text-parchment focus:outline-none transition-colors`}
                          placeholder="علی رضایی"
                        />
                        {errors.name && <span className="text-xs text-destructive mt-1 block">{errors.name.message}</span>}
                      </div>
                      <div>
                        <label className="block text-sm text-silver mb-2">شماره تماس</label>
                        <input 
                          {...register('phone')} dir="ltr"
                          className={`w-full bg-coal border ${errors.phone ? 'border-destructive' : 'border-ash focus:border-walnut'} px-4 py-3 text-parchment focus:outline-none transition-colors text-right`}
                          placeholder="09123456789"
                        />
                        {errors.phone && <span className="text-xs text-destructive mt-1 block">{errors.phone.message}</span>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm text-silver mb-2">ایمیل (اختیاری)</label>
                        <input 
                          {...register('email')} dir="ltr"
                          className={`w-full bg-coal border ${errors.email ? 'border-destructive' : 'border-ash focus:border-walnut'} px-4 py-3 text-parchment focus:outline-none transition-colors text-right`}
                          placeholder="info@example.com"
                        />
                        {errors.email && <span className="text-xs text-destructive mt-1 block">{errors.email.message}</span>}
                      </div>
                      <div>
                        <label className="block text-sm text-silver mb-2">نوع خدمت مورد نظر</label>
                        <div className="relative">
                          <select 
                            {...register('service')}
                            className={`w-full bg-coal border ${errors.service ? 'border-destructive' : 'border-ash focus:border-walnut'} px-4 py-3 text-parchment focus:outline-none transition-colors appearance-none`}
                          >
                            <option value="">انتخاب کنید...</option>
                            <option value="کابینت">کابینت آشپزخانه</option>
                            <option value="کمد">کمد و جاکفشی</option>
                            <option value="دیوار TV">دیوار TV</option>
                            <option value="درب">درب‌های داخلی</option>
                            <option value="دکوراسیون">دکوراسیون کامل</option>
                          </select>
                          <ChevronDown size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-silver pointer-events-none" />
                        </div>
                        {errors.service && <span className="text-xs text-destructive mt-1 block">{errors.service.message}</span>}
                      </div>
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm text-silver mb-2">پیام شما</label>
                      <textarea 
                        {...register('message')} rows={5}
                        className={`w-full bg-coal border ${errors.message ? 'border-destructive' : 'border-ash focus:border-walnut'} px-4 py-3 text-parchment focus:outline-none transition-colors resize-none h-full min-h-[120px]`}
                        placeholder="توضیحات کوتاهی درباره پروژه خود بنویسید..."
                      />
                      {errors.message && <span className="text-xs text-destructive mt-1 block">{errors.message.message}</span>}
                    </div>

                    <button 
                      type="submit" disabled={isSubmitting}
                      className="w-full btn-primary py-4 text-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
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
      <footer className="bg-[#050505] pt-20 pb-8 border-t border-ash">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            <div>
              <span className="text-3xl font-bold text-walnut tracking-tight block mb-4">توسکا چوب</span>
              <p className="text-silver text-sm leading-loose mb-6 pr-2 border-r-2 border-walnut/30">
                طراحی و اجرای لوکس‌ترین پروژه‌های دکوراسیون چوبی، با تلفیقی از هنر دست و دقت ماشین‌آلات مدرن.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-silver hover:text-walnut transition-colors"><SiInstagram size={20} /></a>
                <a href="#" className="text-silver hover:text-walnut transition-colors"><SiWhatsapp size={20} /></a>
              </div>
            </div>

            <div>
              <h4 className="text-parchment font-bold mb-6">خدمات ما</h4>
              <ul className="space-y-3">
                {services.slice(0,5).map(s => (
                  <li key={s.title}><a href="#services" className="text-silver hover:text-walnut text-sm transition-colors">{s.title}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-parchment font-bold mb-6">لینک‌های سریع</h4>
              <ul className="space-y-3">
                {navLinks.slice(1).map(l => (
                  <li key={l.label}><a href={l.href} className="text-silver hover:text-walnut text-sm transition-colors">{l.label}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-parchment font-bold mb-6">ساعات کاری</h4>
              <ul className="space-y-3 text-sm text-silver">
                <li className="flex justify-between border-b border-ash pb-2"><span>شنبه تا چهارشنبه</span> <span>۹:۰۰ - ۱۸:۰۰</span></li>
                <li className="flex justify-between border-b border-ash pb-2"><span>پنجشنبه</span> <span>۹:۰۰ - ۱۴:۰۰</span></li>
                <li className="flex justify-between pb-2 text-walnut"><span>جمعه و ایام تعطیل</span> <span>بسته است</span></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-ash pt-8 text-center md:text-right flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-silver text-xs">
              © ۱۴۰۳ توسکا چوب. کلیه حقوق محفوظ است.
            </p>
            <div className="flex gap-4 text-xs text-silver">
              <a href="#" className="hover:text-parchment transition-colors">حریم خصوصی</a>
              <a href="#" className="hover:text-parchment transition-colors">شرایط استفاده</a>
            </div>
          </div>
        </div>
      </footer>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-coal/95 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setLightboxImg(null)}
          >
            <button className="absolute top-6 right-6 text-silver hover:text-white transition-colors">
              <X size={36} strokeWidth={1.5} />
            </button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={lightboxImg} className="max-w-full max-h-full object-contain shadow-2xl" 
              onClick={(e) => e.stopPropagation()} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
