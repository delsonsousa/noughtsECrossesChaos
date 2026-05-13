import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const splashLayout = {
  width,
  height,
  centerX: width / 2,
  centerY: height * 0.42,
  sunCy: height * 0.6,
  gridHorizon: height * 0.68,
  spacing: 55,
} as const;

export const splashPositions = {
  xStart: -150,
  oStart: width + 150,
  xFinal: width / 2 - splashLayout.spacing,
  oFinal: width / 2 + splashLayout.spacing,
} as const;

export const splashTiming = {
  grid: 400,
  sun: 400,
  fly: 400,
} as const;
