import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
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

  const move = useCallback(
    (options: FeedbackOptions = {}) => {
      void playMove({ force: options.forceSound });
      if (canHaptic(options.forceHaptics)) {
        void Haptics.selectionAsync();
      }
    },
    [canHaptic, playMove]
  );

  const action = useCallback(
    (options: FeedbackOptions = {}) => {
      void playAction({ force: options.forceSound });
      if (canHaptic(options.forceHaptics)) {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    },
    [canHaptic, playAction]
  );

  const success = useCallback(
    (options: FeedbackOptions = {}) => {
      void playWin({ force: options.forceSound });
      if (canHaptic(options.forceHaptics)) {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    },
    [canHaptic, playWin]
  );

  const toggle = useCallback(
    (options: FeedbackOptions = {}) => {
      void playToggle({ force: options.forceSound });
      if (canHaptic(options.forceHaptics)) {
        void Haptics.selectionAsync();
      }
    },
    [canHaptic, playToggle]
  );

  return {
    move,
    action,
    success,
    toggle,
  };
};
