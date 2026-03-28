import { useMemo, memo } from 'react';
import { motion } from 'motion/react';
import { Shield, AlertTriangle } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface ThreatMonitorProps {
  isBreach: boolean;
  qber: number;
  attackVector: string;
}

export const ThreatMonitor = memo(function ThreatMonitor({ isBreach, qber, attackVector }: ThreatMonitorProps) {
  const points = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      x: i * 20,
      y: 50 + Math.sin(i * 0.5) * 20
    }));
  }, []);

  // Memoize breach particle positions and durations so they don't recalculate on every render
  const breachParticles = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      x: ((i * 7 + 13) % 400),
      y: ((i * 11 + 7) % 100),
      duration: 0.2 + (i % 8) * 0.1,
    }));
  }, []);

  return (
    <GlassCard
      title="ML-KEM Integrity Monitor"
      subtitle="Cryptographic Integrity Analysis"
      icon={isBreach ? <AlertTriangle className="w-4 h-4 text-breach-red" /> : <Shield className="w-4 h-4 text-shield-green" />}
      variant={isBreach ? 'breach' : 'default'}
      className="h-full"
    >
      <div className="flex flex-col gap-8">
        <div className="relative h-40 w-full bg-black/5 rounded-2xl overflow-hidden border border-border-luxury/50 glossy-surface">
          {/* Scanning Line */}
          <motion.div 
            className="absolute left-0 right-0 h-px bg-quantum-cyan/30 z-10"
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          
          <svg viewBox="0 0 400 100" className="w-full h-full preserve-3d">
            {!isBreach ? (
              <motion.path
                d={`M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`}
                fill="none"
                stroke="#C5A059"
                strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1,
                  opacity: 1,
                  d: [
                    `M ${points.map(p => `${p.x},${p.y + Math.sin(0 + p.x * 0.1) * 5}`).join(' L ')}`,
                    `M ${points.map(p => `${p.x},${p.y + Math.sin(Math.PI + p.x * 0.1) * 5}`).join(' L ')}`,
                    `M ${points.map(p => `${p.x},${p.y + Math.sin(Math.PI * 2 + p.x * 0.1) * 5}`).join(' L ')}`
                  ]
                }}
                transition={{ 
                  pathLength: { duration: 2, ease: "easeInOut" },
                  opacity: { duration: 0.5 },
                  d: { duration: 4, repeat: Infinity, ease: "linear" }
                }}
              />
            ) : (
              <g>
                {breachParticles.map((particle, i) => (
                  <motion.rect
                    key={i}
                    x={particle.x}
                    y={particle.y}
                    width={1.5}
                    height={1.5}
                    fill="#D67D7D"
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [1, 2, 1],
                    }}
                    transition={{
                      duration: particle.duration,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </g>
            )}
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            {isBreach && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-breach-red text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg"
              >
                Cryptographic Anomaly Detected
              </motion.div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold">Integrity Variance</span>
            <span className={isBreach ? "text-2xl font-mono text-breach-red font-bold" : "text-2xl font-mono text-shield-green font-bold"}>
              {(qber * 100).toFixed(2)}%
            </span>
          </div>
          <div className="flex flex-col gap-2 text-right">
            <span className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold">Status</span>
            <span className={isBreach ? "text-[10px] font-bold text-breach-red uppercase tracking-[0.2em]" : "text-[10px] font-bold text-shield-green uppercase tracking-[0.2em]"}>
              {isBreach ? "Security Breach" : "Nominal"}
            </span>
          </div>
        </div>

        {isBreach && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-breach-red/5 border border-breach-red/20 rounded-2xl text-[10px] font-mono text-breach-red leading-relaxed font-medium"
          >
            [SECURITY_ALERT]: {
              attackVector === 'INTERCEPT_RESEND' ? 'Lattice reduction attempt identified. Computational anomaly detected.' :
              attackVector === 'PNS' ? 'Side-channel leakage detected. Power analysis signature identified.' :
              attackVector === 'TROJAN_HORSE' ? 'Fault injection attempt detected. Internal state integrity compromised.' :
              attackVector === 'PHASE_REMAPPING' ? 'Quantum-scale brute force detected. ML-KEM parameters under stress.' :
              'Unknown cryptographic attack vector detected.'
            }
            Aborting encapsulation round. Regenerating lattice parameters.
            Switching to verified fallback seed...
          </motion.div>
        )}
      </div>
    </GlassCard>
  );
});
