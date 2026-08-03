import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import cn from './translations/cn.json';
import th from './translations/th.json';
import hk from './translations/hk.json';
import en from './translations/en.json';

const resources = {
  cn: { translation: cn },
  de: { translation: en },
  en: { translation: en },
  fr: { translation: en },
  gb: { translation: en },
  hk: { translation: hk },
  it: { translation: en },
  jp: { translation: en },
  ko: { translation: en },
  th: { translation: th },
  tw: { translation: hk },
  zh: { translation: cn },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;
