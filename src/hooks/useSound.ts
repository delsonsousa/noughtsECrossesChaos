import { useCallback, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { useGameContext } from '../store/GameContext';

// TODO: adicionar pop.mp3 e win.mp3 em src/assets/sounds/

export const useSound = () => {
  const { soundEnabled } = useGameContext();
  const popRef = useRef<Audio.Sound | null>(null);
  const winRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const { sound: pop } = await Audio.Sound.createAsync(
          require('../assets/sounds/pop.mp3')
        );
        const { sound: win } = await Audio.Sound.createAsync(
          require('../assets/sounds/win.mp3')
        );
        popRef.current = pop;
        winRef.current = win;
      } catch {
        // sound files not present yet — no-op
      }
    };
    load();
    return () => {
      popRef.current?.unloadAsync().catch(() => {});
      winRef.current?.unloadAsync().catch(() => {});
    };
  }, []);

  const playPop = useCallback(async () => {
    if (!soundEnabled || !popRef.current) return;
    try {
      await popRef.current.setPositionAsync(0);
      await popRef.current.playAsync();
    } catch {
      // silently fail
    }
  }, [soundEnabled]);

  const playWin = useCallback(async () => {
    if (!soundEnabled || !winRef.current) return;
    try {
      await winRef.current.setPositionAsync(0);
      await winRef.current.playAsync();
    } catch {
      // silently fail
    }
  }, [soundEnabled]);

  return { playPop, playWin };
};
