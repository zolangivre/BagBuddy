import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "./translations/en";
import fr from "./translations/fr";

const i18n = new I18n({ en, fr });
i18n.enableFallback = true;
i18n.defaultLocale = "en";

// 🧠 Initialisation de la langue
export async function initI18n() {
  try {
    const storedLang = await AsyncStorage.getItem("appLanguage");

    if (storedLang) {
      i18n.locale = storedLang;
    } else {
      const locales = Localization.getLocales();
      const deviceLang = locales[0]?.languageCode || "en";
      i18n.locale = deviceLang;
      await AsyncStorage.setItem("appLanguage", deviceLang);
    }
  } catch (error) {
    console.warn("Erreur initI18n:", error);
    i18n.locale = "en";
  }
}

// 🪄 Changement dynamique
export async function setLanguage(lang) {
  i18n.locale = lang;
  await AsyncStorage.setItem("appLanguage", lang);
}

export default i18n;
