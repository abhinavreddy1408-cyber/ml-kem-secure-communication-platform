import React, { memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QuantumState } from '../hooks/useTelemetry';
import { GlassCard } from './GlassCard';
import { Binary, ArrowRightLeft, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface QuantumStateGridProps {
  states: QuantumState[];
}

const QuantumStateCell = React.memo(({ state, index }: { state: QuantumState, index: number }) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "aspect-[4/5] rounded-2xl border flex flex-col items-center justify-between p-3 transition-all duration-700 relative group overflow-hidden glossy-surface",
        state.isError 
          ? "bg-breach-red/10 border-breach-red/40 shadow-[0_8px_24px_rgba(214,125,125,0.15)]" 
          : state.basisMatch 
            ? "bg-shield-green/5 border-shield-green/30 shadow-[0_4px_12px_rgba(136,160,112,0.05)]" 
            : "bg-black/5 border-border-luxury/50 opacity-40 grayscale hover:grayscale-0 hover:opacity-100"
      )}
    >
      {/* Header: Bit Value */}
      <div className="w-full flex justify-between items-center mb-1">
        <span className={cn(
          "text-[10px] font-mono font-bold",
          state.isError ? "text-breach-red" : "text-text-primary"
        )}>
          {state.aliceBit}
        </span>
        {state.basisMatch ? (
          <CheckCircle2 className={cn("w-3 h-3", state.isError ? "text-breach-red" : "text-shield-green")} />
        ) : (
          <XCircle className="w-3 h-3 text-text-secondary opacity-30" />
        )}
      </div>

      {/* Center: Basis Visualization */}
      <div className="flex flex-col items-center gap-2 my-2">
        <div className="flex flex-col items-center">
          <span className="text-[7px] uppercase tracking-widest text-text-secondary mb-1 opacity-60">Client</span>
          <div className={cn(
            "w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-bold border",
            state.aliceBasis === '+' ? "bg-quantum-cyan/10 border-quantum-cyan/30 text-quantum-cyan" : "bg-entanglement-purple/10 border-entanglement-purple/30 text-entanglement-purple"
          )}>
            {state.aliceBasis}
          </div>
        </div>
        
        <ArrowRightLeft className="w-2.5 h-2.5 text-text-secondary opacity-20" />

        <div className="flex flex-col items-center">
          <div className={cn(
            "w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-bold border",
            state.bobBasis === '+' ? "bg-quantum-cyan/10 border-quantum-cyan/30 text-quantum-cyan" : "bg-entanglement-purple/10 border-entanglement-purple/30 text-entanglement-purple",
            !state.basisMatch && "opacity-40"
          )}>
            {state.bobBasis}
          </div>
          <span className="text-[7px] uppercase tracking-widest text-text-secondary mt-1 opacity-60">Server</span>
        </div>
      </div>

      {/* Footer: Status Label */}
      <div className={cn(
        "text-[7px] font-bold uppercase tracking-[0.1em] text-center w-full pt-2 border-t border-border-luxury/20",
        state.isError ? "text-breach-red" : state.basisMatch ? "text-shield-green" : "text-text-secondary"
      )}>
        {state.isError ? "Error" : state.basisMatch ? "Encapsulated" : "Rejected"}
      </div>

      {/* Eavesdropping Indicator Overlay */}
      {state.wasIntercepted && (
        <div className="absolute inset-0 bg-breach-red/5 pointer-events-none">
          <div className="absolute top-0 right-0 w-4 h-4 bg-breach-red/20 rounded-bl-2xl flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-breach-red rounded-full animate-pulse" />
          </div>
        </div>
      )}

      {/* Detailed Hover State */}
      <div className="absolute inset-0 bg-white/98 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-3 z-20">
        <div className="text-[8px] font-bold uppercase tracking-[0.2em] mb-3 text-text-primary border-b border-border-luxury pb-2 w-full text-center">
          Vector Analysis
        </div>
        
        <div className="space-y-2 w-full">
          <div className="flex justify-between items-center text-[7px] uppercase tracking-wider">
            <span className="text-text-secondary">Intercepted</span>
            <span className={state.wasIntercepted ? "text-breach-red font-bold" : "text-shield-green font-bold"}>
              {state.wasIntercepted ? "YES" : "NO"}
            </span>
          </div>
          
          {state.wasIntercepted && state.eveBasis && (
            <div className="flex justify-between items-center text-[7px] uppercase tracking-wider">
              <span className="text-text-secondary">Eve Vector</span>
              <span className="text-breach-red font-bold font-mono">{state.eveBasis}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-[7px] uppercase tracking-wider">
            <span className="text-text-secondary">Vector Match</span>
            <span className={state.basisMatch ? "text-shield-green font-bold" : "text-text-secondary font-bold"}>
              {state.basisMatch ? "MATCH" : "MISMATCH"}
            </span>
          </div>

          <div className="flex justify-between items-center text-[7px] uppercase tracking-wider">
            <span className="text-text-secondary">Secret Integrity</span>
            <span className={state.isError ? "text-breach-red font-bold" : "text-shield-green font-bold"}>
              {state.isError ? "COMPROMISED" : "SECURE"}
            </span>
          </div>
        </div>

        {state.basisMatch && !state.isError && (
          <div className="mt-3 text-[7px] font-bold text-quantum-cyan animate-pulse uppercase tracking-widest">
            Shared Secret Generated
          </div>
        )}
      </div>
    </motion.div>
  );
});

export function QuantumStateGrid({ states }: QuantumStateGridProps) {
  return (
    <GlassCard
      title="ML-KEM Lattice Vectors"
      subtitle="Real-time Lattice Vector Encapsulation"
      icon={<Binary className="w-4 h-4 text-quantum-cyan" />}
      className="h-full"
    >
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
          {states.map((state, i) => (
            <QuantumStateCell key={i} state={state} index={i} />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-border-luxury/50 pt-8">
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-text-secondary font-bold">Lattice Parameter Legend</span>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-quantum-cyan/5 border border-quantum-cyan/10">
                <div className="w-8 h-8 rounded-lg bg-quantum-cyan/10 flex items-center justify-center font-mono text-sm font-bold text-quantum-cyan border border-quantum-cyan/20">+</div>
                <div>
                  <div className="text-[9px] font-bold text-text-primary uppercase tracking-wider">Polynomial</div>
                  <div className="text-[8px] text-text-secondary font-light">Ring-LWE / Module-LWE</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-entanglement-purple/5 border border-entanglement-purple/10">
                <div className="w-8 h-8 rounded-lg bg-entanglement-purple/10 flex items-center justify-center font-mono text-sm font-bold text-entanglement-purple border border-entanglement-purple/20">x</div>
                <div>
                  <div className="text-[9px] font-bold text-text-primary uppercase tracking-wider">Error Vector</div>
                  <div className="text-[8px] text-text-secondary font-light">Gaussian Noise</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-text-secondary font-bold">ML-KEM Protocol</span>
            <div className="p-4 rounded-2xl bg-black/5 border border-border-luxury/50">
              <p className="text-[11px] text-text-secondary leading-relaxed font-light italic">
                Lattice vectors are encapsulated using Module-LWE primitives. Eavesdropping attempts introduce computational noise that exceeds the ML-KEM error correction threshold, triggering an immediate security alert.
              </p>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
