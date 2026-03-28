import { useState, useEffect, useCallback, useRef, useLayoutEffect, memo, Suspense, lazy } from 'react';
import { motion, AnimatePresence, useScroll } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Shield, 
  Lock, 
  Zap, 
  Activity, 
  Cpu, 
  Globe, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight,
  FileText,
  Mail,
  Menu,
  X,
  Database,
  Radio,
  Send,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const QuantumHeroVisual = lazy(() => import('./QuantumHeroVisual'));
import { useContent } from '../hooks/useContent';
import { useSubmission } from '../hooks/useSubmission';

interface LandingPageProps {
  onLaunch: () => void;
}

type SystemState = 
  | 'IDLE' 
  | 'THREAT_DETECTED' 
  | 'SECURE_HANDSHAKE' 
  | 'KEY_EXCHANGE' 
  | 'SECURE_TRANSMISSION' 
  | 'ATTACK_SIMULATION' 
  | 'CRYPTO_AGILITY' 
  | 'STABLE_SECURE';

// Optimized System HUD Component to isolate re-renders
const SystemHUD = memo(({ systemState }: { systemState: SystemState }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[80] overflow-hidden">
      {/* Threat Detection Glow - box-shadow instead of blur filter */}
      <motion.div 
        animate={{ 
          opacity: systemState === 'THREAT_DETECTED' || systemState === 'ATTACK_SIMULATION' ? 1 : 0,
        }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0"
        style={{ 
          boxShadow: 'inset 0 0 200px 80px rgba(214, 125, 125, 0.12)',
          willChange: 'opacity'
        }}
      />
      
      {/* Secure Handshake / Key Exchange Glow */}
      <motion.div 
        animate={{ 
          opacity: systemState === 'SECURE_HANDSHAKE' || systemState === 'KEY_EXCHANGE' ? 1 : 0,
        }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0"
        style={{ 
          boxShadow: 'inset 0 0 250px 100px rgba(197, 160, 89, 0.08)',
          willChange: 'opacity'
        }}
      />

      {/* Secure Transmission Glow */}
      <motion.div 
        animate={{ 
          opacity: systemState === 'SECURE_TRANSMISSION' || systemState === 'STABLE_SECURE' ? 1 : 0 
        }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0"
        style={{ 
          boxShadow: 'inset 0 0 200px 80px rgba(136, 160, 112, 0.06)',
          willChange: 'opacity'
        }}
      />

      {/* System Status HUD Overlay */}
      <div className="absolute bottom-12 left-12 flex flex-col gap-2">
        <AnimatePresence mode="wait">
          <motion.div 
            key={systemState}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 }}
            className="flex items-center gap-4 bg-background-luxury/60 backdrop-blur-xl border border-border-luxury px-6 py-3 rounded-2xl shadow-2xl"
          >
            <div className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              systemState === 'IDLE' && "bg-text-secondary",
              (systemState === 'THREAT_DETECTED' || systemState === 'ATTACK_SIMULATION') && "bg-breach-red shadow-[0_0_8px_#D67D7D]",
              (systemState === 'SECURE_HANDSHAKE' || systemState === 'KEY_EXCHANGE') && "bg-accent-gold shadow-[0_0_8px_#C5A059]",
              (systemState === 'SECURE_TRANSMISSION' || systemState === 'STABLE_SECURE' || systemState === 'CRYPTO_AGILITY') && "bg-success-luxury shadow-[0_0_8px_#88A070]"
            )} />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-primary">
              System Status: {systemState.replace('_', ' ')}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
});

