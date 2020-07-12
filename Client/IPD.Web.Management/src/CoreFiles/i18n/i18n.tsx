import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as enTranslations from "./locale/en";
import * as faTranslations from "./locale/fa";


const resources = {
   en: { messages: enTranslations },
   fa: { messages: faTranslations }
};


i18n
   .use(initReactI18next)
   .init({
      react: {
         wait: true,
      },
      resources: resources,
      lng: 'en',
      fallbackLng: 'en',
      keySeparator: '.',
      interpolation: {
         escapeValue: false,
      },
      ns: ['messages'],
      defaultNS: 'messages',
      fallbackNS: [],

   });
export default i18n;