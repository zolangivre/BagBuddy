import React from "react";
import { View, Text, StyleSheet } from "react-native";
import RoundIconText from "./RoundIconText";
import Colors from "../theme/Colors";
import { useThemeContext } from "../contexts/ThemeContext";

const HowStep = ({ number, title, subtitle, color, backgroundColor }) => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <View style={styles.stepRow}>
      <RoundIconText
        text={number}
        backgroundColor={backgroundColor}
        size={32}
      colorText={color}
    />
    <View style={styles.textContainer}>
      <Text style={[styles.stepTitle, { color: theme.title }]}>{title}</Text>
      <Text style={[styles.stepSubtitle, { color: theme.text }]}>{subtitle}</Text>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  stepTitle: {
    color: Colors.secondary_color,
    fontSize: 14,
    fontWeight: "600",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  stepSubtitle: {
    color: Colors.tertiary_color,
    fontSize: 12,
  },
  textContainer: { flex: 1, gap: 4 },
});

export default HowStep;
