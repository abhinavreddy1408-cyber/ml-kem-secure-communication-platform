import { useState, useEffect, useRef } from 'react';
import { useTelemetry } from './hooks/useTelemetry';
import { SatelliteScene } from './components/SatelliteScene';
import { ThreatMonitor } from './components/ThreatMonitor';
import { TelemetryFeed } from './components/TelemetryFeed';
import { QuantumStateGrid } from './components/QuantumStateGrid';
import { SimulationControls } from './components/SimulationControls';
import { LandingPage } from './components/LandingPage';
import { Shield, Lock, Globe, Server, Radio, ArrowLeft, Activity, Database, AlertTriangle, Cpu, Zap, ShieldCheck, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { cn } from './lib/utils';
import { GlassCard } from './components/GlassCard';
import { Toaster, toast } from 'sonner';

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isFooterLogoHovered, setIsFooterLogoHovered] = useState(false);
  const { scrollY } = useScroll();
  const prevEncryptionRef = useRef<boolean | null>(null);
  const prevAlgoRef = useRef<string | null>(null);
  
  const { 
    data, 
    toggleEncryption, 
    setAlgorithm, 
    setSimulationParams, 
    simulateEavesdropper 
  } = useTelemetry();

  useEffect(() => {
    if (data) {
      // Alert on Encryption Mode Change
      if (prevEncryptionRef.current !== null && prevEncryptionRef.current !== data.isSelectiveEncryption) {
        if (data.isSelectiveEncryption) {
          toast.success("Selective Encryption Active", {
            description: "Optimizing bandwidth while maintaining PQC protection for metadata.",
            icon: <ShieldCheck className="w-4 h-4 text-shield-green" />
          });
        } else {
          toast.info("Full Link Encryption Active", {
            description: "Maximum security: All data packets are now fully encrypted.",
            icon: <Lock className="w-4 h-4 text-quantum-cyan" />
          });
        }
      }
      prevEncryptionRef.current = data.isSelectiveEncryption;

      // Alert on Algorithm Change
      if (prevAlgoRef.current !== null && prevAlgoRef.current !== data.activeAlgorithm) {
        toast.success(`Algorithm Switched: ${data.activeAlgorithm}`, {
          description: "Cryptographic primitives updated across all orbital nodes.",
          icon: <Cpu className="w-4 h-4 text-quantum-cyan" />
        });
      }
      prevAlgoRef.current = data.activeAlgorithm;
    }
  }, [data?.isSelectiveEncryption, data?.activeAlgorithm]);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      const scrolled = latest > 20;
      setIsScrolled(prev => {
        if (prev !== scrolled) return scrolled;
        return prev;
      });
    });
  }, [scrollY]);

  if (view === 'landing') {
    return (
      <div>
        <LandingPage onLaunch={() => setView('dashboard')} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-quantum-vacuum">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-quantum-cyan border-t-transparent rounded-full animate-spin" />
          <p className="text-quantum-cyan font-mono text-xs uppercase tracking-widest">Establishing Secure Link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-quantum-vacuum">
      <Toaster position="top-right" expand={true} richColors />
      {/* Sticky Navigation */}
      <nav className={cn(
        "sticky top-0 z-50 transition-all duration-500 mx-4 mt-4 px-8 py-5 flex items-center justify-between rounded-2xl",
        isScrolled 
          ? "bg-white/80 backdrop-blur-xl shadow-lg border border-border-luxury/50 py-4" 
          : "bg-transparent border-transparent"
      )}>
        <div className="flex items-center gap-8">
          <button 
            onClick={() => setView('landing')}
            className="p-2.5 hover:bg-black/5 rounded-full transition-all text-text-secondary hover:text-text-primary group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <motion.div 
            className="flex items-center gap-4 relative group/logo cursor-pointer"
            onMouseEnter={() => setIsLogoHovered(true)}
            onMouseLeave={() => setIsLogoHovered(false)}
          >
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-10 h-10 bg-quantum-cyan/10 rounded-full flex items-center justify-center border border-quantum-cyan/20"
            >
              <span className="text-xl font-serif font-bold text-[#C5A059]">A</span>
            </motion.div>
            
            {/* Logo Popup Animation */}
            <AnimatePresence>
              {isLogoHovered && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute top-full left-0 mt-2 bg-quantum-vacuum/90 backdrop-blur-md border border-quantum-cyan/20 px-3 py-1.5 rounded-full pointer-events-none whitespace-nowrap z-50 shadow-xl shadow-quantum-cyan/10"
                >
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">Designed by AbhinavReddy</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <h1 className="text-xl font-serif tracking-tight text-text-primary">ML-KEM<span className="text-quantum-cyan italic">Secure</span></h1>
              <p className="text-[9px] text-text-secondary uppercase tracking-[0.25em] font-medium">ML-KEM Prototype v1.2</p>
            </div>
          </motion.div>
        </div>
        <div className="hidden md:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary">
          <div className="flex items-center gap-3">
            <div className={cn("w-1.5 h-1.5 rounded-full", data.isEavesdropperActive ? "bg-breach-red" : "bg-shield-green shadow-[0_0_8px_rgba(136,160,112,0.5)]")} />
            <span className="opacity-80">{data.isEavesdropperActive ? "Compromised" : "Connected"}</span>
          </div>
          
          <div className="flex items-center gap-3 px-3 py-1 rounded-full bg-quantum-cyan/5 border border-quantum-cyan/10">
            <Lock className={cn("w-3 h-3", data.isSelectiveEncryption ? "text-text-secondary" : "text-quantum-cyan animate-pulse")} />
            <span className="text-text-primary/60">{data.isSelectiveEncryption ? "Selective" : "Full"} Encryption</span>
          </div>

          <span className="text-text-primary/60">Node: US-EAST-01</span>
        </div>
        <button 
          onClick={() => {
            // Simple visual feedback for system check
            const btn = document.activeElement as HTMLButtonElement;
            if (btn) {
              btn.innerText = "Scanning...";
              setTimeout(() => {
                btn.innerText = "System Active";
              }, 2000);
            }
          }}
          className="bg-text-primary text-white px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-quantum-cyan transition-all duration-500 shadow-md hover:scale-105 active:scale-95"
        >
          System Active
        </button>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 flex flex-col gap-8">
        {/* System Status Bar */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { label: "ML-KEM Core", status: "Active", color: "text-quantum-cyan" },
            { label: "ML-KEM Link", status: data.isEavesdropperActive ? "Compromised" : "Secure", color: data.isEavesdropperActive ? "text-breach-red" : "text-shield-green" },
            { label: "Hypervisor", status: "Nominal", color: "text-text-primary" },
            { label: "Entropy", status: "High", color: "text-entanglement-purple" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 }
              }}
              className="glass-panel p-4 rounded-2xl border-border-luxury/30 flex items-center justify-between glossy-surface hover:border-quantum-cyan/30 transition-colors group"
            >
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-secondary group-hover:text-text-primary transition-colors">{item.label}</span>
              <span className={cn("text-[9px] font-bold uppercase tracking-[0.2em]", item.color)}>{item.status}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Dashboard Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border-luxury/50 pb-10"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-quantum-cyan/5 border border-quantum-cyan/10 text-quantum-cyan text-[10px] font-bold uppercase tracking-[0.25em] mb-6">
              <Radio className="w-3 h-3 animate-pulse" />
              Live Orbital Link: LEO-7-ALPHA
            </div>
            <h2 className="text-5xl font-serif tracking-tight text-text-primary leading-tight">Operational <span className="text-quantum-cyan italic">Dashboard</span></h2>
            <p className="text-text-secondary text-base mt-4 font-light leading-relaxed">Real-time telemetry and cryptographic control interface for next-generation orbital infrastructure.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-text-secondary mb-2">ML-KEM Variant</span>
              <select 
                value={data.activeAlgorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className="bg-white/80 backdrop-blur-md border border-border-luxury rounded-full px-6 py-2.5 text-xs font-medium text-text-primary focus:outline-none focus:border-quantum-cyan transition-all shadow-sm cursor-pointer hover:border-quantum-cyan/50"
              >
                <option value="ML-KEM-768">ML-KEM-768</option>
                <option value="ML-KEM-1024">ML-KEM-1024</option>
                <option value="ML-KEM-512">ML-KEM-512</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Bento Grid Dashboard */}
        <section className="grid md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Main Visuals */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="grid md:grid-cols-2 gap-8">
              <TelemetryFeed 
                keyIndex={data.keyIndex} 
                lastKey={data.lastKey} 
                siftedKeyRate={data.siftedKeyRate} 
                isEncrypted={!data.isEavesdropperActive || !data.isSelectiveEncryption}
              />
              <ThreatMonitor 
                isBreach={data.isEavesdropperActive} 
                qber={data.qber} 
                attackVector={data.attackVector} 
              />
            </div>
            <QuantumStateGrid states={data.quantumStates} />
          </div>

          {/* Controls & Metrics */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <SimulationControls 
              noiseLevel={data.noiseLevel}
              attackVector={data.attackVector}
              isEavesdropperActive={data.isEavesdropperActive}
              onUpdateParams={setSimulationParams}
              onSimulateAttack={simulateEavesdropper}
            />

            <GlassCard
              title="Protocol Metrics"
              subtitle="ML-KEM Performance Data"
              icon={<Activity className="w-4 h-4 text-shield-green" />}
            >
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-black/5 p-4 rounded-2xl border border-border-luxury/50 group hover:border-quantum-cyan/30 transition-colors">
                    <div className="text-[9px] uppercase tracking-[0.2em] text-text-secondary mb-2 font-bold group-hover:text-quantum-cyan transition-colors">Transmitted</div>
                    <div className="text-2xl font-mono font-bold text-text-primary">{data.totalTransmitted.toLocaleString()}</div>
                    <div className="text-[9px] text-text-secondary mt-1 uppercase tracking-widest">Photons</div>
                  </div>
                  <div className="bg-black/5 p-4 rounded-2xl border border-border-luxury/50 group hover:border-shield-green/30 transition-colors">
                    <div className="text-[9px] uppercase tracking-[0.2em] text-text-secondary mb-2 font-bold group-hover:text-shield-green transition-colors">Sifted</div>
                    <div className="text-2xl font-mono font-bold text-shield-green">{data.totalSifted.toLocaleString()}</div>
                    <div className="text-[9px] text-text-secondary mt-1 uppercase tracking-widest">Matched Bases</div>
                  </div>
                </div>

                <div className="bg-black/5 p-4 rounded-2xl border border-border-luxury/50 flex items-center justify-between group hover:border-breach-red/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-breach-red/10 rounded-full flex items-center justify-center border border-breach-red/20 group-hover:scale-110 transition-transform">
                      <AlertTriangle className="w-5 h-5 text-breach-red" />
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-[0.2em] text-text-secondary font-bold group-hover:text-breach-red transition-colors">Detected Errors</div>
                      <div className="text-xl font-mono font-bold text-breach-red">{data.totalErrors.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] uppercase tracking-[0.2em] text-text-secondary font-bold">Error Rate</div>
                    <div className="text-xl font-mono font-bold text-breach-red">{(data.qber * 100).toFixed(2)}%</div>
                  </div>
                </div>

                <div className="bg-quantum-cyan/5 p-5 rounded-2xl border border-quantum-cyan/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Database className="w-4 h-4 text-quantum-cyan" />
                      <span className="text-[9px] uppercase tracking-[0.2em] text-quantum-cyan font-bold">Key Pool Efficiency</span>
                    </div>
                    <span className="text-xs font-mono text-quantum-cyan font-bold">
                      {((data.totalSifted / data.totalTransmitted) * 100 || 0).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-quantum-cyan"
                      initial={{ width: 0 }}
                      animate={{ width: `${(data.totalSifted / data.totalTransmitted) * 100 || 0}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard
              title="Crypto-Agility"
              subtitle="Hypervisor Routing"
              icon={<Cpu className="w-4 h-4" />}
            >
              <div className="flex flex-col gap-5">
                <button
                  onClick={toggleEncryption}
                  className={cn(
                    "w-full py-3.5 rounded-full border transition-all text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-sm hover:scale-[1.02] active:scale-[0.98]",
                    data.isSelectiveEncryption 
                      ? "bg-quantum-cyan/10 border-quantum-cyan/30 text-quantum-cyan" 
                      : "bg-text-primary/5 border-border-luxury text-text-primary"
                  )}
                >
                  <Zap className={cn("w-4 h-4", data.isSelectiveEncryption && "animate-pulse")} />
                  {data.isSelectiveEncryption ? "Selective Encryption Active" : "Full Link Encryption Active"}
                </button>
                <p className="text-[10px] text-text-secondary leading-relaxed font-light">
                  ML-KEM optimized encryption ensures maximum security for sensitive headers while maintaining high throughput for bulk payload.
                </p>
              </div>
            </GlassCard>
          </div>
        </section>
      </main>

      <footer className="mt-20 border-t border-border-luxury bg-white/40 py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
          <div className="flex flex-col gap-6">
            <motion.div 
              className="flex items-center gap-4 group/footer relative cursor-pointer"
              onMouseEnter={() => setIsFooterLogoHovered(true)}
              onMouseLeave={() => setIsFooterLogoHovered(false)}
            >
              <div className="w-10 h-10 bg-quantum-cyan/10 rounded-full flex items-center justify-center border border-quantum-cyan/20">
                <span className="text-xl font-serif font-bold text-[#C5A059]">A</span>
              </div>
              
              {/* Logo Popup Animation */}
              <AnimatePresence>
                {isFooterLogoHovered && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full left-0 mt-2 bg-quantum-vacuum/90 backdrop-blur-md border border-quantum-cyan/20 px-3 py-1.5 rounded-full pointer-events-none whitespace-nowrap z-50 shadow-xl shadow-quantum-cyan/10"
                  >
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">Designed by AbhinavReddy</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <span className="font-serif text-2xl tracking-tight">ML-KEM <span className="text-quantum-cyan italic">Defense</span></span>
            </motion.div>
            <p className="text-sm text-text-secondary max-w-xs leading-relaxed font-light font-sans">
              A dedicated ML-KEM (Module-Lattice-Based Key-Encapsulation Mechanism) 
              platform designed for the next generation of orbital infrastructure.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-16">
            <div className="flex flex-col gap-6">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-text-primary">Standards</h4>
              <ul className="text-[11px] text-text-secondary flex flex-col gap-3 uppercase tracking-[0.2em] font-medium">
                <li className="hover:text-quantum-cyan transition-colors cursor-pointer">FIPS 203 (ML-KEM)</li>
              </ul>
            </div>
            <div className="flex flex-col gap-6">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-text-primary">Technology</h4>
              <ul className="text-[11px] text-text-secondary flex flex-col gap-3 uppercase tracking-[0.2em] font-medium">
                <li className="hover:text-quantum-cyan transition-colors cursor-pointer">IBM Qiskit</li>
                <li className="hover:text-quantum-cyan transition-colors cursor-pointer">FastAPI / React</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
