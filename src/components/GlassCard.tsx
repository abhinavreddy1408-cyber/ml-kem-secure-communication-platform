import { ReactNode } from 'react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  variant?: 'default' | 'breach';
}

export function GlassCard({ children, className, title, subtitle, icon, variant = 'default' }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className={cn(
        "glass-panel p-8 flex flex-col gap-6 transition-all duration-500 relative overflow-hidden group",
        variant === 'breach' ? "border-breach-red/30 bg-breach-red/5" : "border-border-luxury bg-white/40",
        className
      )}
    >
      {/* Subtle Glossy Highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Hover Glow Effect */}
      <div className="absolute -inset-px bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {(title || icon) && (
        <div className="flex items-center justify-between border-b border-border-luxury/50 pb-6 relative z-10">
          <div className="flex flex-col">
            <h3 className="text-lg font-serif tracking-tight text-text-primary flex items-center gap-3 group-hover:text-quantum-cyan transition-colors duration-500">
              <motion.span 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="text-quantum-cyan"
              >
                {icon}
              </motion.span>
              {title}
            </h3>
            {subtitle && <p className="text-[11px] uppercase tracking-[0.2em] text-text-secondary mt-2 font-medium opacity-70 group-hover:opacity-100 transition-opacity duration-500">{subtitle}</p>}
          </div>
        </div>
      )}
      <div className="flex-1 relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
