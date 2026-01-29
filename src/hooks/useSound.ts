import { useState, useCallback, useRef, useEffect } from 'react';

export function useSound() {
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize AudioContext on first user interaction
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };

    window.addEventListener('click', initAudio, { once: true });
    return () => window.removeEventListener('click', initAudio);
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (isMuted || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }, [isMuted]);

  const playShuffleSound = useCallback(() => {
    if (isMuted) return;
    
    // Play rapid beeping sequence
    const frequencies = [400, 600, 500, 700, 450, 650];
    frequencies.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.1, 'square'), i * 100);
    });
  }, [isMuted, playTone]);

  const playVictorySound = useCallback(() => {
    if (isMuted) return;

    // Play ascending victory melody
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.3, 'sine'), i * 150);
    });
  }, [isMuted, playTone]);

  const playClickSound = useCallback(() => {
    playTone(800, 0.05, 'square');
  }, [playTone]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  return {
    isMuted,
    toggleMute,
    playShuffleSound,
    playVictorySound,
    playClickSound
  };
}
