import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Mail, MapPin, ChevronLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Toaster as SonnerToaster, toast } from 'sonner';

// Images
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

const queryClient = new QueryClient();

// Form validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'نام باید حداقل ۲ حرف باشد'),
  phone: z.string().min(8, 'شماره تماس معتبر نیست'),
  email: z.string().email('ایمیل معتبر نیست').optional().or(z.literal('')),
  message: z.string().min(10, 'پیام باید حداقل ۱۰ حرف باشد')
});

type ContactFormValues = z.infer<typeof contactSchema>;

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Form handling
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = (data: ContactFormValues) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        toast.success('پیام شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.');
        reset();
        resolve(true);
      }, 1000);
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'خانه', href: '#home' },
    { name: 'خدمات', href: '#services' },
    { name: 'نمونه‌کارها', href: '#portfolio' },
    { name: 'درباره ما', href: '#about' },
    { name: 'تماس', href: '#contact' }
  ];

  const services = [
    { id: 1, title: 'کابینت آشپزخانه', desc: 'طراحی و اجرای کابینت‌های لوکس با تلفیق چوب طبیعی و متریال‌های مدرن.', img: sKitchen },
    { id: 2, title: 'درب‌های داخلی', desc: 'درب‌های تمام چوب با جزئیات دقیق و استحکام بی‌نظیر برای فضاهای خاص.', img: sDoor },
    { id: 3, title: 'دیوار TV', desc: 'دیوارهای دکوراتیو چوبی، نقطه‌ی کانونی و شاهکار نشیمن شما.', img: sTvwall },
    { id: 4, title: 'کمد و جاکفشی', desc: 'کمدهای دیواری سفارشی با طراحی ارگونومیک و نورپردازی هوشمند.', img: sWardrobe },
    { id: 5, title: 'دکوراسیون داخلی', desc: 'طراحی جامع و اجرای دکوراسیون چوبی متناسب با سبک زندگی شما.', img: sDecor },
    { id: 6, title: 'مشاوره طراحی', desc: 'همراهی شما از ایده تا اجرا توسط مهندسین و طراحان برجسته.', img: sConsult },
  ];

  const portfolioImages = [p1, p2, p3, p4, p5, p6, p7, p8];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-background/90 backdrop-blur-md border-b border-border py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
          <div className="flex-1 hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-sm font-medium hover:text-primary transition-colors duration-300">
                {link.name}
              </a>
            ))}
          </div>
          
          <div className="text-2xl font-bold tracking-tight text-primary">
            توسکا چوب
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-foreground focus:outline-none">
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-medium hover:text-primary transition-colors"
              >
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="relative h-screen w-full flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
            src={heroImg} 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/60" />
        </div>
        
        <div className="container relative z-10 mx-auto px-6 max-w-7xl">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.div variants={fadeInUp} className="w-16 h-1 bg-primary mb-8" />
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              هنر چوب، <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-700">معماری فضا</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-foreground/80 mb-12 leading-relaxed max-w-2xl">
              تجلی اصالت و هنر در دل معماری مدرن. ما در توسکا چوب، فضاها را با چوب‌های اصیل و طراحی‌های بی‌نظیر، بازتعریف می‌کنیم.
            </motion.p>
            <motion.a 
              variants={fadeInUp}
              href="#portfolio" 
              className="inline-block px-10 py-4 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-500 font-medium"
            >
              مشاهده نمونه‌کارها
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 md:py-32 relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mb-16 md:mb-24 flex flex-col items-center text-center"
          >
            <div className="text-primary text-sm font-bold uppercase tracking-[0.2em] mb-4">خدمات ما</div>
            <h2 className="text-3xl md:text-5xl font-bold">شاهکارهای چوبی سفارشی</h2>
            <div className="w-24 h-px bg-border mt-8" />
          </motion.div>

          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
          >
            {services.map(s => (
              <motion.div key={s.id} variants={fadeInUp} className="group cursor-pointer">
                <div className="relative h-80 overflow-hidden mb-6">
                  <img src={s.img} alt={s.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-700" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-primary/50 transition-colors duration-700" />
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-24 md:py-32 bg-card border-y border-border/50">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mb-16 md:mb-24 flex flex-col items-center text-center"
          >
            <div className="text-primary text-sm font-bold uppercase tracking-[0.2em] mb-4">نمونه‌کارها</div>
            <h2 className="text-3xl md:text-5xl font-bold">تجلی زیبایی در اجرا</h2>
            <div className="w-24 h-px bg-border mt-8" />
          </motion.div>

          <div className="columns-1 md:columns-2 lg:columns-4 gap-4 space-y-4">
            {portfolioImages.map((img, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="break-inside-avoid relative group overflow-hidden cursor-pointer"
                onClick={() => setLightboxImage(img)}
              >
                <img src={img} alt={`Portfolio ${idx + 1}`} className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/60 transition-colors duration-500 flex items-center justify-center backdrop-blur-none group-hover:backdrop-blur-sm">
                  <span className="opacity-0 group-hover:opacity-100 text-foreground font-medium transition-all duration-500 translate-y-4 group-hover:translate-y-0 flex items-center gap-2">
                    مشاهده تصویر
                    <ChevronLeft size={16} />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 md:p-12 cursor-pointer"
            onClick={() => setLightboxImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); setLightboxImage(null); }}
            >
              <X size={40} strokeWidth={1} />
            </button>
            <motion.img 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              src={lightboxImage} 
              className="max-w-full max-h-full object-contain shadow-2xl" 
              onClick={(e) => e.stopPropagation()} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* About Section */}
      <section id="about" className="py-24 md:py-32">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
              className="w-full lg:w-1/2 relative"
            >
              <div className="aspect-[4/5] relative overflow-hidden ring-1 ring-border">
                <img src={aboutImg} alt="About Tooska Choob" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 border-b-2 border-r-2 border-primary hidden md:block" />
            </motion.div>
            
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
              className="w-full lg:w-1/2"
            >
              <div className="text-primary text-sm font-bold uppercase tracking-[0.2em] mb-4">درباره ما</div>
              <h2 className="text-3xl md:text-5xl font-bold mb-8">هنر دست، دقت معماری</h2>
              <p className="text-muted-foreground text-lg leading-loose mb-10">
                توسکا چوب، با بیش از ۱۵ سال تجربه در طراحی و ساخت محصولات چوبی لوکس، تلفیقی از هنر دست استادکاران ایرانی و دانش معماری روز دنیاست. ما بر این باوریم که هر قطعه چوب، داستانی برای گفتن دارد. محصولات ما تنها مبلمان نیستند، بلکه روح زنده طبیعت در فضای زندگی شمایند. دقت در انتخاب بهترین متریال، ظرافت در اجرا و تعهد به کیفیت، امضای کار ماست.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-10 border-t border-border">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">۱۵+</div>
                  <div className="text-sm font-medium text-foreground">سال تجربه</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">۵۰۰+</div>
                  <div className="text-sm font-medium text-foreground">پروژه موفق</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">۱۰۰٪</div>
                  <div className="text-sm font-medium text-foreground">رضایت مشتری</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 md:py-32 bg-card relative overflow-hidden border-t border-border/50">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-background hidden lg:block" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
              className="w-full lg:w-1/3"
            >
              <div className="text-primary text-sm font-bold uppercase tracking-[0.2em] mb-4">ارتباط با ما</div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">آغاز یک مسیر</h2>
              <p className="text-muted-foreground mb-12">
                برای مشاوره و سفارش، با ما در تماس باشید. تیم ما آماده پاسخگویی به سوالات شما و خلق فضایی بی‌نظیر است.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-none border border-border flex items-center justify-center text-primary shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">آدرس</h4>
                    <p className="text-muted-foreground text-sm">تهران، نیاوران، خیابان اصلی، پلاک ۱۲<br/>استودیو توسکا چوب</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-none border border-border flex items-center justify-center text-primary shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">تلفن</h4>
                    <p className="text-muted-foreground text-sm flex flex-col" dir="ltr">
                      <span>+98 21 1234 5678</span>
                      <span>+98 912 345 6789</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-none border border-border flex items-center justify-center text-primary shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">ایمیل</h4>
                    <p className="text-muted-foreground text-sm">info@tooskachoob.ir</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
              className="w-full lg:w-2/3"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="bg-background p-8 md:p-12 border border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <label className="block text-sm font-medium mb-3 text-foreground/80">نام و نام خانوادگی</label>
                    <input 
                      {...register('name')}
                      className={`w-full bg-transparent border-b ${errors.name ? 'border-destructive' : 'border-border focus:border-primary'} py-3 px-1 transition-colors focus:outline-none`}
                      placeholder="علی رضایی"
                    />
                    {errors.name && <p className="text-destructive text-xs mt-2">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-3 text-foreground/80">شماره تماس</label>
                    <input 
                      {...register('phone')}
                      className={`w-full bg-transparent border-b ${errors.phone ? 'border-destructive' : 'border-border focus:border-primary'} py-3 px-1 transition-colors focus:outline-none`}
                      placeholder="09123456789"
                      dir="ltr"
                    />
                    {errors.phone && <p className="text-destructive text-xs mt-2">{errors.phone.message}</p>}
                  </div>
                </div>
                
                <div className="mb-8">
                  <label className="block text-sm font-medium mb-3 text-foreground/80">ایمیل (اختیاری)</label>
                  <input 
                    {...register('email')}
                    className={`w-full bg-transparent border-b ${errors.email ? 'border-destructive' : 'border-border focus:border-primary'} py-3 px-1 transition-colors focus:outline-none`}
                    placeholder="example@mail.com"
                    dir="ltr"
                  />
                  {errors.email && <p className="text-destructive text-xs mt-2">{errors.email.message}</p>}
                </div>
                
                <div className="mb-10">
                  <label className="block text-sm font-medium mb-3 text-foreground/80">پیام شما</label>
                  <textarea 
                    {...register('message')}
                    rows={4}
                    className={`w-full bg-transparent border-b ${errors.message ? 'border-destructive' : 'border-border focus:border-primary'} py-3 px-1 transition-colors focus:outline-none resize-none`}
                    placeholder="جزئیات پروژه یا سوال خود را اینجا بنویسید..."
                  />
                  {errors.message && <p className="text-destructive text-xs mt-2">{errors.message.message}</p>}
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-10 py-4 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'در حال ارسال...' : 'ارسال پیام'}
                </button>
              </form>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-border">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-2xl font-bold tracking-tight text-primary">
            توسکا چوب
          </div>
          <p className="text-muted-foreground text-sm">
            © ۱۴۰۳ توسکا چوب. کلیه حقوق محفوظ است.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={Home} />
    </Switch>
  );
}

function App() {
  // Ensure RTL on mount for safety, though global CSS handles it
  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'fa';
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Router />
      </WouterRouter>
      <SonnerToaster position="bottom-center" theme="dark" dir="rtl" />
    </QueryClientProvider>
  );
}

export default App;
