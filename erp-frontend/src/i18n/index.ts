import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import arTranslations from './locales/ar.json';
import enTranslations from './locales/en.json';

const resources = {
  ar: {
    translation: arTranslations,
  },
  en: {
    translation: enTranslations,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar', // Default language (Arabic)
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    
    // RTL support
    react: {
      useSuspense: false,
    },
  });

export default i18n;