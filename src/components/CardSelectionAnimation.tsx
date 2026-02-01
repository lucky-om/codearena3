import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, Zap } from 'lucide-react';

interface CardSelectionAnimationProps {
  variant: 'cyan' | 'magenta';
  isSpinning: boolean;
  cardCount?: number;
  onComplete?: () => void;
}

export function CardSelectionAnimation({ variant, isSpinning, cardCount = 3, onComplete }: CardSelectionAnimationProps) {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(() => {
    if (isSpinning) {
      setSelectedCard(null);
      setIsShuffling(true);
      
      // After shuffling, select a random card
      const shuffleTimer = setTimeout(() => {
        setIsShuffling(false);
        const randomCard = Math.floor(Math.random() * cardCount);
        setSelectedCard(randomCard);
        onComplete?.();
      }, 2000);

      return () => clearTimeout(shuffleTimer);
    }
  }, [isSpinning, cardCount, onComplete]);

  const cards = Array.from({ length: cardCount }, (_, i) => i);

  return (
    <div className="flex gap-4 justify-center items-center py-4">
      {cards.map((cardIndex) => {
        const isSelected = selectedCard === cardIndex;
        const isNotSelected = selectedCard !== null && !isSelected;
        
        return (
          <div
            key={cardIndex}
            className={cn(
              "relative w-20 h-28 md:w-24 md:h-32 rounded-xl transition-all duration-500",
              "border-2 flex items-center justify-center",
              variant === 'cyan' 
                ? 'border-primary bg-primary/10' 
                : 'border-secondary bg-secondary/10',
              isShuffling && 'animate-card-shuffle',
              isSelected && 'scale-125 z-10',
              isNotSelected && 'opacity-30 scale-90',
              isSelected && variant === 'cyan' && 'shadow-[0_0_30px_hsl(var(--neon-cyan)/0.8)]',
              isSelected && variant === 'magenta' && 'shadow-[0_0_30px_hsl(var(--neon-magenta)/0.8)]'
            )}
            style={{
              animationDelay: isShuffling ? `${cardIndex * 0.1}s` : '0s',
            }}
          >
            {/* Card back pattern */}
            <div className={cn(
              "absolute inset-2 rounded-lg opacity-20",
              variant === 'cyan' ? 'bg-primary' : 'bg-secondary'
            )}>
              <div className="w-full h-full grid grid-cols-3 grid-rows-4 gap-0.5 p-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "rounded-sm",
                      variant === 'cyan' ? 'bg-primary/50' : 'bg-secondary/50'
                    )} 
                  />
                ))}
              </div>
            </div>

            {/* Card icon */}
            <div className={cn(
              "relative z-10",
              variant === 'cyan' ? 'text-primary' : 'text-secondary'
            )}>
              {variant === 'cyan' ? (
                <Sparkles className={cn(
                  "w-8 h-8",
                  isShuffling && 'animate-pulse'
                )} />
              ) : (
                <Zap className={cn(
                  "w-8 h-8",
                  isShuffling && 'animate-pulse'
                )} />
              )}
            </div>

            {/* Selection glow */}
            {isSelected && (
              <div className={cn(
                "absolute inset-0 rounded-xl animate-pulse",
                variant === 'cyan' 
                  ? 'bg-primary/20' 
                  : 'bg-secondary/20'
              )} />
            )}

            {/* Card number */}
            <div className={cn(
              "absolute bottom-2 text-xs font-display",
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
