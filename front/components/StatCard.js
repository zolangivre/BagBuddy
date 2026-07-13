import Colors from "@/theme/Colors";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useThemeContext } from "@/contexts/ThemeContext";

const StatCard = ({
  icon,
  value,
  label,
  backgroundColor = "rgba(255, 255, 255, 0.10)",
  borderColor = "transparent",
  textColor = Colors.white,
  labelColor = Colors.very_light_grey,
}) => {
    const { theme: colorScheme } = useThemeContext();
    const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <View style={[styles.statCard, { backgroundColor, borderColor }]}>
      <View style={styles.statIconContainer}>{icon}</View>
      <Text style={[theme.textStyles.statValue, { color: textColor }]}>{value}</Text>
      <Text style={[theme.textStyles.statLabel, { color: labelColor, textAlign: "center" }]}>{label}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignItems: "center",
    gap: 4,
  },
  statIconContainer: {
    marginBottom: 8,
  },
});

export default StatCard;
