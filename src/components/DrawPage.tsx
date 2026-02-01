import { useEffect } from 'react';
import { ArenaLayout } from './ArenaLayout';
import { CardSelectionAnimation } from './CardSelectionAnimation';
import { useCardDraw } from '@/hooks/useCardDraw';
import { useSound } from '@/hooks/useSound';
import { Lock, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DrawPageProps {
  type: 'wildcard' | 'penalty';
}

export function DrawPage({ type }: DrawPageProps) {
  const {
    teamName,
    setTeamName,
    isVerifying,
    isVerified,
    isSpinning,
    isRecorded,
    hasParticipated,
    error,
    verifyTeam,
    spinCard,
  } = useCardDraw(type);

  const { isMuted, toggleMute, playShuffleSound, playVictorySound, playClickSound } = useSound();

  const isWildcard = type === 'wildcard';
  const variant = isWildcard ? 'cyan' : 'magenta';
  const cardCount = isWildcard ? 3 : 2;

  // Play sounds on state changes
  useEffect(() => {
    if (isSpinning) {
      const interval = setInterval(playShuffleSound, 400);
      return () => clearInterval(interval);
    }
  }, [isSpinning, playShuffleSound]);

  useEffect(() => {
    if (isRecorded) {
      playVictorySound();
    }
  }, [isRecorded, playVictorySound]);

  const handleVerify = () => {
    playClickSound();
    verifyTeam();
  };

  const handleSpin = () => {
    playClickSound();
    spinCard();
  };

  return (
    <ArenaLayout isMuted={isMuted} onToggleMute={toggleMute}>
      <header className="text-center mb-8 animate-slide-up">
        <h1 className={cn(
          "text-4xl md:text-5xl font-display font-black tracking-wider mb-2",
          isWildcard ? 'neon-text-cyan' : 'neon-text-magenta'
        )}>
          {isWildcard ? 'WILDCARD' : 'PENALTY'}
        </h1>
        <p className="text-muted-foreground font-mono text-sm tracking-widest uppercase">
          Code Arena • Card Draw
        </p>
      </header>

      {hasParticipated && !isRecorded ? (
        <div className="text-center mb-8 animate-scale-in">
          <Lock className={cn(
            "w-16 h-16 mx-auto mb-4",
            isWildcard ? 'text-primary' : 'text-secondary'
          )} />
          <p className="font-display text-lg text-foreground">ALREADY PARTICIPATED</p>
          <p className="text-muted-foreground text-sm mt-2">This device has already drawn a card</p>
        </div>
      ) : isRecorded ? (
        <div className="text-center mb-8 animate-scale-in">
          <CheckCircle2 className={cn(
            "w-16 h-16 mx-auto mb-4 animate-scale-in",
            isWildcard ? 'text-primary' : 'text-secondary'
          )} />
          <p className="font-display text-lg text-foreground flicker">FATE SEALED</p>
          <p className="text-muted-foreground text-sm mt-2" role="status">
            Your destiny has been recorded
          </p>
        </div>
      ) : (
        <div className="text-center mb-8 animate-scale-in">
          <CardSelectionAnimation variant={variant} isSpinning={isSpinning} cardCount={cardCount} />
          <p className={cn(
            "font-display text-xl text-foreground mt-6",
            isSpinning && "flicker"
          )}>
            {isSpinning ? 'SELECTING CARD...' : (isWildcard ? 'DRAW YOUR POWER' : 'ACCEPT YOUR FATE')}
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            {isSpinning ? 'Your fate is being decided' : (isWildcard ? '3 possible wildcards await' : '2 penalty outcomes')}
          </p>
        </div>
      )}

      {/* Input section */}
      {!hasParticipated && !isRecorded && (
        <div className="w-full max-w-md space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="relative">
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="ENTER TEAM NAME"
              disabled={isVerified || isSpinning}
              className={cn(
                "neon-input text-center uppercase tracking-widest font-display",
                isVerified && "opacity-60 cursor-not-allowed"
              )}
              required
              aria-label="Team name"
            />
            {isVerified && (
              <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
            )}
          </div>

          {error && (
            <p className="text-destructive text-center text-sm font-mono" role="alert">
              {error}
            </p>
          )}

          {!isVerified ? (
            <button
              onClick={handleVerify}
              disabled={!teamName.trim() || isVerifying}
              className={cn(
                "w-full",
                isWildcard ? 'neon-button-cyan' : 'neon-button-magenta'
              )}
            >
              {isVerifying ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  VERIFYING...
                </span>
              ) : (
                'VERIFY TEAM'
              )}
            </button>
          ) : (
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className={cn(
                "w-full text-xl",
                isWildcard ? 'neon-button-cyan' : 'neon-button-magenta'
              )}
            >
              {isSpinning ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  DRAWING...
                </span>
              ) : (
                '⚡ SPIN TO DRAW ⚡'
              )}
            </button>
          )}
        </div>
      )}
    </ArenaLayout>
  );
}
