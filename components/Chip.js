import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { X } from "lucide-react-native";
import Colors from "@/theme/Colors";
import { useThemeContext } from "@/contexts/ThemeContext";

/**
 * Puce sélectionnable (choix dans une feuille) ou retirable (`onRemove` : un
 * filtre actif, avec sa croix).
 */
export default function Chip({ label, selected = false, onPress, onRemove, icon = null }) {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const isDark = colorScheme === "dark";
  const active = selected || Boolean(onRemove);

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        {
          backgroundColor: active
            ? Colors.dark_cyan_translucent
            : isDark
              ? Colors.dark_4
              : Colors.very_light_blue,
          borderColor: active
            ? Colors.primary_color
            : isDark
              ? Colors.dark_4
              : Colors.very_light_grey,
        },
      ]}
      onPress={onRemove ?? onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      {icon}
      <Text
        style={[styles.label, { color: active ? Colors.primary_color : theme.title }]}
        numberOfLines={1}
      >
        {label}
      </Text>
      {onRemove ? <X size={14} color={Colors.primary_color} /> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
});
