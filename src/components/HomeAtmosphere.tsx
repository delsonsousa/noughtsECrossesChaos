import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

const EMBER_PARTICLES = [
  { left: '12%', top: '91%', color: colors.sunOrange, delay: 0, size: 2 },
  { left: '18%', top: '88%', color: colors.neonYellow, delay: 420, size: 2 },
  { left: '27%', top: '92%', color: colors.neonPink, delay: 880, size: 3 },
  { left: '35%', top: '86%', color: colors.sunOrange, delay: 1240, size: 2 },
  { left: '44%', top: '90%', color: colors.neonYellow, delay: 1660, size: 3 },
  { left: '52%', top: '87%', color: colors.neonPink, delay: 2120, size: 2 },
  { left: '61%', top: '93%', color: colors.sunOrange, delay: 2540, size: 2 },
  { left: '70%', top: '88%', color: colors.neonYellow, delay: 2960, size: 2 },
  { left: '78%', top: '91%', color: colors.neonPink, delay: 3400, size: 3 },
  { left: '86%', top: '86%', color: colors.sunOrange, delay: 3820, size: 2 },
  { left: '23%', top: '80%', color: colors.neonYellow, delay: 4500, size: 2 },
  { left: '67%', top: '82%', color: colors.sunOrange, delay: 5200, size: 2 },
  { left: '31%', top: '96%', color: colors.neonYellow, delay: 5800, size: 2 },
  { left: '39%', top: '94%', color: colors.sunOrange, delay: 6400, size: 3 },
  { left: '47%', top: '97%', color: colors.neonPink, delay: 7000, size: 2 },
  { left: '55%', top: '95%', color: colors.neonYellow, delay: 7600, size: 2 },
  { left: '63%', top: '96%', color: colors.sunOrange, delay: 8200, size: 2 },
  { left: '72%', top: '94%', color: colors.neonPink, delay: 8800, size: 2 },
] as const;

const EMBER_DURATION_MS = 7600;

export const HomeAtmosphere = () => {
  const ambient = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(ambient, {
          toValue: 1,
          duration: 3200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(ambient, {
          toValue: 0,
          duration: 3200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();

    return () => loop.stop();
  }, [ambient]);

  const sunOpacity = ambient.interpolate({
    inputRange: [0, 1],
    outputRange: [0.07, 0.13],
  });
  const gridOpacity = ambient.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.14],
  });

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      <Animated.View
        style={{
          position: 'absolute',
          top: 130,
          left: '50%',
          width: 180,
          height: 180,
          marginLeft: -90,
          borderRadius: 90,
          backgroundColor: colors.sunOrange,
          opacity: sunOpacity,
          shadowColor: colors.neonPink,
          shadowOpacity: 0.55,
          shadowRadius: 42,
          shadowOffset: { width: 0, height: 0 },
          transform: [
            {
              scale: ambient.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.04],
              }),
            },
          ],
        }}
      />
      <Animated.View
        style={{
          position: 'absolute',
          top: 150,
          left: '50%',
          width: 138,
          height: 138,
          marginLeft: -69,
          borderRadius: 69,
          backgroundColor: colors.neonYellow,
          opacity: ambient.interpolate({
            inputRange: [0, 1],
            outputRange: [0.03, 0.07],
          }),
          shadowColor: colors.neonYellow,
          shadowOpacity: 0.4,
          shadowRadius: 26,
          shadowOffset: { width: 0, height: 0 },
        }}
      />

      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 60,
          height: 140,
          overflow: 'hidden',
          opacity: gridOpacity,
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6].map((line) => (
          <View
            key={`grid-h-${line}`}
            style={{
              position: 'absolute',
              left: '-10%',
              right: '-10%',
              bottom: `${Math.pow(line / 6, 1.8) * 100}%`,
              height: 1.5,
              backgroundColor: colors.neonPink,
              shadowColor: colors.neonPink,
              shadowOpacity: 0.65,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 0 },
            }}
          />
        ))}
        {[-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map((line) => (
          <View
            key={`grid-v-${line}`}
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              width: 1.5,
              height: 170,
              backgroundColor: colors.neonPink,
              opacity: 0.5,
              transform: [
                { translateX: line * 18 },
                { rotate: `${line * 7}deg` },
              ],
            }}
          />
        ))}
      </Animated.View>

      {EMBER_PARTICLES.map((particle) => (
        <EmberParticle
          key={`${particle.left}-${particle.top}-${particle.delay}`}
          color={particle.color}
          delay={particle.delay}
          left={particle.left}
          top={particle.top}
          size={particle.size}
        />
      ))}
    </View>
  );
};

type EmberParticleProps = {
  color: string;
  delay: number;
  left: `${number}%`;
  top: `${number}%`;
  size: number;
};

const EmberParticle = ({ color, delay, left, top, size }: EmberParticleProps) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(progress, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 1,
          duration: EMBER_DURATION_MS,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();

    return () => loop.stop();
  }, [delay, progress]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left,
        top,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: progress.interpolate({
          inputRange: [0, 0.06, 0.55, 0.82, 1],
          outputRange: [0, 0.95, 0.6, 0.16, 0],
        }),
        shadowColor: color,
        shadowOpacity: 1,
        shadowRadius: size * 3,
        shadowOffset: { width: 0, height: 0 },
        transform: [
          {
            translateY: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -720],
            }),
          },
          {
            translateX: progress.interpolate({
              inputRange: [0, 0.25, 0.55, 0.8, 1],
              outputRange: [0, 14, -10, 20, 6],
            }),
          },
          {
            scale: progress.interpolate({
              inputRange: [0, 0.08, 0.7, 0.9, 1],
              outputRange: [0.4, 1.35, 0.85, 0.35, 0.05],
            }),
          },
        ],
      }}
    />
  );
};
