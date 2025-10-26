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
import { TRANSACTION_STATUS } from "@/constants/transaction-status";
import { useThemeContext } from "../contexts/ThemeContext";

const SellerInformationCard = ({ status }) => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <>
      <View style={[styles.sellerCard, { backgroundColor: theme.flightCard }]}>
        <View style={styles.sellerAvatar}>
          <Text style={styles.sellerInitials}>KB</Text>
        </View>
        <View style={styles.sellerInfo}>
          <Text style={[styles.sellerName, { color: theme.title }]}>
            Karim Benzema
          </Text>
          <Text style={[styles.sellerRating, { color: theme.text }]}>
            ★ 4.9 • Seller
          </Text>
        </View>
        <ButtonIcon
          //   onPress={}
          icon={<MessageCircle size={16} color={theme.title} />}
        />
        <ButtonIcon
          //   onPress={}
          icon={<Phone size={16} color={theme.title} />}
        />
      </View>

      {/* Flight Details */}
      <View style={styles.flightDetailsRow}>
        <Plane size={16} color={Colors.primary_color} />
        <Text style={[styles.airlineName, { color: theme.title }]}>
          Emirates
        </Text>
        <Dot size={20} color={Colors.tertiary_color} />
        <Text style={[styles.flightNumber, { color: theme.text }]}>EK 203</Text>
      </View>

      {/* Route Information */}
      <View style={styles.routeContainer}>
        <View style={styles.airportSection}>
          <Text style={[styles.airportCode, { color: theme.title }]}>DXB</Text>
          <Text style={[styles.airportName, { color: theme.text }]}>
            Dubai International Airport
          </Text>
        </View>

        <View style={styles.arrowSection}>
          <ArrowRight size={24} color={Colors.primary_color} />
        </View>

        <View style={styles.airportSection}>
          <Text
            style={[
              styles.airportCode,
              { textAlign: "right", color: theme.title },
            ]}
          >
            JFK
          </Text>
          <Text
            style={[
              styles.airportName,
              { textAlign: "right", width: 107, color: theme.text },
            ]}
          >
            John F. Kennedy International Airport
          </Text>
        </View>
      </View>

      {/* Time and Date */}
      <View style={styles.timeRow}>
        <View style={styles.timeSection}>
          <Clock size={16} color={Colors.primary_color} />
          <Text style={[styles.timeText, { color: theme.title }]}>14:30</Text>
        </View>
        <View style={styles.dateSection}>
          <Text style={[styles.dateText, { color: theme.text }]}>Dec 25, 2024</Text>
        </View>
        <View style={styles.timeSection}>
          <Text style={[styles.timeText, { color: theme.title }]}>20:15</Text>
        </View>
      </View>

      {/* Weight and Price */}
      {status !== TRANSACTION_STATUS.CONFIRMED &&
      status !== TRANSACTION_STATUS.COMPLETED ? (
        <>
          <View style={styles.weightPriceRow}>
            <View style={styles.weightSection}>
              <Scale size={16} color={Colors.success_color} />
              <Text style={[styles.weightText, { color: theme.title }]}>15kg available</Text>
            </View>
            <View style={styles.priceSection}>
              <Text style={styles.priceText}>$12/kg</Text>
            </View>
          </View>
        </>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  sellerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 16,
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
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    color: Colors.secondary_color,
    fontSize: 16,
    fontWeight: "500",
  },
  sellerRating: {
    color: Colors.tertiary_color,
    fontSize: 14,
    fontWeight: "400",
  },
  flightDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 20,
  },
  airlineName: {
    fontSize: 16,
    fontWeight: "500",
  },
  flightNumber: {
    fontSize: 16,
    fontWeight: "400",
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  airportSection: {
    flex: 1,
    justifyContent: "space-between",
  },
  arrowSection: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  airportCode: {
    fontSize: 16,
    fontWeight: "500",
  },
  airportCodeRight: {
    textAlign: "right",
  },
  airportName: {
    fontSize: 14,
    fontWeight: "400",
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
    fontSize: 14,
    fontWeight: "500",
  },
  dateText: {
    fontSize: 14,
    fontWeight: "400",
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
    fontSize: 14,
    fontWeight: "500",
  },
  priceSection: {
    flex: 1,
    alignItems: "flex-end",
  },
  priceText: {
    color: Colors.primary_color,
    fontSize: 16,
    fontWeight: "500",
  },
});

export default SellerInformationCard;
