import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../theme/Colors";
import { Luggage } from "lucide-react-native";

const StatusCard = ({ status, description }) => {
  return (
    <View style={styles.reserveCard}>
      {status === "Browse listing" && (
        <>
          <View style={styles.reserveIcon}>
            <Luggage size={60} color={Colors.primary_color} />
          </View>
          <Text style={styles.reserveTitle}>Ready to Reserve Weight?</Text>
          <Text style={styles.reserveDescription}>
            Send a reservation request to secure baggage weight for your flight.
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  reserveCard: {
    padding: 20,
    backgroundColor: "rgba(14, 165, 233, 0.05)",
    borderRadius: 16,
    alignItems: "center",
    gap: 17,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  reserveIcon: {
    justifyContent: "center",
    alignItems: "center",
  },
  reserveTitle: {
    color: Colors.primary_color,
    fontSize: 20,
    fontWeight: "500",
    lineHeight: 28,
    letterSpacing: -0.449,
    textAlign: "center",
  },
  reserveDescription: {
    color: Colors.tertiary_color,
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    letterSpacing: -0.312,
    textAlign: "center",
  },
});

export default StatusCard;
