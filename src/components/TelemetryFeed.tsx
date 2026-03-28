import { Key, RefreshCw, Lock } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { motion, AnimatePresence, useSpring, useTransform } from 'motion/react';
import { useEffect, useState, useMemo } from 'react';
import { cn } from '../lib/utils';

interface TelemetryFeedProps {
  keyIndex: number;
  lastKey: string;
  siftedKeyRate: number;
  isEncrypted: boolean;
}

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 100, damping: 30 });
  const display = useTransform(spring, (current) => Math.floor(current).toLocaleString());

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
}

export function TelemetryFeed({ keyIndex, lastKey, siftedKeyRate, isEncrypted }: TelemetryFeedProps) {
  return (
    <GlassCard
      title="ML-KEM Key Exchange"
      subtitle="Module-Lattice-Based Key Encapsulation"
      icon={<RefreshCw className="w-4 h-4 text-quantum-cyan" />}
      className="h-full"
    >
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", isEncrypted ? "bg-shield-green animate-pulse" : "bg-breach-red")} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary">
              {isEncrypted ? "ML-KEM Protection Active" : "Security Bypass Active"}
            </span>
          </div>
          <div className="px-2 py-0.5 rounded bg-quantum-cyan/10 border border-quantum-cyan/20 text-[8px] font-bold uppercase tracking-widest text-quantum-cyan">
            FIPS 203
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold">Encapsulation Count</span>
            </div>
            <div className="text-5xl font-mono font-bold text-text-primary tabular-nums tracking-tighter">
              <AnimatedNumber value={keyIndex} />
            </div>
          </div>
          <div className="flex flex-col gap-3 text-right">
            <span className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold">Encapsulation Rate</span>
            <div className="text-3xl font-mono font-bold text-shield-green tabular-nums">
              <AnimatedNumber value={siftedKeyRate} /> <span className="text-[11px] text-text-secondary font-medium">ops</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <label className="text-[10px] text-text-secondary uppercase tracking-[0.2em] flex items-center gap-3 font-bold">
            <Key className="w-3.5 h-3.5 text-quantum-cyan" />
            Active ML-KEM Shared Secret
          </label>
          <div className="bg-black/5 p-5 rounded-2xl border border-border-luxury/50 font-mono text-[11px] break-all leading-relaxed text-text-primary/70 relative overflow-hidden group glossy-surface">
            <div className="absolute inset-0 bg-gradient-to-r from-quantum-cyan/0 via-quantum-cyan/10 to-quantum-cyan/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            {lastKey}
          </div>
        </div>

        <div className="bg-black/5 p-4 rounded-2xl border border-border-luxury/50 flex flex-col gap-3">
          <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.2em] text-text-secondary">
            <span>Lattice Entropy</span>
            <span className="text-shield-green">Verified</span>
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: 32 }).map((_, i) => (
              <div 
                key={i}
                className="flex-1 h-1.5 rounded-full"
                style={{
                  backgroundColor: i % 3 === 0 ? "rgba(197, 160, 89, 0.4)" : "rgba(197, 160, 89, 0.1)",
                  animation: `entropy-flicker ${0.8 + (i % 5) * 0.3}s ease-in-out ${(i % 7) * 0.1}s infinite alternate`
                }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-1.5 bg-black/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-quantum-cyan/30"
                style={{
                  animation: `progress-fill ${0.6 + (i % 4) * 0.25}s ease-in-out ${(i % 6) * 0.15}s infinite alternate`,
                }}
              />
            </div>
          ))}
        </div>

        <p className="text-[10px] text-text-secondary leading-relaxed italic font-light">
          Lattice-based entropy source: ML-KEM-768 Primitive. 
          Shared secrets are encapsulated and decapsulated to ensure post-quantum forward secrecy.
        </p>
      </div>
    </GlassCard>
  );
}
