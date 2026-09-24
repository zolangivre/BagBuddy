import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  BASE_CURRENCY,
  FALLBACK_RATES,
  convertFromBase,
  fetchRates,
  isStale,
  readCachedRates,
} from "@/lib/exchangeRates";

const CurrencyContext = createContext();

/**
 * Devise d'affichage choisie par l'utilisateur. Tous les montants reçus du
 * serveur sont en EUR (BASE_CURRENCY) : `format` les convertit vers la devise
 * choisie, et `formatBase` les montre tels quels, là où le montant exact compte
 * (ce qui sera débité).
 */
export const CurrencyProvider = ({ children }) => {
  const defaultLocale = Localization.getLocales()[0]?.languageTag || "en-US";

  const [currency, setCurrency] = useState(BASE_CURRENCY);
  const [locale, setLocale] = useState(defaultLocale);
  const [rates, setRates] = useState(FALLBACK_RATES);

  // Charger la devise sauvegardée
  useEffect(() => {
    const loadCurrency = async () => {
      const saved = await AsyncStorage.getItem("userCurrency");
      if (saved) setCurrency(saved);
    };
    loadCurrency();
  }, []);

  // Taux en cache d'abord (affichage immédiat, même hors ligne), puis relus
  // chez Frankfurter s'ils ont plus de 12 heures.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const cached = await readCachedRates();
      if (cached && !cancelled) setRates({ ...FALLBACK_RATES, ...cached.rates });
      if (!isStale(cached)) return;
      const fresh = await fetchRates();
      if (fresh && !cancelled) setRates({ ...FALLBACK_RATES, ...fresh.rates });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Changer la devise et sauvegarder
  const changeCurrency = async (newCurrency) => {
    setCurrency(newCurrency);
    await AsyncStorage.setItem("userCurrency", newCurrency);
  };

  const formatIn = useCallback(
    (amount, code) =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: code,
        currencyDisplay: "symbol",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount),
    [locale]
  );

  /** Montant du serveur (EUR) dans la devise d'affichage. */
  const format = (amount) => {
    if (amount == null || isNaN(amount)) return "–";
    const converted = convertFromBase(Number(amount), currency, rates);
    // Devise sans taux connu : mieux vaut le vrai montant en EUR qu'un faux.
    return converted === null
      ? formatIn(Number(amount), BASE_CURRENCY)
      : formatIn(converted, currency);
  };

  /** Montant du serveur tel quel, en EUR. */
  const formatBase = (amount) => {
    if (amount == null || isNaN(amount)) return "–";
    return formatIn(Number(amount), BASE_CURRENCY);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        changeCurrency,
        locale,
        setLocale,
        format,
        formatBase,
        // Vrai quand l'affichage est converti : le montant montré est alors
        // une estimation, le paiement se fait en EUR.
        isConverted: currency !== BASE_CURRENCY,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
