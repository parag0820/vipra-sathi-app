import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './locales/en.json';
import hi from './locales/hi.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi }
};

const initI18n = async () => {
  let savedLanguage = 'hi';
  try {
    const lang = await AsyncStorage.getItem('language_preference');
    if (lang) savedLanguage = lang;
  } catch (error) {
    console.error('Failed to load language preference', error);
  }

  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: savedLanguage,
      fallbackLng: 'hi',
      interpolation: {
        escapeValue: false, // react already safes from xss
      },
      react: {
        useSuspense: false, // Prevent crashes if useTranslation is called before initialization
      },
    });
};

initI18n();

export default i18n;
