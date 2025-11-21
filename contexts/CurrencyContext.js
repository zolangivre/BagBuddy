import React, { createContext, useContext, useState, useEffect } from "react";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const defaultLocale = Localization.getLocales()[0]?.languageTag || "en-US";

  const [currency, setCurrency] = useState("EUR"); // devise affichée
  const [locale, setLocale] = useState(defaultLocale);
  // const [rates, setRates] = useState({
  //   privacy: "https://currencylayer.com/privacy",
  //   quotes: { USDEUR: 0.86434 },
  //   source: "USD",
  //   success: true,
  //   terms: "https://currencylayer.com/terms",
  //   timestamp: 1762945266,
  // }); // taux de conversion
  const [rates, setRates] = useState({}); // taux de conversion

  // Charger la devise sauvegardée
  useEffect(() => {
    const loadCurrency = async () => {
      const saved = await AsyncStorage.getItem("userCurrency");
      if (saved) setCurrency(saved);
    };
    loadCurrency();
  }, []);

  // Récupérer les taux de conversion depuis exchangerate.host
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await axios.get(
          "https://api.exchangerate.host/live?access_key=f18ca59c5dd7b683cd1ee7a0c0033bba&currencies=EUR"
        );
        setRates(res.data || {});
      } catch (e) {
        console.warn("Error fetching exchange rates:", e);
      }
    };
    fetchRates();
  }, []);
  // Changer la devise et sauvegarder
  const changeCurrency = async (newCurrency) => {
    setCurrency(newCurrency);
    await AsyncStorage.setItem("userCurrency", newCurrency);
  };

  // Formater un montant selon la devise choisie
  const format = (amount) => {
    if (amount == null || isNaN(amount)) return "–";

    const rate = rates[currency] || 1;
    const converted = amount * rate;

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      currencyDisplay: "symbol",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        changeCurrency,
        locale,
        setLocale,
        format,
        rates,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
