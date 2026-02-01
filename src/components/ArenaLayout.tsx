import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Volume2, VolumeX, Home } from 'lucide-react';

interface ArenaLayoutProps {
  children: ReactNode;
  isMuted: boolean;
  onToggleMute: () => void;
}

export function ArenaLayout({ children, isMuted, onToggleMute }: ArenaLayoutProps) {
  return (
    <div className="min-h-screen arena-bg cyber-grid scanlines relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-neon-green/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-neon-magenta/20 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Top controls */}
      <div className="fixed top-4 right-4 z-50 flex gap-3">
        <Link
          to="/"
          className="p-3 glass-card hover:border-primary transition-all duration-300 group"
          aria-label="Return to home"
        >
          <Home className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
        <button
          onClick={onToggleMute}
          className="p-3 glass-card hover:border-primary transition-all duration-300 group"
          aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          ) : (
            <Volume2 className="w-5 h-5 text-primary transition-colors" />
          )}
        </button>
      </div>

      {/* Main content */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {children}
      </main>
    </div>
  );
}
