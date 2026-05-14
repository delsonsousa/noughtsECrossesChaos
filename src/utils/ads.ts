import { NativeModules, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './constants';

type GoogleMobileAdsModule = typeof import('react-native-google-mobile-ads');
type InterstitialAdInstance = ReturnType<
  GoogleMobileAdsModule['InterstitialAd']['createForAdRequest']
>;

// Replace these with your real AdMob IDs before going to production
const BANNER_ID_ANDROID = 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY';
const BANNER_ID_IOS = 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY';
const INTERSTITIAL_ID_ANDROID = 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY';
const INTERSTITIAL_ID_IOS = 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY';
const GAME_START_INTERSTITIAL_INTERVAL_MS = 2 * 60 * 1000;
const GAME_START_INTERSTITIAL_MATCHES = 5;
const GOOGLE_MOBILE_ADS_NATIVE_MODULE = 'RNGoogleMobileAdsModule';

let googleMobileAdsModule: GoogleMobileAdsModule | null | undefined;

export const getGoogleMobileAdsModule = (): GoogleMobileAdsModule | null => {
  if (NativeModules[GOOGLE_MOBILE_ADS_NATIVE_MODULE] == null) {
    return null;
  }

  if (googleMobileAdsModule !== undefined) {
    return googleMobileAdsModule;
  }

  try {
    // The static import crashes Expo Go because this native module is not in its binary.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    googleMobileAdsModule = require('react-native-google-mobile-ads');
  } catch {
    googleMobileAdsModule = null;
  }

  return googleMobileAdsModule ?? null;
};

export const getBannerAdId = (): string => {
  const ads = getGoogleMobileAdsModule();
  if (__DEV__ && ads != null) return ads.TestIds.BANNER;
  return Platform.OS === 'ios' ? BANNER_ID_IOS : BANNER_ID_ANDROID;
};

const getInterstitialAdId = (): string => {
  const ads = getGoogleMobileAdsModule();
  if (__DEV__ && ads != null) return ads.TestIds.INTERSTITIAL;
  return Platform.OS === 'ios'
    ? INTERSTITIAL_ID_IOS
    : INTERSTITIAL_ID_ANDROID;
};

let interstitial: InterstitialAdInstance | null = null;
let interstitialLoaded = false;
let interstitialShowing = false;

const parseStoredPositiveNumber = (value: string | null): number | null => {
  if (value == null) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};

const loadInterstitial = () => {
  try {
    const ads = getGoogleMobileAdsModule();
    if (ads == null) {
      return;
    }

    interstitial = ads.InterstitialAd.createForAdRequest(getInterstitialAdId(), {
      requestNonPersonalizedAdsOnly: false,
    });
    interstitial.addAdEventListener(ads.AdEventType.LOADED, () => {
      interstitialLoaded = true;
    });
    interstitial.addAdEventListener(ads.AdEventType.CLOSED, () => {
      interstitialLoaded = false;
      interstitialShowing = false;
      loadInterstitial();
    });
    interstitial.load();
  } catch {
    // silently fail if ads SDK is not ready
  }
};

export const initInterstitial = () => loadInterstitial();

export const initAds = async (): Promise<void> => {
  try {
    const ads = getGoogleMobileAdsModule();
    if (ads == null) {
      return;
    }

    const mobileAds = ads.default;
    await mobileAds().setRequestConfiguration({
      maxAdContentRating: ads.MaxAdContentRating.G,
      tagForChildDirectedTreatment: false,
      tagForUnderAgeOfConsent: false,
    });
    await mobileAds().initialize();
    initInterstitial();
  } catch {
    // silently fail if AdMob is not available in the current runtime
  }
};

export const showInterstitial = async (): Promise<boolean> => {
  try {
    if (!interstitial || !interstitialLoaded || interstitialShowing) {
      loadInterstitial();
      return false;
    }

    interstitialShowing = true;
    await Promise.race([
      interstitial.show(),
      new Promise<void>((resolve) => {
        setTimeout(resolve, 2500);
      }),
    ]);
    return true;
  } catch {
    // silently fail
    return false;
  } finally {
    interstitialShowing = false;
  }
};

export const maybeShowGameStartInterstitial = async (): Promise<void> => {
  try {
    const now = Date.now();
    const [storedLastShownAt, storedStartsSinceInterstitial] =
      await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.AD_LAST_GAME_START_INTERSTITIAL_AT),
        AsyncStorage.getItem(STORAGE_KEYS.AD_GAME_STARTS_SINCE_INTERSTITIAL),
      ]);
    const lastShownAt = parseStoredPositiveNumber(storedLastShownAt);
    const startsSinceInterstitial =
      parseStoredPositiveNumber(storedStartsSinceInterstitial) ?? 0;

    if (lastShownAt == null) {
      await Promise.all([
        AsyncStorage.setItem(
          STORAGE_KEYS.AD_LAST_GAME_START_INTERSTITIAL_AT,
          String(now)
        ),
        AsyncStorage.setItem(
          STORAGE_KEYS.AD_GAME_STARTS_SINCE_INTERSTITIAL,
          '1'
        ),
      ]);
      return;
    }

    const nextStartsSinceInterstitial = startsSinceInterstitial + 1;
    const shouldShowByTime =
      now - lastShownAt >= GAME_START_INTERSTITIAL_INTERVAL_MS;
    const shouldShowByMatchCount =
      nextStartsSinceInterstitial >= GAME_START_INTERSTITIAL_MATCHES;

    if (!shouldShowByTime && !shouldShowByMatchCount) {
      await AsyncStorage.setItem(
        STORAGE_KEYS.AD_GAME_STARTS_SINCE_INTERSTITIAL,
        String(nextStartsSinceInterstitial)
      );
      return;
    }

    const shown = await showInterstitial();

    if (!shown) {
      await AsyncStorage.setItem(
        STORAGE_KEYS.AD_GAME_STARTS_SINCE_INTERSTITIAL,
        String(nextStartsSinceInterstitial)
      );
      return;
    }

    await Promise.all([
      AsyncStorage.setItem(
        STORAGE_KEYS.AD_LAST_GAME_START_INTERSTITIAL_AT,
        String(Date.now())
      ),
      AsyncStorage.setItem(
        STORAGE_KEYS.AD_GAME_STARTS_SINCE_INTERSTITIAL,
        '0'
      ),
    ]);
  } catch {
    // silently fail; ads must never block a match from starting
  }
};
