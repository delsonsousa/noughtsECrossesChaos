import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors } from '../../theme/colors';
import { splashLayout } from '../../utils/splashLayout';

type SplashGridProps = {
  progress: Animated.Value;
};

export const SplashGrid: React.FC<SplashGridProps> = ({ progress }) => {
  const horizontalLines = Array.from({ length: 8 }).map((_, index) => {
    const t = index / 8;
    const y =
      splashLayout.gridHorizon +
      (splashLayout.height - splashLayout.gridHorizon) * Math.pow(t, 1.8);
    const opacity = progress.interpolate({
      inputRange: [t * 0.7, t * 0.7 + 0.15, 1],
      outputRange: [0, 1, 1],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        key={`h-${index}`}
        style={[styles.gridLineH, { top: y, opacity }]}
      />
    );
  });

  const verticalLines = Array.from({ length: 25 }).map((_, index) => {
    const offset = (index - 12) * (splashLayout.width / 12);
    const xBottom = splashLayout.centerX + offset;
    const opacity = progress.interpolate({
      inputRange: [0.3, 0.8],
      outputRange: [0, 0.7],
      extrapolate: 'clamp',
    });
    const dx = xBottom - splashLayout.centerX;
    const dy = splashLayout.height - splashLayout.gridHorizon;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI) - 90;

    return (
      <Animated.View
        key={`v-${index}`}
        style={[
          styles.gridLineV,
          {
            top: splashLayout.gridHorizon,
            left: splashLayout.centerX,
            height: length,
            opacity,
            transform: [{ rotate: `${angle}deg` }],
          },
        ]}
      />
    );
  });

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {verticalLines}
      {horizontalLines}
    </View>
  );
};

const styles = StyleSheet.create({
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.neonPink,
    shadowColor: colors.neonPink,
    shadowOpacity: 0.8,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  gridLineV: {
    position: 'absolute',
    width: 2,
    backgroundColor: colors.neonPink,
    transformOrigin: 'top center',
  },
});
