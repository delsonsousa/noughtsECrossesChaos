import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { splashPositions, splashTiming } from '../utils/splashLayout';

type UseSplashAnimationParams = {
  onFinish: () => void;
};

export const useSplashAnimation = ({ onFinish }: UseSplashAnimationParams) => {
  const gridProgress = useRef(new Animated.Value(0)).current;
  const sunProgress = useRef(new Animated.Value(0)).current;
  const xPosX = useRef(new Animated.Value(splashPositions.xStart)).current;
  const oPosX = useRef(new Animated.Value(splashPositions.oStart)).current;
  const xTrailPosX = useRef(new Animated.Value(splashPositions.xStart)).current;
  const oTrailPosX = useRef(new Animated.Value(splashPositions.oStart)).current;
  const trailOpacity = useRef(new Animated.Value(0)).current;
  const flashOpacity = useRef(new Animated.Value(0)).current;
  const shakeX = useRef(new Animated.Value(0)).current;
  const chromaticOffset = useRef(new Animated.Value(0)).current;
  const chaosOpacity = useRef(new Animated.Value(0)).current;
  const chaosGlitch = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const xoPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.timing(gridProgress, {
        toValue: 1,
        duration: splashTiming.grid,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(sunProgress, {
        toValue: 1,
        duration: splashTiming.sun,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(xPosX, {
          toValue: splashPositions.xFinal,
          duration: splashTiming.fly,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(oPosX, {
          toValue: splashPositions.oFinal,
          duration: splashTiming.fly,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(80),
          Animated.parallel([
            Animated.timing(xTrailPosX, {
              toValue: splashPositions.xFinal,
              duration: splashTiming.fly - 80,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(oTrailPosX, {
              toValue: splashPositions.oFinal,
              duration: splashTiming.fly - 80,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(trailOpacity, {
                toValue: 0.4,
                duration: 50,
                useNativeDriver: true,
              }),
              Animated.timing(trailOpacity, {
                toValue: 0,
                duration: splashTiming.fly - 130,
                useNativeDriver: true,
              }),
            ]),
          ]),
        ]),
      ]),
      Animated.parallel([
        Animated.sequence([
          Animated.timing(flashOpacity, {
            toValue: 1,
            duration: 60,
            useNativeDriver: true,
          }),
          Animated.timing(flashOpacity, {
            toValue: 0,
            duration: 140,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(chromaticOffset, {
            toValue: 20,
            duration: 60,
            useNativeDriver: true,
          }),
          Animated.timing(chromaticOffset, {
            toValue: 0,
            duration: 140,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(shakeX, {
            toValue: 12,
            duration: 30,
            useNativeDriver: true,
          }),
          Animated.timing(shakeX, {
            toValue: -10,
            duration: 30,
            useNativeDriver: true,
          }),
          Animated.timing(shakeX, {
            toValue: 8,
            duration: 30,
            useNativeDriver: true,
          }),
          Animated.timing(shakeX, {
            toValue: -5,
            duration: 30,
            useNativeDriver: true,
          }),
          Animated.timing(shakeX, {
            toValue: 3,
            duration: 30,
            useNativeDriver: true,
          }),
          Animated.timing(shakeX, {
            toValue: 0,
            duration: 50,
            useNativeDriver: true,
          }),
        ]),
      ]),
      Animated.sequence([
        Animated.delay(80),
        Animated.parallel([
          Animated.timing(chaosOpacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(chaosGlitch, {
              toValue: 1,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(chaosGlitch, {
              toValue: 0,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(chaosGlitch, {
              toValue: 1,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(chaosGlitch, {
              toValue: 0,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(chaosGlitch, {
              toValue: 1,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(chaosGlitch, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }),
          ]),
        ]),
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(xoPulse, {
          toValue: 1.05,
          duration: 300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(xoPulse, {
          toValue: 1,
          duration: 300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ]);

    animation.start(({ finished }) => {
      if (finished) {
        onFinish();
      }
    });

    return () => {
      animation.stop();
    };
  }, [
    chaosGlitch,
    chaosOpacity,
    chromaticOffset,
    flashOpacity,
    gridProgress,
    oPosX,
    oTrailPosX,
    onFinish,
    shakeX,
    subtitleOpacity,
    sunProgress,
    trailOpacity,
    xPosX,
    xTrailPosX,
    xoPulse,
  ]);

  return {
    gridProgress,
    sunProgress,
    xPosX,
    oPosX,
    xTrailPosX,
    oTrailPosX,
    trailOpacity,
    flashOpacity,
    shakeX,
    chromaticOffset,
    chaosOpacity,
    chaosGlitch,
    subtitleOpacity,
    xoPulse,
  };
};
