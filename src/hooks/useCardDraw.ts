import { useState, useEffect, useCallback } from 'react';

type DrawType = 'wildcard' | 'penalty';

interface UseCardDrawReturn {
  teamName: string;
  setTeamName: (name: string) => void;
  isVerifying: boolean;
  isVerified: boolean;
  isSpinning: boolean;
  isRecorded: boolean;
  hasParticipated: boolean;
  error: string | null;
  verifyTeam: () => Promise<void>;
  spinCard: () => Promise<void>;
  resetState: () => void;
}

// Wildcard mappings: 1-3
const WILDCARD_RESULTS: Record<number, string> = {
  1: "Skip",
  2: "Freeze", 
  3: "Guess the points"
};

// Penalty mappings: 1-2
const PENALTY_RESULTS: Record<number, string> = {
  1: "any 2 members out for 10 min",
  2: "5 min whole team out"
};

const STORAGE_KEY_PREFIX = 'codeArena_participated_';

export function useCardDraw(drawType: DrawType): UseCardDrawReturn {
  const [teamName, setTeamName] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isRecorded, setIsRecorded] = useState(false);
  const [hasParticipated, setHasParticipated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storageKey = `${STORAGE_KEY_PREFIX}${drawType}`;

  // Check localStorage on mount
  useEffect(() => {
    const participated = localStorage.getItem(storageKey);
    if (participated === 'true') {
      setHasParticipated(true);
    }
  }, [storageKey]);

  const verifyTeam = useCallback(async () => {
    if (!teamName.trim()) {
      setError('Please enter a team name');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      // Simulate API check - in production, replace with actual Google Sheets Web App URL
      // const response = await fetch(`YOUR_GOOGLE_SHEETS_WEB_APP_URL?action=check&team=${encodeURIComponent(teamName)}&type=${drawType}`);
      // const data = await response.json();
      
      // Simulated delay for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulated response - in production, check if team exists
      const teamExists = false; // Replace with actual check: data.exists
      
      if (teamExists) {
        setError('This team has already participated!');
        setHasParticipated(true);
        localStorage.setItem(storageKey, 'true');
      } else {
        setIsVerified(true);
      }
    } catch (err) {
      // For demo purposes, allow verification even if API fails
      console.log('API not configured, proceeding with demo mode');
      setIsVerified(true);
    } finally {
      setIsVerifying(false);
    }
  }, [teamName, drawType, storageKey]);

  const spinCard = useCallback(async () => {
    if (!isVerified) return;

    setIsSpinning(true);
    setError(null);

    // Generate random result
    const maxResult = drawType === 'wildcard' ? 3 : 2;
    const randomResult = Math.floor(Math.random() * maxResult) + 1;
    
    // Map result to string
    const resultMapping = drawType === 'wildcard' ? WILDCARD_RESULTS : PENALTY_RESULTS;
    const mappedResult = resultMapping[randomResult];

    // Simulate spinning animation duration
    await new Promise(resolve => setTimeout(resolve, 2500));

    try {
      // Silent recording - in production, replace with actual Google Sheets Web App URL
      // await fetch('YOUR_GOOGLE_SHEETS_WEB_APP_URL', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     action: 'record',
      //     team: teamName,
      //     result: mappedResult,
      //     type: drawType
      //   })
      // });
      
      console.log('Recording (demo):', { team: teamName, result: mappedResult, type: drawType });
      
      // Mark as participated
      localStorage.setItem(storageKey, 'true');
      setHasParticipated(true);
      setIsRecorded(true);
    } catch (err) {
      // Even if recording fails, show success to user
      console.log('Recording failed, but proceeding');
      setIsRecorded(true);
    } finally {
      setIsSpinning(false);
    }
  }, [isVerified, teamName, drawType, storageKey]);

  const resetState = useCallback(() => {
    setTeamName('');
    setIsVerified(false);
    setIsRecorded(false);
    setError(null);
  }, []);

  return {
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
    resetState
  };
}
