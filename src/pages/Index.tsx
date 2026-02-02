import { Link } from 'react-router-dom';
import { ArenaLayout } from '@/components/ArenaLayout';
import { useSound } from '@/hooks/useSound';
import { Sparkles, Zap } from 'lucide-react';

const Index = () => {
  const { isMuted, toggleMute, playClickSound } = useSound();

  return (
    <ArenaLayout isMuted={isMuted} onToggleMute={toggleMute}>
      {/* Logo / Title */}
      <div className="text-center mb-12 animate-slide-up">
        <div className="relative inline-block mb-4">
          <h1 className="text-5xl md:text-7xl font-display font-black tracking-wider">
            <span className="neon-text-cyan">CODE</span>
            <span className="neon-text-magenta ml-3">ARENA</span>
          </h1>
          {/* Decorative line */}
          <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>
        <p className="text-xl md:text-2xl font-display text-muted-foreground tracking-[0.3em] uppercase mt-6">
          Card Generator
        </p>
      </div>

      {/* Card selection */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 animate-scale-in" style={{ animationDelay: '0.2s' }}>
        {/* Wildcard Button */}
        <Link
          to="/wildcard"
          onClick={playClickSound}
          className="group relative"
        >
          <div className="glass-card pulse-glow-cyan border-2 border-primary/50 rounded-2xl p-8 md:p-12 transition-all duration-300 group-hover:scale-105 group-hover:border-primary">
            <div className="text-center">
              <Sparkles className="w-16 h-16 md:w-20 md:h-20 mx-auto text-primary mb-6 float group-hover:scale-110 transition-transform" />
              <h2 className="font-display text-2xl md:text-3xl font-bold neon-text-cyan mb-2">
                WILDCARD
              </h2>
              <p className="text-muted-foreground text-sm tracking-wider">
                DRAW YOUR POWER
              </p>
            </div>
            {/* Hover effect overlay */}
            <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        </Link>

        {/* Penalty Button */}
        <Link
          to="/penalty"
          onClick={playClickSound}
          className="group relative"
        >
          <div className="glass-card pulse-glow-magenta border-2 border-secondary/50 rounded-2xl p-8 md:p-12 transition-all duration-300 group-hover:scale-105 group-hover:border-secondary">
            <div className="text-center">
              <Zap className="w-16 h-16 md:w-20 md:h-20 mx-auto text-secondary mb-6 float group-hover:scale-110 transition-transform" />
              <h2 className="font-display text-2xl md:text-3xl font-bold neon-text-magenta mb-2">
                PENALTY
              </h2>
              <p className="text-muted-foreground text-sm tracking-wider">
                ACCEPT YOUR FATE
              </p>
            </div>
            {/* Hover effect overlay */}
            <div className="absolute inset-0 rounded-2xl bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        </Link>
      </div>

      {/* Footer info */}
      <div className="mt-16 text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <p className="text-muted-foreground text-xs tracking-widest uppercase font-mono">
          Choose your destiny wisely
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-muted-foreground text-xs">SYSTEM ACTIVE</span>
          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
        </div>
      </div>
    </ArenaLayout>
  );
};

export default Index;
