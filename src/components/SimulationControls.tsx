import { GlassCard } from './GlassCard';
import { Settings2, Zap, ShieldAlert, Sliders } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface SimulationControlsProps {
  noiseLevel: number;
  attackVector: string;
  isEavesdropperActive: boolean;
  onUpdateParams: (params: { noiseLevel?: number; attackVector?: string }) => void;
  onSimulateAttack: () => void;
}

export function SimulationControls({
  noiseLevel,
  attackVector,
  isEavesdropperActive,
  onUpdateParams,
  onSimulateAttack
}: SimulationControlsProps) {
  return (
    <GlassCard
      title="Simulation Parameters"
      subtitle="Configure ML-KEM Security Parameters"
      icon={<Settings2 className="w-4 h-4 text-quantum-cyan" />}
    >
      <div className="flex flex-col gap-6">
        {/* Noise Level Slider */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase tracking-[0.2em] text-text-secondary flex items-center gap-3 font-bold">
              <Zap className="w-3.5 h-3.5 text-quantum-cyan" />
              Lattice Noise (σ)
            </label>
            <span className="text-[10px] font-mono text-quantum-cyan font-bold">{(noiseLevel * 100).toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="0.2"
            step="0.01"
            value={noiseLevel}
            onChange={(e) => onUpdateParams({ noiseLevel: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-black/5 rounded-full appearance-none cursor-pointer accent-quantum-cyan"
          />
          <div className="flex justify-between text-[8px] text-text-secondary uppercase tracking-[0.1em] font-medium">
            <span>Ideal</span>
            <span>Standard</span>
            <span>High Noise</span>
          </div>
        </div>

        {/* Attack Vector Selection */}
        <div className="flex flex-col gap-4">
          <label className="text-[10px] uppercase tracking-[0.2em] text-text-secondary flex items-center gap-3 font-bold">
            <ShieldAlert className="w-3.5 h-3.5 text-quantum-cyan" />
            Active Attack Vector
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'LATTICE_REDUCTION', label: 'Lattice Reduction', desc: 'BKZ/LLL algorithm attempt' },
              { id: 'SIDE_CHANNEL', label: 'Side-Channel', desc: 'Power/Timing leakage analysis' },
              { id: 'FAULT_INJECTION', label: 'Fault Injection', desc: 'Bit-flip/Glitch injection' },
              { id: 'QUANTUM_BRUTE_FORCE', label: 'Quantum Brute Force', desc: "Grover's algorithm search" }
            ].map((attack) => (
              <button
                key={attack.id}
                onClick={() => onUpdateParams({ attackVector: attack.id })}
                className={cn(
                  "p-4 rounded-2xl border text-left transition-all duration-500 glossy-surface",
                  attackVector === attack.id
                    ? "bg-quantum-cyan/10 border-quantum-cyan/40 text-quantum-cyan shadow-sm"
                    : "bg-white/5 border-border-luxury text-text-secondary hover:bg-black/5"
                )}
              >
                <div className="text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5">{attack.label}</div>
                <div className="text-[9px] opacity-70 leading-relaxed font-light">{attack.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Trigger Attack */}
        <button
          onClick={onSimulateAttack}
          disabled={isEavesdropperActive}
          className={cn(
            "w-full py-4.5 rounded-full border font-bold uppercase tracking-[0.25em] text-[10px] transition-all duration-700 relative overflow-hidden group shadow-md",
            isEavesdropperActive
              ? "bg-breach-red/10 border-breach-red/30 text-breach-red"
              : "bg-text-primary text-quantum-vacuum border-transparent hover:bg-quantum-cyan hover:scale-[1.02]"
          )}
        >
          {isEavesdropperActive ? (
            <span className="flex items-center justify-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 bg-breach-red rounded-full shadow-[0_0_8px_rgba(214,125,125,0.5)]"
              />
              Attack Detected
            </span>
          ) : (
            "Simulate Cryptographic Attack"
          )}
          
          {/* Scanning effect on button */}
          {!isEavesdropperActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          )}
        </button>

        <div className="bg-black/5 p-4 rounded-2xl border border-border-luxury/50">
          <div className="flex items-center gap-3 mb-3">
            <Sliders className="w-3.5 h-3.5 text-text-secondary" />
            <span className="text-[9px] uppercase tracking-[0.2em] text-text-secondary font-bold">Simulation Context</span>
          </div>
          <p className="text-[10px] text-text-secondary leading-relaxed font-light italic">
            Adjusting noise affects the ML-KEM error correction threshold. High noise triggers automatic lattice parameter regeneration to maintain unassailable security.
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
