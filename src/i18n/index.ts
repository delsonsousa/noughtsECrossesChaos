import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import en from './locales/en.json';
import pt from './locales/pt.json';
import es from './locales/es.json';

const deviceLang = getLocales()[0]?.languageCode ?? 'en';
const supportedLangs = ['en', 'pt', 'es'];
const fallbackLng = 'en';
const detectedLng = supportedLangs.includes(deviceLang) ? deviceLang : fallbackLng;

// i18next exposes `.use()` on its default instance.
// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    pt: { translation: pt },
    es: { translation: es },
  },
  lng: detectedLng,
  fallbackLng,
  interpolation: { escapeValue: false },
  compatibilityJSON: 'v4',
});

export default i18n;
