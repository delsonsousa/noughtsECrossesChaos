import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';
import { STORAGE_KEYS } from '../utils/constants';
import type { GameMode } from '../utils/gameModes';

type Language = 'pt' | 'en' | 'es';

interface Scores {
  X: number;
  O: number;
}

interface Scoreboards {
  local: Scores;
  cpu: Scores;
}

interface GameContextValue {
  scoreboards: Scoreboards;
  scoreboardsResetAt: number;
  completedMatches: number;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  language: Language;
  recordWin: (player: 'X' | 'O', mode: GameMode) => number;
  resetScores: () => Promise<void>;
  setSoundEnabled: (value: boolean) => Promise<void>;
  setHapticsEnabled: (value: boolean) => Promise<void>;
  setLanguage: (lang: Language) => Promise<void>;
}

const GameContext = createContext<GameContextValue | null>(null);

const EMPTY_SCORES: Scores = { X: 0, O: 0 };
const EMPTY_SCOREBOARDS: Scoreboards = {
  local: EMPTY_SCORES,
  cpu: EMPTY_SCORES,
};

const normalizeScoreboards = (storedScores: string | null): Scoreboards => {
  if (!storedScores) {
    return EMPTY_SCOREBOARDS;
  }

  try {
    const parsed = JSON.parse(storedScores) as Partial<Scoreboards> & Partial<Scores>;

    if (
      parsed.local != null &&
      parsed.cpu != null &&
      typeof parsed.local.X === 'number' &&
      typeof parsed.local.O === 'number' &&
      typeof parsed.cpu.X === 'number' &&
      typeof parsed.cpu.O === 'number'
    ) {
      return {
        local: { X: parsed.local.X, O: parsed.local.O },
        cpu: { X: parsed.cpu.X, O: parsed.cpu.O },
      };
    }

    if (typeof parsed.X === 'number' && typeof parsed.O === 'number') {
      return EMPTY_SCOREBOARDS;
    }
  } catch {
    // use defaults on malformed persisted data
  }

  return EMPTY_SCOREBOARDS;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [scoreboards, setScoreboards] =
    useState<Scoreboards>(EMPTY_SCOREBOARDS);
  const scoreboardsRef = useRef<Scoreboards>(EMPTY_SCOREBOARDS);
  const [scoreboardsResetAt, setScoreboardsResetAt] = useState(() =>
    Date.now()
  );
  const [completedMatches, setCompletedMatches] = useState(0);
  const completedMatchesRef = useRef(0);
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [hapticsEnabled, setHapticsEnabledState] = useState(true);
  const [language, setLanguageState] = useState<Language>('en');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [
          storedScores,
          storedScoresResetAt,
          storedCompletedMatches,
          storedSound,
          storedHaptics,
          storedLang,
        ] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.SCORES),
          AsyncStorage.getItem(STORAGE_KEYS.SCORES_RESET_AT),
          AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_MATCHES),
          AsyncStorage.getItem(STORAGE_KEYS.SOUND_ENABLED),
          AsyncStorage.getItem(STORAGE_KEYS.HAPTICS_ENABLED),
          AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE),
        ]);

        const loadedScoreboards = normalizeScoreboards(storedScores);
        scoreboardsRef.current = loadedScoreboards;
        setScoreboards(loadedScoreboards);
        if (storedScoresResetAt) {
          const parsedResetAt = Number.parseInt(storedScoresResetAt, 10);
          if (Number.isFinite(parsedResetAt) && parsedResetAt > 0) {
            setScoreboardsResetAt(parsedResetAt);
          }
        } else {
          const resetAt = Date.now();
          setScoreboardsResetAt(resetAt);
          AsyncStorage.setItem(
            STORAGE_KEYS.SCORES_RESET_AT,
            String(resetAt)
          ).catch(() => {});
        }
        if (storedCompletedMatches) {
          const parsedMatches = Number.parseInt(storedCompletedMatches, 10);
          if (Number.isFinite(parsedMatches) && parsedMatches >= 0) {
            completedMatchesRef.current = parsedMatches;
            setCompletedMatches(parsedMatches);
          }
        }
        if (storedSound !== null) setSoundEnabledState(storedSound === 'true');
        if (storedHaptics !== null)
          setHapticsEnabledState(storedHaptics === 'true');
        if (storedLang) {
          const lang = storedLang as Language;
          setLanguageState(lang);
          await i18n.changeLanguage(lang);
        }
      } catch {
        // use defaults on error
      } finally {
        setLoaded(true);
      }
    };
    load();
  }, []);

  const recordWin = useCallback((player: 'X' | 'O', mode: GameMode) => {
    const currentScoreboards = scoreboardsRef.current;
    const currentModeScores = currentScoreboards[mode];
    const nextScoreboards = {
      ...currentScoreboards,
      [mode]: {
        ...currentModeScores,
        [player]: currentModeScores[player] + 1,
      },
    };

    scoreboardsRef.current = nextScoreboards;
    setScoreboards(nextScoreboards);
    AsyncStorage.setItem(
      STORAGE_KEYS.SCORES,
      JSON.stringify(nextScoreboards)
    ).catch(() => {});

    const nextCompletedMatches = completedMatchesRef.current + 1;
    completedMatchesRef.current = nextCompletedMatches;
    setCompletedMatches(nextCompletedMatches);
    AsyncStorage.setItem(
      STORAGE_KEYS.COMPLETED_MATCHES,
      String(nextCompletedMatches)
    ).catch(() => {});

    return nextCompletedMatches;
  }, []);

  const resetScores = useCallback(async () => {
    const resetAt = Date.now();
    scoreboardsRef.current = EMPTY_SCOREBOARDS;
    setScoreboards(EMPTY_SCOREBOARDS);
    setScoreboardsResetAt(resetAt);
    await Promise.all([
      AsyncStorage.setItem(
        STORAGE_KEYS.SCORES,
        JSON.stringify(EMPTY_SCOREBOARDS)
      ),
      AsyncStorage.setItem(STORAGE_KEYS.SCORES_RESET_AT, String(resetAt)),
    ]);
  }, []);

  const setSoundEnabled = useCallback(async (value: boolean) => {
    setSoundEnabledState(value);
    await AsyncStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, String(value));
  }, []);

  const setHapticsEnabled = useCallback(async (value: boolean) => {
    setHapticsEnabledState(value);
    await AsyncStorage.setItem(STORAGE_KEYS.HAPTICS_ENABLED, String(value));
  }, []);

  const setLanguage = useCallback(async (lang: Language) => {
    setLanguageState(lang);
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, lang),
      i18n.changeLanguage(lang),
    ]);
  }, []);

  if (!loaded) return null;

  return (
    <GameContext.Provider
      value={{
        scoreboards,
        scoreboardsResetAt,
        completedMatches,
        soundEnabled,
        hapticsEnabled,
        language,
        recordWin,
        resetScores,
        setSoundEnabled,
        setHapticsEnabled,
        setLanguage,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = (): GameContextValue => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGameContext must be used within GameProvider');
  return ctx;
};
