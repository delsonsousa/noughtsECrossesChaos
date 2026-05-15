import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform, Vibration } from 'react-native';
import { useGameContext } from '../store/GameContext';
import { useSound } from './useSound';

type FeedbackOptions = {
  forceSound?: boolean;
  forceHaptics?: boolean;
};

export const useFeedback = () => {
  const { hapticsEnabled } = useGameContext();
  const { playMove, playWin, playAction, playToggle } = useSound();

  const canHaptic = useCallback(
    (force?: boolean) => hapticsEnabled || force === true,
    [hapticsEnabled]
  );

  const vibrateFallback = useCallback((pattern: number | number[]) => {
    if (Platform.OS === 'android') {
      Vibration.vibrate(pattern);
    }
  }, []);

  const move = useCallback(
    (options: FeedbackOptions = {}) => {
      void playMove({ force: options.forceSound });
      if (canHaptic(options.forceHaptics)) {
        void Haptics.selectionAsync();
        vibrateFallback(18);
      }
    },
    [canHaptic, playMove, vibrateFallback]
  );

  const action = useCallback(
    (options: FeedbackOptions = {}) => {
      void playAction({ force: options.forceSound });
      if (canHaptic(options.forceHaptics)) {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        vibrateFallback(26);
      }
    },
    [canHaptic, playAction, vibrateFallback]
  );

  const success = useCallback(
    (options: FeedbackOptions = {}) => {
      void playWin({ force: options.forceSound });
      if (canHaptic(options.forceHaptics)) {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        vibrateFallback([0, 35, 45, 70]);
      }
    },
    [canHaptic, playWin, vibrateFallback]
  );

  const toggle = useCallback(
    (options: FeedbackOptions = {}) => {
      void playToggle({ force: options.forceSound });
      if (canHaptic(options.forceHaptics)) {
        void Haptics.selectionAsync();
        vibrateFallback(16);
      }
    },
    [canHaptic, playToggle, vibrateFallback]
  );

  return {
    move,
    action,
    success,
    toggle,
  };
};
