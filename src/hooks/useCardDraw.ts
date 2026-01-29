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

// Google Sheets Web App URLs
const SHEET_URLS = {
  wildcard: 'https://script.google.com/macros/s/AKfycbx28oHrmS7nBVQlvJAbc0uLg7Fldc0Nz4wYaKG48Q9W_6yiE2DyqeppUYPypNcIESgS/exec',
  penalty: 'https://script.google.com/macros/s/AKfycbzXGr4vz4I-3sdRrQCtQxxzNkHlW2JyEeCiSeycP5bk07bJS5g5etFGi6PyjELYH-mlXA/exec'
};

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
  const sheetUrl = SHEET_URLS[drawType];

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
      // Check if team exists in the sheet
      const checkUrl = `${sheetUrl}?action=check&team=${encodeURIComponent(teamName.trim())}`;
      const response = await fetch(checkUrl);
      const data = await response.json();
      
      if (data.exists) {
        setError('This team has already participated!');
        setHasParticipated(true);
        localStorage.setItem(storageKey, 'true');
      } else {
        setIsVerified(true);
      }
    } catch (err) {
      console.error('Verification error:', err);
      // If API fails, allow verification to proceed (fail-open for demo)
      // You may want to change this to fail-closed in production
      setIsVerified(true);
    } finally {
      setIsVerifying(false);
    }
  }, [teamName, sheetUrl, storageKey]);

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
      // Record the result to the sheet
      const formData = new FormData();
      formData.append('action', 'record');
      formData.append('team', teamName.trim());
      formData.append('result', mappedResult);

      await fetch(sheetUrl, {
        method: 'POST',
        body: formData
      });
      
      // Mark as participated
      localStorage.setItem(storageKey, 'true');
      setHasParticipated(true);
      setIsRecorded(true);
    } catch (err) {
      console.error('Recording error:', err);
      // Even if recording fails, show success to user (silent failure)
      localStorage.setItem(storageKey, 'true');
      setHasParticipated(true);
      setIsRecorded(true);
    } finally {
      setIsSpinning(false);
    }
  }, [isVerified, teamName, drawType, sheetUrl, storageKey]);

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
