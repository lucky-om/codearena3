import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, Zap } from 'lucide-react';

interface CardSelectionAnimationProps {
  variant: 'cyan' | 'magenta';
  isSpinning: boolean;
  cardCount?: number;
  selectedCardIndex: number | null;
  onComplete?: () => void;
}

export function CardSelectionAnimation({ variant, isSpinning, cardCount = 3, selectedCardIndex, onComplete }: CardSelectionAnimationProps) {
  const [displayedSelection, setDisplayedSelection] = useState<number | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(() => {
    if (isSpinning && selectedCardIndex !== null) {
      setDisplayedSelection(null);
      setIsShuffling(true);
      
      // After shuffling, show the pre-determined card
      const shuffleTimer = setTimeout(() => {
        setIsShuffling(false);
        setDisplayedSelection(selectedCardIndex);
        onComplete?.();
      }, 2000);

      return () => clearTimeout(shuffleTimer);
    } else if (!isSpinning) {
      setDisplayedSelection(null);
      setIsShuffling(false);
    }
  }, [isSpinning, selectedCardIndex, onComplete]);

  const cards = Array.from({ length: cardCount }, (_, i) => i);

  return (
    <div className="flex gap-4 md:gap-6 justify-center items-center py-4">
      {cards.map((cardIndex) => {
        const isSelected = displayedSelection === cardIndex;
        const isNotSelected = displayedSelection !== null && !isSelected;
        
        return (
          <div
            key={cardIndex}
            className={cn(
              "relative w-24 h-36 md:w-32 md:h-44 rounded-2xl transition-all duration-500",
              "border-2 flex flex-col items-center justify-center",
              "glass-card",
              variant === 'cyan' 
                ? 'border-primary' 
                : 'border-secondary',
              isShuffling && 'animate-card-shuffle',
              isSelected && 'scale-110 z-10',
              isNotSelected && 'opacity-30 scale-90',
              !isSpinning && !isSelected && variant === 'cyan' && 'pulse-glow-cyan',
              !isSpinning && !isSelected && variant === 'magenta' && 'pulse-glow-magenta',
              isSelected && variant === 'cyan' && 'shadow-[0_0_40px_hsl(var(--neon-cyan)/0.9)]',
              isSelected && variant === 'magenta' && 'shadow-[0_0_40px_hsl(var(--neon-magenta)/0.9)]'
            )}
            style={{
              animationDelay: isShuffling ? `${cardIndex * 0.1}s` : '0s',
            }}
          >
            {/* Corner decorations */}
            <div className={cn(
              "absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2",
              variant === 'cyan' ? 'border-primary' : 'border-secondary'
            )} />
            <div className={cn(
              "absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2",
              variant === 'cyan' ? 'border-primary' : 'border-secondary'
            )} />
            <div className={cn(
              "absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2",
              variant === 'cyan' ? 'border-primary' : 'border-secondary'
            )} />
            <div className={cn(
              "absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2",
              variant === 'cyan' ? 'border-primary' : 'border-secondary'
            )} />

            {/* Card icon */}
            <div className={cn(
              "relative z-10",
              variant === 'cyan' ? 'text-primary' : 'text-secondary'
            )}>
              {variant === 'cyan' ? (
                <Sparkles className={cn(
                  "w-10 h-10 md:w-12 md:h-12",
                  isShuffling && 'animate-pulse',
                  !isSpinning && 'float'
                )} />
              ) : (
                <Zap className={cn(
                  "w-10 h-10 md:w-12 md:h-12",
                  isShuffling && 'animate-pulse',
                  !isSpinning && 'float'
                )} />
              )}
            </div>

            {/* Selection glow */}
            {isSelected && (
              <div className={cn(
                "absolute inset-0 rounded-2xl animate-pulse",
                variant === 'cyan' 
                  ? 'bg-primary/20' 
                  : 'bg-secondary/20'
              )} />
            )}

            {/* Card number */}
            <div className={cn(
              "absolute bottom-4 text-sm font-display font-bold",
              variant === 'cyan' ? 'text-primary' : 'text-secondary'
            )}>
              {cardIndex + 1}
            </div>
          </div>
        );
      })}
    </div>
  );
}
