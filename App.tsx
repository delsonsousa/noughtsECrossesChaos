import './global.css';
import './src/i18n';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';

import { Bungee_400Regular, useFonts } from '@expo-google-fonts/bungee';
import { SpaceGrotesk_500Medium } from '@expo-google-fonts/space-grotesk';
import { GameScreen } from './src/screens/GameScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { SplashScreen } from './src/screens/SplashScreen';
import { GameProvider } from './src/store/GameContext';
import { initInterstitial } from './src/utils/ads';
import type { CpuDifficulty, GameMode } from './src/utils/gameModes';

export type RootStackParamList = {
  Home: undefined;
  Game: {
    mode: GameMode;
    difficulty?: CpuDifficulty;
  };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashFinish = useCallback(() => {
    setSplashDone(true);
  }, []);
  const [fontsLoaded] = useFonts({
    Bungee_400Regular,
    SpaceGrotesk_500Medium,
  });

  useEffect(() => {
    const init = async () => {
      try {
        await mobileAds().setRequestConfiguration({
          maxAdContentRating: MaxAdContentRating.G,
          tagForChildDirectedTreatment: false,
          tagForUnderAgeOfConsent: false,
        });
        await mobileAds().initialize();
        initInterstitial();
      } catch {
        // silently fail if AdMob not yet configured
      }
    };
    init();
  }, []);

  if (!splashDone) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (!fontsLoaded) return null;

  return (
    <GameProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Game" component={GameScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GameProvider>
  );
}
