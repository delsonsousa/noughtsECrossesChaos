import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SplashGrid } from '../components/splash/SplashGrid';
import { SplashPieces } from '../components/splash/SplashPieces';
import { SplashSun } from '../components/splash/SplashSun';
import { SplashTitle } from '../components/splash/SplashTitle';
import { useSplashAnimation } from '../hooks/useSplashAnimation';
import { colors } from '../theme/colors';
import { splashLayout } from '../utils/splashLayout';

type Props = {
  onFinish: () => void;
};

export const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  const animation = useSplashAnimation({ onFinish });

  const sunTranslateY = animation.sunProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [120, 0],
  });
  const sunScale = animation.sunProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });
  const sunOpacity = animation.sunProgress.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0, 0.5, 1],
  });
  const chromaticRedTranslate = animation.chromaticOffset.interpolate({
    inputRange: [0, 20],
    outputRange: [0, -20],
  });
  const chromaticBlueTranslate = animation.chromaticOffset.interpolate({
    inputRange: [0, 20],
    outputRange: [0, 20],
  });
  const chromaticOpacity = animation.chromaticOffset.interpolate({
    inputRange: [0, 5, 20],
    outputRange: [0, 0.6, 0.8],
  });

  return (
    <LinearGradient
      colors={[colors.backgroundTop, colors.backgroundMid, colors.background]}
      style={styles.container}
    >
      <SplashGrid progress={animation.gridProgress} />

      <Animated.View
        style={[
          styles.shakeContainer,
          { transform: [{ translateX: animation.shakeX }] },
        ]}
      >
        <Animated.View
          style={[
            styles.sunContainer,
            {
              opacity: sunOpacity,
              transform: [{ translateY: sunTranslateY }, { scale: sunScale }],
            },
          ]}
        >
          <SplashSun />
        </Animated.View>

        <SplashPieces
          xPosX={animation.xPosX}
          oPosX={animation.oPosX}
          xTrailPosX={animation.xTrailPosX}
          oTrailPosX={animation.oTrailPosX}
          trailOpacity={animation.trailOpacity}
          chromaticOpacity={chromaticOpacity}
          chromaticRedTranslate={chromaticRedTranslate}
          chromaticBlueTranslate={chromaticBlueTranslate}
          xoPulse={animation.xoPulse}
        />

        <SplashTitle
          chaosOpacity={animation.chaosOpacity}
          chaosGlitch={animation.chaosGlitch}
          subtitleOpacity={animation.subtitleOpacity}
        />
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[styles.flash, { opacity: animation.flashOpacity }]}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  shakeContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  flash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.text,
  },
  sunContainer: {
    position: 'absolute',
    top: splashLayout.sunCy - 90,
    left: splashLayout.centerX - 90,
    width: 180,
    height: 180,
  },
});
