import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface NeonCardProps {
  variant: 'cyan' | 'magenta';
  isSpinning?: boolean;
  children: ReactNode;
  className?: string;
}

export function NeonCard({ variant, isSpinning, children, className }: NeonCardProps) {
  return (
    <div
      className={cn(
        "relative w-72 h-96 perspective-1000",
        className
      )}
    >
      <div
        className={cn(
          "w-full h-full glass-card rounded-2xl flex flex-col items-center justify-center p-6 transition-all duration-300",
          variant === 'cyan' ? 'pulse-glow-cyan border-primary/50' : 'pulse-glow-magenta border-secondary/50',
          isSpinning && 'spin-card'
        )}
        style={{
          transformStyle: 'preserve-3d',
          borderWidth: '2px',
        }}
      >
        {/* Corner decorations */}
        <div className={cn(
          "absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2",
          variant === 'cyan' ? 'border-primary' : 'border-secondary'
        )} />
        <div className={cn(
          "absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2",
          variant === 'cyan' ? 'border-primary' : 'border-secondary'
        )} />
        <div className={cn(
          "absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2",
          variant === 'cyan' ? 'border-primary' : 'border-secondary'
        )} />
        <div className={cn(
          "absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2",
          variant === 'cyan' ? 'border-primary' : 'border-secondary'
        )} />

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
