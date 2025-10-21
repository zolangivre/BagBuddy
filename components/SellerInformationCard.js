import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../theme/Colors";
import {
  MessageCircle,
  Phone,
  Plane,
  Dot,
  ArrowRight,
  Clock,
  Scale,
} from "lucide-react-native";
import ButtonIcon from "./ButtonIcon";

const SellerInformationCard = () => {
  return (
    <View style={styles.card}>
      <View style={styles.sellerCard}>
        <View style={styles.sellerAvatar}>
          <Text style={styles.sellerInitials}>KB</Text>
        </View>
        <View style={styles.sellerInfo}>
          <Text style={styles.sellerName}>Karim Benzema</Text>
          <Text style={styles.sellerRating}>★ 4.9 • Seller</Text>
        </View>
        <ButtonIcon
          //   onPress={}
          icon={<MessageCircle size={16} color={Colors.secondary_color} />}
        />
        <ButtonIcon
          //   onPress={}
          icon={<Phone size={16} color={Colors.secondary_color} />}
        />
      </View>

      {/* Flight Details */}
      <View style={styles.flightDetailsRow}>
        <Plane size={16} color={Colors.primary_color} />
        <Text style={styles.airlineName}>Emirates</Text>
        <Dot size={20} color={Colors.tertiary_color} />
        <Text style={styles.flightNumber}>EK 203</Text>
      </View>

      {/* Route Information */}
      <View style={styles.routeContainer}>
        <View style={styles.airportSection}>
          <Text style={styles.airportCode}>DXB</Text>
          <Text style={styles.airportName}>Dubai International Airport</Text>
        </View>

        <View style={styles.arrowSection}>
          <ArrowRight size={24} color={Colors.primary_color} />
        </View>

        <View style={styles.airportSection}>
          <Text style={[styles.airportCode, styles.airportCodeRight]}>JFK</Text>
          <Text style={[styles.airportName, styles.airportNameRight]}>
            John F. Kennedy International Airport
          </Text>
        </View>
      </View>

      {/* Time and Date */}
      <View style={styles.timeRow}>
        <View style={styles.timeSection}>
          <Clock size={16} color={Colors.primary_color} />
          <Text style={styles.timeText}>14:30</Text>
        </View>
        <View style={styles.dateSection}>
          <Text style={styles.dateText}>Dec 25, 2024</Text>
        </View>
        <View style={styles.timeSection}>
          <Text style={styles.timeText}>20:15</Text>
        </View>
      </View>

      {/* Weight and Price */}
      <View style={styles.weightPriceRow}>
        <View style={styles.weightSection}>
          <Scale size={16} color={Colors.success_color} />
          <Text style={styles.weightText}>15kg available</Text>
        </View>
        <View style={styles.priceSection}>
          <Text style={styles.priceText}>$12/kg</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sellerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "rgba(224, 242, 254, 0.30)",
    marginBottom: 20,
  },
  sellerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(14, 165, 233, 0.10)",
    justifyContent: "center",
    alignItems: "center",
  },
  sellerInitials: {
    color: Colors.primary_color,
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    color: Colors.secondary_color,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
  },
  sellerRating: {
    color: Colors.tertiary_color,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
  contactButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 0.612,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  flightDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 20,
  },
  airlineName: {
    color: Colors.secondary_color,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
  },
  flightNumber: {
    color: Colors.tertiary_color,
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  airportSection: {
    flex: 1,
  },
  arrowSection: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  airportCode: {
    color: Colors.secondary_color,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
  },
  airportCodeRight: {
    textAlign: "right",
  },
  airportName: {
    color: Colors.tertiary_color,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    width: 81,
  },
  airportNameRight: {
    textAlign: "right",
    width: 107,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  timeSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  dateSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  timeText: {
    color: Colors.secondary_color,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  dateText: {
    color: Colors.tertiary_color,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
  weightPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 0.612,
    borderTopColor: "#E2E8F0",
    paddingTop: 16,
  },
  weightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  weightText: {
    color: Colors.secondary_color,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  priceSection: {
    flex: 1,
    alignItems: "flex-end",
  },
  priceText: {
    color: Colors.primary_color,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
  },
});

export default SellerInformationCard;
