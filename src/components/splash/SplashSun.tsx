import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';

export const SplashSun: React.FC = () => (
  <View style={styles.sun}>
    <LinearGradient
      colors={[colors.neonYellow, colors.sunOrange, colors.neonPink]}
      style={styles.sunGradient}
    />
    <View style={[styles.sunBand, { bottom: 30, height: 4 }]} />
    <View style={[styles.sunBand, { bottom: 20, height: 3 }]} />
    <View style={[styles.sunBand, { bottom: 12, height: 2 }]} />
    <View style={[styles.sunBand, { bottom: 6, height: 2 }]} />
  </View>
);

const styles = StyleSheet.create({
  sun: {
    width: 180,
    height: 180,
    borderRadius: 90,
    overflow: 'hidden',
    shadowColor: colors.sunOrange,
    shadowOpacity: 0.9,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 0 },
    elevation: 20,
  },
  sunGradient: {
    width: '100%',
    height: '100%',
  },
  sunBand: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: colors.background,
  },
});
