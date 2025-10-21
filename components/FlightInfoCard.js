import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Plane, ArrowRight, Clock } from "lucide-react-native";
import Colors from "../theme/Colors";

const FlightInfoCard = ({ item }) => {
  return (
    <View style={styles.flightInfoContainer}>
      <View style={styles.flightHeader}>
        <View style={styles.flightNumberContainer}>
          <View style={styles.flightIcon}>
            <Plane size={20} color={Colors.primary_color} />
          </View>
          <Text style={styles.flightNumber}>{item.flight}</Text>
        </View>
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.routeInfo}>
          <View style={styles.airportContainer}>
            <Text style={styles.airportCode}>{item.departure}</Text>
            <Text style={styles.routeLabel}>Departure</Text>
          </View>
          <View style={styles.arrowContainer}>
            <ArrowRight size={20} color={Colors.primary_color} />
            <View style={styles.routeLine} />
          </View>
          <View style={styles.airportContainer}>
            <Text style={styles.airportCode}>{item.arrival}</Text>
            <Text style={styles.routeLabel}>Arrival</Text>
          </View>
        </View>
        <View style={styles.timeContainer}>
          <Clock size={16} color={Colors.tertiary_color} />
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flightInfoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor:
      "linear-gradient(90deg, rgba(224, 242, 254, 0.30) 0%, rgba(224, 242, 254, 0.20) 50%, rgba(224, 242, 254, 0.30) 100%)",
    borderRadius: 16,
    borderWidth: 0.612,
    borderColor: "rgba(224, 242, 254, 0.20)",
    marginBottom: 10,
  },
  flightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  flightNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  flightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(14, 165, 233, 0.10)",
    justifyContent: "center",
    alignItems: "center",
  },
  flightNumber: {
    color: Colors.secondary_color,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
    letterSpacing: -0.312,
  },
  dateBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: "rgba(255, 255, 255, 0.50)",
    borderRadius: 10,
    borderWidth: 0.612,
    borderColor: "#E2E8F0",
  },
  dateText: {
    color: Colors.secondary_color,
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
  },
  routeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  routeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  airportContainer: {
    alignItems: "center",
  },
  airportCode: {
    color: Colors.secondary_color,
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 28,
    letterSpacing: -0.439,
  },
  routeLabel: {
    color: Colors.tertiary_color,
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
  },
  arrowContainer: {
    alignItems: "center",
    gap: 4,
  },
  routeLine: {
    width: 32,
    height: 1,
    backgroundColor: "rgba(14, 165, 233, 0.30)",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});

export default FlightInfoCard;
