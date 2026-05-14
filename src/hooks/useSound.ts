import { useCallback, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { useGameContext } from '../store/GameContext';

type SoundName = 'move' | 'win' | 'action' | 'toggle';

type PlaySoundOptions = {
  force?: boolean;
};

const SOUND_ASSETS: Record<SoundName, number> = {
  move: require('../assets/sounds/move.wav'),
  win: require('../assets/sounds/win.wav'),
  action: require('../assets/sounds/action.wav'),
  toggle: require('../assets/sounds/toggle.wav'),
};

export const useSound = () => {
  const { soundEnabled } = useGameContext();
  const soundsRef = useRef<Partial<Record<SoundName, Audio.Sound>>>({});

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
        });

        const loadedSounds = await Promise.all(
          (Object.keys(SOUND_ASSETS) as SoundName[]).map(async (name) => {
            const { sound } = await Audio.Sound.createAsync(
              SOUND_ASSETS[name],
              { shouldPlay: false, volume: name === 'win' ? 0.65 : 0.5 }
            );

            return [name, sound] as const;
          })
        );

        if (!mounted) {
          await Promise.all(
            loadedSounds.map(([, sound]) => sound.unloadAsync())
          );
          return;
        }

        soundsRef.current = Object.fromEntries(loadedSounds) as Record<
          SoundName,
          Audio.Sound
        >;
      } catch {
        soundsRef.current = {};
      }
    };

    void load();

    return () => {
      mounted = false;
      Object.values(soundsRef.current).forEach((sound) => {
        sound?.unloadAsync().catch(() => {});
      });
      soundsRef.current = {};
    };
  }, []);

  const playSound = useCallback(
    async (name: SoundName, options: PlaySoundOptions = {}) => {
      if (!options.force && !soundEnabled) {
        return;
      }

      const sound = soundsRef.current[name];

      if (!sound) {
        return;
      }

      try {
        await sound.replayAsync();
      } catch {
        // Audio feedback should never block gameplay.
      }
    },
    [soundEnabled]
  );

  const playMove = useCallback(
    (options?: PlaySoundOptions) => playSound('move', options),
    [playSound]
  );
  const playWin = useCallback(
    (options?: PlaySoundOptions) => playSound('win', options),
    [playSound]
  );
  const playAction = useCallback(
    (options?: PlaySoundOptions) => playSound('action', options),
    [playSound]
  );
  const playToggle = useCallback(
    (options?: PlaySoundOptions) => playSound('toggle', options),
    [playSound]
  );

  return {
    playMove,
    playWin,
    playAction,
    playToggle,
    playPop: playMove,
  };
};
