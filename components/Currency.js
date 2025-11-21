import React from "react";
import { Text } from "react-native";
import { useCurrency } from "@/contexts/CurrencyContext";

const Currency = ({ amount, style }) => {
  const { currency, format, rates } = useCurrency();
  if (currency === "USD") {
    return <Text style={style}>{format(amount)}</Text>;
  } else {
    const convertedAmount = amount * rates.quotes?.USDEUR;
    return <Text style={style}>{format(convertedAmount)}</Text>;
  }
};

export default Currency;
