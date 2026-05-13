import React from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { colors } from '../../theme/colors';
import { splashLayout } from '../../utils/splashLayout';

type SplashTitleProps = {
  chaosOpacity: Animated.Value;
  chaosGlitch: Animated.Value;
  subtitleOpacity: Animated.Value;
};

export const SplashTitle: React.FC<SplashTitleProps> = ({
  chaosOpacity,
  chaosGlitch,
  subtitleOpacity,
}) => (
  <>
    <Animated.View style={[styles.titleContainer, { opacity: chaosOpacity }]}>
      <Animated.Text
        style={[
          styles.titleGlitchPink,
          { opacity: chaosGlitch, transform: [{ translateX: -3 }] },
        ]}
      >
        CHAOS
      </Animated.Text>
      <Animated.Text
        style={[
          styles.titleGlitchCyan,
          { opacity: chaosGlitch, transform: [{ translateX: 3 }] },
        ]}
      >
        CHAOS
      </Animated.Text>
      <Text style={styles.titleMain}>CHAOS</Text>
    </Animated.View>

    <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
      NOUGHTS × CROSSES
    </Animated.Text>
  </>
);

const titleText = {
  fontSize: 64,
  fontFamily: 'Bungee_400Regular',
  letterSpacing: 4,
};

const styles = StyleSheet.create({
  titleContainer: {
    position: 'absolute',
    top: splashLayout.height * 0.6,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 90,
  },
  titleMain: {
    ...titleText,
    color: colors.text,
    textShadowColor: colors.neonPink,
    textShadowRadius: 16,
    textShadowOffset: { width: 0, height: 0 },
  },
  titleGlitchPink: {
    ...titleText,
    position: 'absolute',
    color: colors.neonPink,
  },
  titleGlitchCyan: {
    ...titleText,
    position: 'absolute',
    color: colors.neonCyan,
  },
  subtitle: {
    position: 'absolute',
    top: splashLayout.height * 0.7,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'SpaceGrotesk_500Medium',
    color: colors.neonCyan,
    letterSpacing: 6,
  },
});
