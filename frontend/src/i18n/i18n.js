import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import hi from "./hi.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    compatibilityJson: "v3",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already escapes values by default
    },
    resources: {
      en: en,
      hi: hi,
    },
  });

export default i18n;
