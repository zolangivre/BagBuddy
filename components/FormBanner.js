import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AlertCircle, CheckCircle2 } from "lucide-react-native";
import Colors from "@/theme/Colors";
import { typography } from "@/theme/Fonts";

/**
 * Message global d'un formulaire, au-dessus de ses champs : échec qui ne
 * désigne aucun champ, ou confirmation d'enregistrement.
 */
export default function FormBanner({ tone, text }) {
  const isError = tone === "error";
  const color = isError ? Colors.error_color : Colors.success_color;
  const Icon = isError ? AlertCircle : CheckCircle2;
  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: isError
            ? Colors.red_translucent
            : Colors.light_green_translucent,
          borderColor: isError
            ? Colors.red_translucent_2
            : Colors.light_green_translucent_2,
        },
      ]}
      accessibilityLiveRegion="polite"
    >
      <Icon size={18} color={color} />
      <Text style={[typography.body2, styles.text, { color }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  text: {
    flex: 1,
  },
});
