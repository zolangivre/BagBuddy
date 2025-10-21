import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatCard = ({ icon, value, label }) => (
    <View style={styles.statCard}>
        <View style={styles.statIconContainer}>
            {icon}
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 0.612,
    borderColor: "rgba(255, 255, 255, 0.20)",
    backgroundColor: "rgba(255, 255, 255, 0.10)",
    alignItems: "center",
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statValue: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 28,
    letterSpacing: -0.439,
    marginBottom: 4,
  },
  statLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
    textAlign: "center",
  },
});

export default StatCard;