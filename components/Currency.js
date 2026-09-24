import React from "react";
import { Text } from "react-native";
import { useCurrency } from "@/contexts/CurrencyContext";

/** Montant du serveur (EUR), affiché dans la devise choisie par l'utilisateur. */
const Currency = ({ amount, style }) => {
  const { format } = useCurrency();
  return <Text style={style}>{format(amount)}</Text>;
};

export default Currency;
