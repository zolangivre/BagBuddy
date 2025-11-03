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
        <Text style={theme.textStyles.cardTitle}>{title}</Text>
        <Text style={theme.textStyles.cardSubtitle}>{subtitle}</Text>
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
  textContainer: { flex: 1, gap: 4 },
});

export default HowStep;
