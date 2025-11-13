import Colors from "@/theme/Colors";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const StatCard = ({
  icon,
  value,
  label,
  backgroundColor = "rgba(255, 255, 255, 0.10)",
  borderColor = "transparent",
  textColor = Colors.white,
  labelColor = Colors.very_light_grey,
}) => (
  <View style={[styles.statCard, { backgroundColor, borderColor }]}>
    <View style={styles.statIconContainer}>{icon}</View>
    <Text style={[styles.statValue, { color: textColor }]}>{value}</Text>
    <Text style={[styles.statLabel, { color: labelColor }]}>{label}</Text>
  </View>
);
const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 28,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
    textAlign: "center",
  },
});

export default StatCard;