// Memoized Simulation Components to prevent unnecessary re-renders
const KeyExchangeSimulation = memo(({ active }: { active: boolean }) => {
  if (!active) return null;
  return (
    <div className="mb-16 relative h-24 flex items-center justify-center max-w-xl mx-auto will-change-transform">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border-2 border-dashed border-accent-gold/20 rounded-full"
      />
      <div className="flex gap-12 items-center">
        <div className="w-14 h-14 rounded-2xl bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center">
          <Shield className="w-7 h-7 text-accent-gold" />
        </div>
        <motion.div 
          animate={{ width: [0, 150, 0], x: [0, 75, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-[1px] bg-gradient-to-r from-transparent via-accent-gold to-transparent w-32"
        />
        <div className="w-14 h-14 rounded-2xl bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center">
          <Lock className="w-7 h-7 text-accent-gold" />
        </div>
      </div>
      <div className="absolute -bottom-6 text-[10px] font-mono text-accent-gold animate-pulse">
        ROTATING QUANTUM KEYS: 4096-BIT ENTROPY
      </div>
    </div>
  );
});

const AttackDeflectionAlert = memo(({ active }: { active: boolean }) => {
  if (!active) return null;
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="mb-10 p-5 rounded-2xl bg-breach-red/5 border border-breach-red/20 flex items-center gap-5 will-change-transform"
    >
      <div className="w-12 h-12 bg-breach-red/20 rounded-xl flex items-center justify-center">
        <Zap className="w-6 h-6 text-breach-red animate-pulse" />
      </div>
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-breach-red">Brute Force Attempt Deflected</div>
        <div className="text-[9px] font-mono text-breach-red/60">SOURCE: 192.168.1.255 | METHOD: QUANTUM ANNEALING</div>
      </div>
    </motion.div>
  );
});

const CryptoAgilitySimulation = memo(({ active }: { active: boolean }) => {
  if (!active) return null;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12 flex items-center justify-center gap-8 will-change-transform"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-accent-gold/20 border border-accent-gold/40 flex items-center justify-center">
          <span className="text-[10px] font-bold">RSA</span>
        </div>
        <span className="text-[8px] uppercase tracking-widest opacity-40">Legacy</span>
      </div>
      <motion.div 
        animate={{ x: [0, 20, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <ArrowRight className="w-4 h-4 text-accent-gold" />
      </motion.div>
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-success-luxury/20 border border-success-luxury/40 flex items-center justify-center shadow-[0_0_20px_rgba(136,160,112,0.3)]">
          <span className="text-[10px] font-bold text-success-luxury">ML-KEM</span>
        </div>
        <span className="text-[8px] uppercase tracking-widest text-success-luxury font-bold">Active</span>
      </div>
    </motion.div>
  );
});

export function LandingPage({ onLaunch }: LandingPageProps) {
  const [systemState, setSystemState] = useState<SystemState>('IDLE');
  const systemStateRef = useRef<SystemState>('IDLE');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const activeSlideIndexRef = useRef(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isFooterLogoHovered, setIsFooterLogoHovered] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLElement | null)[]>([]);

  const { content, loading: contentLoading } = useContent();
  const { submit: submitContact, submitting: contactSubmitting, success: contactSuccess } = useSubmission();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitContact(contactForm);
    if (!contactSubmitting) setContactForm({ name: '', email: '', message: '' });
  };

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const slides = slidesRef.current.filter(Boolean) as HTMLElement[];
    if (slides.length === 0) return;

    // Set initial states - optimized with will-change and autoAlpha
    slides.forEach((slide, i) => {
      gsap.set(slide, { 
        scale: i === 0 ? 1 : 0.01, 
        autoAlpha: i === 0 ? 1 : 0, 
        zIndex: slides.length - i,
        pointerEvents: i === 0 ? 'auto' : 'none',
        transformOrigin: "center center",
        willChange: 'transform, opacity',
        force3D: true
      });
    });

    const states: SystemState[] = [
      'IDLE', 
      'THREAT_DETECTED', 
      'SECURE_HANDSHAKE', 
      'KEY_EXCHANGE', 
      'SECURE_TRANSMISSION', 
      'ATTACK_SIMULATION', 
      'CRYPTO_AGILITY', 
      'STABLE_SECURE'
    ];

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        pin: viewportRef.current,
        pinSpacing: false,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Use ticker to sync state update with animation frame
          const progress = self.progress;
          const index = Math.min(Math.floor(progress * states.length), states.length - 1);
          const newState = states[index];
          
          if (newState !== systemStateRef.current) {
            systemStateRef.current = newState;
            // Batch state update to next tick
            gsap.ticker.add(() => {
              setSystemState(newState);
            }, true, true);
          }

          // Track active slide for lazy loading
          const slideIndex = Math.min(Math.floor(progress * slides.length), slides.length - 1);
          if (slideIndex !== activeSlideIndexRef.current) {
            activeSlideIndexRef.current = slideIndex;
            gsap.ticker.add(() => {
              setActiveSlideIndex(slideIndex);
            }, true, true);
          }
        }
      }
    });

    slides.forEach((slide, i) => {
      // Current slide zooms past camera
      if (i < slides.length - 1) {
        tl.to(slide, {
          scale: 10, // Slightly reduced for better rasterization
          autoAlpha: 0,
          ease: "power2.in",
          duration: 1,
          lazy: true,
          force3D: true
        }, i);
        
        // Disable interaction and hide completely
        tl.set(slide, { pointerEvents: 'none', visibility: 'hidden' }, i + 0.5);
      }

      // Next slide zooms in from infinite depth
      if (i > 0) {
        tl.to(slide, {
          scale: 1,
          autoAlpha: 1,
          ease: "power2.out",
          duration: 1,
          lazy: true,
          force3D: true
        }, i - 1);
        
        // Enable interaction
        tl.set(slide, { pointerEvents: 'auto', visibility: 'visible' }, i - 0.5);
      }

      // Consolidate content parallax to a single wrapper if possible, 
      // or at least optimize the existing ones
      const contentWrapper = slide.querySelector('.max-w-7xl');
      if (contentWrapper && i < slides.length - 1) {
        tl.to(contentWrapper, {
          opacity: 0,
          scale: 1.2,
          ease: "power2.in",
          duration: 0.3, // Faster fade out to prevent overlapping text
          lazy: true,
          force3D: true
        }, i);
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [contentLoading]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const scrolled = window.scrollY > 50;
          setIsScrolled(prev => {
            if (prev !== scrolled) return scrolled;
            return prev;
          });
          ticking = false;
        });
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-background-luxury text-text-primary selection:bg-accent-gold/30 font-sans overflow-x-hidden">
      <SystemHUD systemState={systemState} />

      {/* Navbar */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
        isScrolled 
          ? "h-20 bg-background-luxury/80 backdrop-blur-xl border-b border-border-luxury shadow-lg" 
          : "h-24 bg-transparent border-b border-transparent"
      )}>
        <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-4 relative group/logo cursor-pointer" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            onMouseEnter={() => setIsLogoHovered(true)}
            onMouseLeave={() => setIsLogoHovered(false)}
          >
            <div className="w-12 h-12 bg-accent-gold/10 rounded-2xl flex items-center justify-center border border-accent-gold/20 group-hover/logo:border-accent-gold/50 transition-all duration-500">
              <span className="text-2xl font-serif font-bold text-[#C5A059]">A</span>
            </div>

            {/* Logo Popup Animation */}
            <AnimatePresence>
              {isLogoHovered && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute top-full left-0 mt-2 bg-background-luxury/90 backdrop-blur-md border border-accent-gold/20 px-4 py-1.5 rounded-full pointer-events-none whitespace-nowrap z-50 shadow-2xl shadow-accent-gold/10"
                >
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059]">Designed by AbhinavReddy</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <span className="text-xl font-serif font-bold tracking-tight block leading-none text-text-primary">Tech Titans</span>
              <span className="text-[10px] text-text-secondary uppercase tracking-[0.3em] font-bold">Quantum Defense</span>
            </div>
          </motion.div>

          <div className="hidden md:flex items-center gap-12">
            {['Features', 'Security', 'Technology', 'Docs', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-secondary hover:text-accent-gold transition-colors duration-300"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={onLaunch}
              className="hidden sm:flex items-center gap-3 bg-accent-gold text-white px-8 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-accent-gold/90 hover:scale-105 active:scale-95 transition-all duration-500 shadow-lg shadow-accent-gold/20"
            >
              Launch Prototype
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button 
              className="md:hidden text-text-primary p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-quantum-vacuum pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-8">
              {['Features', 'Security', 'Technology', 'Docs'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-bold uppercase tracking-tighter text-text-primary border-b border-white/5 pb-4"
                >
                  {item}
                </a>
              ))}
              <button 
                onClick={onLaunch}
                className="w-full bg-quantum-cyan text-quantum-vacuum py-4 rounded-2xl font-bold uppercase tracking-widest text-sm"
              >
                Launch Prototype
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Depth Scroll Container (The Timeline) */}
      <div ref={containerRef} className="relative h-[800vh] bg-background-luxury">
        {/* Sticky Viewport (The Camera Lens) */}
        <div ref={viewportRef} className="sticky top-0 h-screen w-full overflow-hidden" style={{ perspective: '1200px' }}>
          
          {/* Slide 1: Hero Section */}
          <section 
            ref={el => { slidesRef.current[0] = el; }}
            className="absolute inset-0 w-full h-full flex items-center justify-center z-50"
          >
            <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
              {/* Simplified Hero Visual for Depth Scroll */}
              <div className="absolute inset-0 z-0">
                <div className="w-full h-full relative">
                  <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-accent-gold/5 blur-[120px] rounded-full pointer-events-none" />
                  <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-mist-gray/10 blur-[120px] rounded-full pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-accent-gold/5 to-mist-gray/5 blur-[100px] rounded-full animate-pulse" />
                  {activeSlideIndex <= 1 && (
                    <Suspense fallback={<div className="w-full h-full bg-background-luxury" />}>
                      <QuantumHeroVisual scrollProgress={scrollYProgress} systemState={systemState} />
                    </Suspense>
                  )}
                </div>
              </div>

              <div className="max-w-7xl mx-auto w-full px-8 relative z-30 pt-32 mt-20 sm:pt-40 sm:mt-0 md:pt-48 md:mt-0 lg:pt-24 lg:mt-0">
                {activeSlideIndex <= 1 && (
                  <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                      <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/40 backdrop-blur-md border border-border-luxury text-accent-gold text-[10px] font-bold uppercase tracking-[0.3em] mb-10 shadow-sm">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-gold opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-gold"></span>
                        </span>
                        Next-Gen Orbital Security
                      </div>
                      
                      <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight leading-[0.9] mb-10 text-luxury-gradient">
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-accent-gold/10 border border-accent-gold/20 mb-8"
                        >
                          <div className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
                          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-gold">ML-KEM Protection Active</span>
                        </motion.div>
                        <br />
                        {content?.hero.title || "The Future of"} <br />
                        <span className="italic text-accent-gold/80">{content?.hero.subtitle || "ML-KEM"}</span> <br />
                        Defense.
                      </h1>
                      
                      <p className="text-text-secondary text-lg md:text-xl max-w-xl leading-relaxed mb-12 font-light tracking-wide">
                        {content?.problem.description || "Secure your orbital infrastructure with the world's most advanced post-quantum protection. Our ML-KEM implementation provides unassailable security for the next generation of satellite communication."}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-8">
                        <button 
                          onClick={onLaunch}
                          className="group relative bg-text-primary text-white px-12 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] overflow-hidden transition-all duration-700 shadow-2xl shadow-text-primary/20"
                        >
                          <div className="absolute inset-0 bg-accent-gold/20 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                          <span className="relative z-10 flex items-center gap-4">
                            Start Simulation
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
                          </span>
                        </button>
                        <a 
                          href="#docs"
                          className="group px-12 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] border border-border-luxury hover:border-accent-gold/30 transition-all duration-700 text-text-primary bg-white/30 backdrop-blur-sm inline-block"
                        >
                          <span className="group-hover:text-accent-gold transition-colors duration-500">View Whitepaper</span>
                        </a>
                      </div>

                      <div className="mt-20 flex items-center gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-text-secondary">Standardized By</span>
                          <span className="text-sm font-serif font-bold tracking-tight">NIST FIPS 203</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-text-secondary">Powered By</span>
                          <span className="text-sm font-serif font-bold tracking-tight">IBM QISKIT</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-text-secondary">Engineered For</span>
                          <span className="text-sm font-serif font-bold tracking-tight">LEO/MEO ARRAYS</span>
                        </div>
                      </div>
                    </div>

                    <div className="relative hidden lg:block">
                      <div className="absolute -bottom-12 -left-12 bg-white/60 backdrop-blur-xl p-8 rounded-[32px] border border-border-luxury shadow-2xl animate-bounce-slow glossy-surface">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-success-luxury/10 rounded-2xl flex items-center justify-center">
                            <Activity className="w-7 h-7 text-success-luxury" />
                          </div>
                          <div>
                            <div className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold">System Status</div>
                            <div className="text-base font-serif font-bold text-success-luxury tracking-tight">Nominal Operational</div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-1/4 -right-12 bg-white/60 backdrop-blur-xl p-8 rounded-[32px] border border-border-luxury shadow-2xl animate-float glossy-surface">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-accent-gold/10 rounded-2xl flex items-center justify-center">
                            <Zap className="w-7 h-7 text-accent-gold" />
                          </div>
                          <div>
                            <div className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold">Key Rotation</div>
                            <div className="text-base font-serif font-bold text-text-primary tracking-tight tabular-nums">1,000 Hz</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>


          {/* Slide 2: Features */}
          <section 
            ref={el => { slidesRef.current[1] = el; }}
            className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none opacity-0"
          >
            <div className="max-w-7xl mx-auto px-8 w-full">
              {Math.abs(activeSlideIndex - 1) <= 1 && (
                <>
                  <div className="mb-20 text-center">
                    {systemState === 'THREAT_DETECTED' && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-12 p-6 rounded-2xl bg-breach-red/10 border border-breach-red/30 backdrop-blur-md max-w-xl mx-auto"
                      >
                        <div className="flex items-center justify-center gap-4 mb-4">
                          <AlertTriangle className="w-6 h-6 text-breach-red animate-bounce" />
                          <span className="text-sm font-bold uppercase tracking-widest text-breach-red">Quantum Threat Detected</span>
                        </div>
                        <div className="space-y-2">
                          <div className="h-1 w-full bg-breach-red/20 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: "0%" }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="h-full bg-breach-red"
                            />
                          </div>
                          <p className="text-[10px] text-breach-red/70 font-mono">ANALYZING ATTACK VECTOR: SHOR'S ALGORITHM VARIANT...</p>
                        </div>
                      </motion.div>
                    )}
                    <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold mb-6">Core Capabilities</div>
                    <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-luxury-gradient">
                      ML-KEM <span className="italic">Post-Quantum</span> Defense.
                    </h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    {[
                      {
                        icon: <Lock className="w-8 h-8" />,
                        title: "Lattice-Based Security",
                        desc: "ML-KEM (FIPS 203) algorithms designed to withstand Shor's algorithm and other quantum-scale attacks.",
                      },
                      {
                        icon: <Cpu className="w-8 h-8" />,
                        title: "High-Throughput KEM",
                        desc: "Optimized key encapsulation for low-latency orbital links without hardware overhead.",
                      }
                    ].map((feature, idx) => (
                      <div key={idx} className="group p-10 rounded-[40px] bg-white/40 backdrop-blur-md border border-border-luxury hover:border-accent-gold/30 transition-all duration-700 hover:-translate-y-2 glossy-surface">
                        <div className="w-16 h-16 bg-accent-gold/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 text-accent-gold">
                          {feature.icon}
                        </div>
                        <h3 className="text-2xl font-serif font-bold mb-4 tracking-tight">{feature.title}</h3>
                        <p className="text-text-secondary leading-relaxed font-light">{feature.desc}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Slide 3: How It Works */}
          <section 
            ref={el => { slidesRef.current[2] = el; }}
            className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none opacity-0"
          >
            <div className="max-w-7xl mx-auto px-8 w-full">
              {Math.abs(activeSlideIndex - 2) <= 1 && (
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent-gold/10 blur-[120px] rounded-full animate-pulse" />
                    <div className="relative aspect-square rounded-[60px] border border-border-luxury bg-white/20 backdrop-blur-2xl overflow-hidden shadow-2xl glossy-surface flex items-center justify-center">
                      <div className="w-3/4 h-3/4 border-2 border-dashed border-accent-gold/20 rounded-full animate-spin-slow flex items-center justify-center">
                        <div className="w-1/2 h-1/2 border-2 border-accent-gold/40 rounded-full animate-reverse-spin flex items-center justify-center">
                          <div className="w-1/4 h-1/4 bg-accent-gold rounded-full shadow-[0_0_50px_rgba(197,160,89,0.5)]" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    {systemState === 'SECURE_HANDSHAKE' && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-12 flex flex-col gap-4"
                      >
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-accent-gold">PQC Handshake</span>
                          <span className="text-[10px] font-mono text-accent-gold/60">ESTABLISHING ENTROPY...</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {[1, 2, 3, 4].map((i) => (
                            <motion.div 
                              key={i}
                              animate={{ 
                                opacity: [0.3, 1, 0.3],
                                scaleY: [1, 1.5, 1]
                              }}
                              transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                              className="h-8 bg-accent-gold/20 rounded-sm border border-accent-gold/30"
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                    <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold mb-6">The Protocol</div>
                    <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-10 text-luxury-gradient leading-tight">
                      ML-KEM <br /><span className="italic">Encapsulation</span> Flow.
                    </h2>
                    <div className="space-y-10">
                      {[
                        { title: "Secure Handshake", desc: "Establish a PQC-authenticated channel using ML-KEM to protect against immediate quantum threats." },
                        { title: "Key Generation", desc: "Generate secure shared secrets using lattice-based cryptography, ensuring unassailable privacy." },
                        { title: "Encapsulation", desc: "Encapsulate keys for secure distribution across orbital nodes with minimal overhead." }
                      ].map((step, idx) => (
                        <div key={idx} className="flex gap-8 group">
                          <div className="flex-shrink-0 w-12 h-12 rounded-full border border-border-luxury flex items-center justify-center text-sm font-serif font-bold group-hover:bg-accent-gold group-hover:text-white transition-all duration-500">
                            0{idx + 1}
                          </div>
                          <div>
                            <h3 className="text-xl font-serif font-bold mb-2 tracking-tight">{step.title}</h3>
                            <p className="text-text-secondary font-light leading-relaxed">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Slide 4: Security */}
          <section 
            ref={el => { slidesRef.current[3] = el; }}
            className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none opacity-0"
          >
            <div className="max-w-7xl mx-auto px-8 w-full">
              {Math.abs(activeSlideIndex - 3) <= 1 && (
                <>
                  <div className="mb-20 text-center">
                    <KeyExchangeSimulation active={systemState === 'KEY_EXCHANGE'} />
                    <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold mb-6">Threat Mitigation</div>
                    <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-luxury-gradient">
                      Unassailable <span className="italic">Protection</span>.
                    </h2>
                  </div>
                  <div className="grid md:grid-cols-1 max-w-2xl mx-auto">
                    <div className="p-12 rounded-[40px] bg-white/40 backdrop-blur-md border border-border-luxury glossy-surface overflow-hidden">
                      <h3 className="text-2xl font-serif font-bold mb-8 tracking-tight flex items-center gap-4">
                        <div className="w-10 h-10 bg-accent-gold/10 rounded-xl flex items-center justify-center">
                          <Shield className="w-5 h-5 text-accent-gold" />
                        </div>
                        ML-KEM Core Security
                      </h3>
                      <ul className="space-y-6">
                        {["Lattice-based ML-KEM (FIPS 203)", "Shor's Algorithm Resistance", "Optimized Orbital Handshake", "NIST Standardized Primitives"].map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-4 text-text-secondary font-light">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-gold" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Slide 5: Technology Stack */}
          <section 
            ref={el => { slidesRef.current[4] = el; }}
            className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none opacity-0"
          >
            <div className="max-w-7xl mx-auto px-8 w-full">
              {Math.abs(activeSlideIndex - 4) <= 1 && (
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold mb-6">The Stack</div>
                    <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-10 text-luxury-gradient leading-tight">
                      Engineered for <br /><span className="italic">Performance</span>.
                    </h2>
                    <div className="grid grid-cols-2 gap-8">
                      {[
                        { icon: <Cpu className="w-6 h-6" />, title: "Rust Core", desc: "Memory-safe primitives" },
                        { icon: <Globe className="w-6 h-6" />, title: "Global Mesh", desc: "Distributed network" },
                        { icon: <Activity className="w-6 h-6" />, title: "Real-time", desc: "ML-KEM telemetry" },
                        { icon: <Shield className="w-6 h-6" />, title: "FIPS 203", desc: "NIST Standardized" }
                      ].map((tech, idx) => (
                        <div key={idx} className="p-6 rounded-3xl bg-white/40 border border-border-luxury glossy-surface">
                          <div className="text-accent-gold mb-4">{tech.icon}</div>
                          <h4 className="font-serif font-bold mb-1">{tech.title}</h4>
                          <p className="text-[11px] text-text-secondary uppercase tracking-wider">{tech.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="relative aspect-video rounded-[40px] border border-border-luxury bg-black/5 overflow-hidden glossy-surface flex items-center justify-center">
                     <div className="text-accent-gold/20 font-serif italic text-4xl">System Architecture</div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Slide 6: Documentation & Trust */}
          <section 
            ref={el => { slidesRef.current[5] = el; }}
            className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none opacity-0"
          >
            <div className="max-w-7xl mx-auto px-8 w-full">
              {Math.abs(activeSlideIndex - 5) <= 1 && (
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                  <div>
                    <AttackDeflectionAlert active={systemState === 'ATTACK_SIMULATION'} />
                    <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-10 text-luxury-gradient leading-tight">
                      Protocol <br /><span className="italic">Documentation</span>.
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        { title: "Quantum Whitepaper", size: "2.4 MB" },
                        { title: "API Reference v1.2", size: "1.1 MB" },
                        { title: "PQC Standard Guide", size: "850 KB" }
                      ].map((doc, idx) => (
                        <div key={idx} className="p-6 rounded-2xl bg-white/40 border border-border-luxury glossy-surface flex items-center justify-between">
                          <div>
                            <h4 className="font-serif font-bold">{doc.title}</h4>
                            <p className="text-[10px] text-text-secondary uppercase tracking-widest">{doc.size}</p>
                          </div>
                          <FileText className="w-5 h-5 text-accent-gold" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-12 rounded-[48px] bg-background-luxury border border-border-luxury shadow-2xl glossy-surface">
                    <p className="text-2xl font-serif italic text-text-primary leading-relaxed mb-8">
                      "The integration of PQC and QKD into a single hypervisor is a game-changer for our LEO constellation security."
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-accent-gold/20" />
                      <div>
                        <div className="font-serif font-bold">Dr. Elena Vance</div>
                        <div className="text-[10px] text-taupe-luxury uppercase tracking-widest font-bold">CTO, Orbital Dynamics</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Slide 7: Dashboard Preview */}
          <section 
            ref={el => { slidesRef.current[6] = el; }}
            className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none opacity-0"
          >
            <div className="max-w-7xl mx-auto px-8 w-full text-center">
              {Math.abs(activeSlideIndex - 6) <= 1 && (
                <>
                  <div className="mb-12">
                    <CryptoAgilitySimulation active={systemState === 'CRYPTO_AGILITY'} />
                    <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold mb-6">Operational Interface</div>
                    <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-luxury-gradient">
                      Mission-Critical <br /><span className="italic">Control</span>.
                    </h2>
                  </div>
                  <div 
                    className="relative max-w-5xl mx-auto aspect-video bg-background-luxury rounded-[48px] overflow-hidden border border-border-luxury shadow-2xl glossy-surface cursor-pointer group"
                    onClick={onLaunch}
                  >
                    <div className="absolute inset-0 bg-accent-gold/5 flex items-center justify-center">
                      <div className="text-center group-hover:scale-110 transition-transform duration-700">
                        <Activity className="w-16 h-16 text-accent-gold mx-auto mb-6 animate-pulse" />
                        <div className="text-white font-serif font-bold uppercase tracking-[0.3em] text-xs">Enter Command Center</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Slide 8: Final CTA & Contact */}
          <section 
            ref={el => { slidesRef.current[7] = el; }}
            className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none opacity-0"
          >
            <div className="max-w-7xl mx-auto px-8 w-full">
              {Math.abs(activeSlideIndex - 7) <= 1 && (
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                <div className="text-center lg:text-left">
                  <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-10 text-luxury-gradient leading-[0.9]">
                    Secure Your <br /><span className="italic text-accent-gold/80">Future</span>.
                  </h2>
                  <p className="text-text-secondary text-lg mb-12 font-light leading-relaxed">
                    Join the elite organizations building unhackable infrastructure for the next generation of digital assets.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                    <button 
                      onClick={onLaunch}
                      className="bg-accent-gold text-white px-12 py-6 rounded-full font-serif font-bold uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-accent-gold/30 hover:scale-105 transition-transform"
                    >
                      Launch Prototype
                    </button>
                    <div className="flex items-center gap-4 text-text-secondary">
                      <Mail className="w-5 h-5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">secure@techtitans.quantum</span>
                    </div>
                  </div>
                </div>
                <div className="p-10 rounded-[48px] bg-white border border-border-luxury shadow-2xl glossy-surface">
                  {contactSuccess ? (
                    <div className="text-center py-10">
                      <CheckCircle2 className="w-12 h-12 text-success-luxury mx-auto mb-6" />
                      <h4 className="text-2xl font-serif font-bold mb-2">Transmission Received</h4>
                      <p className="text-text-secondary text-sm">Our defense specialists will reach out shortly.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-6">
                      <input 
                        type="text" 
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Full Name"
                        className="w-full bg-black/5 border border-border-luxury rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-accent-gold transition-all"
                      />
                      <input 
                        type="email" 
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="Secure Email"
                        className="w-full bg-black/5 border border-border-luxury rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-accent-gold transition-all"
                      />
                      <textarea 
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Inquiry Details"
                        rows={4}
                        className="w-full bg-black/5 border border-border-luxury rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-accent-gold transition-all resize-none"
                      />
                      <button 
                        type="submit"
                        disabled={contactSubmitting}
                        className="w-full bg-text-primary text-white py-5 rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-4 hover:bg-accent-gold transition-all disabled:opacity-50"
                      >
                        {contactSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Secure Message"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
              )}
              
              {/* Simple Footer inside the last slide */}
              <div className="mt-20 pt-10 border-t border-border-luxury flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-bold uppercase tracking-[0.2em] text-text-secondary">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-accent-gold/10 rounded-lg flex items-center justify-center border border-accent-gold/20">
                    <span className="text-xs font-serif font-bold text-[#C5A059]">A</span>
                  </div>
                  <span>Tech Titans Security © 2026</span>
                </div>
                <div className="flex gap-8">
                  <a href="#" className="hover:text-accent-gold transition-colors">Privacy</a>
                  <a href="#" className="hover:text-accent-gold transition-colors">Terms</a>
                  <a href="#" className="hover:text-accent-gold transition-colors">Audit</a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}


