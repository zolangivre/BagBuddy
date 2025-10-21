import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Weight, ArrowRight } from "lucide-react-native";
import Colors from "../theme/Colors";
import Avatar from "./Avatar";
import Button from "./Button";
import FlightInfoCard from "./FlightInfoCard";

const HomeCard = ({ item }) => {
  return (
    <View key={item.id} style={styles.listingCard}>
      {/* User Header */}
      <View style={styles.listingUserHeader}>
        <View style={styles.listingUserInfo}>
          <Avatar initials={item.initials} />
          <View style={styles.userNameContainer}>
            <Text style={styles.userName}>{item.name}</Text>
          </View>
        </View>
      </View>

      {/* Flight Info */}
      <FlightInfoCard item={item} />

      {/* Weight and Price Info */}
      <View style={styles.weightPriceContainer}>
        <View style={styles.weightInfo}>
          <View style={styles.weightIcon}>
            <Weight size={20} color={Colors.primary_color} />
          </View>
          <View>
            <Text style={styles.weightLabel}>Available Weight</Text>
            <Text style={styles.weightValue}>{item.weight}</Text>
          </View>
        </View>
        <View style={styles.priceInfo}>
          <Text style={styles.priceLabel}>Price per kg</Text>
          <Text style={styles.priceValue}>{item.pricePerKg}</Text>
        </View>
      </View>

      {/* Total and Reserve Button */}
      <View style={styles.totalContainer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total for {item.weight}</Text>
          <Text style={styles.totalValue}>{item.total}</Text>
        </View>
      </View>

      <Button
        href="transaction-detail"
        text="Reserve weight"
        rightIcon={<ArrowRight size={24} color="#FFFFFF" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listingCard: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  listingUserHeader: {
    marginBottom: 10,
  },
  listingUserInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  userNameContainer: {
    justifyContent: "center",
  },
  userName: {
    color: Colors.secondary_color,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
    letterSpacing: -0.312,
  },
  timeText: {
    color: Colors.tertiary_color,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: -0.15,
  },
  weightPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  weightInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  weightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(14, 165, 233, 0.10)",
    justifyContent: "center",
    alignItems: "center",
  },
  weightLabel: {
    color: Colors.tertiary_color,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: -0.15,
  },
  weightValue: {
    color: Colors.secondary_color,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
    letterSpacing: -0.312,
  },
  priceInfo: {
    alignItems: "flex-end",
  },
  priceLabel: {
    color: Colors.tertiary_color,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: -0.15,
  },
  priceValue: {
    color: Colors.primary_color,
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
    letterSpacing: 0.07,
  },
  totalContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "rgba(14, 165, 233, 0.05)",
    borderRadius: 16,
    borderWidth: 0.612,
    borderColor: "rgba(14, 165, 233, 0.10)",
    marginBottom: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    color: Colors.tertiary_color,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: -0.15,
  },
  totalValue: {
    color: Colors.primary_color,
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 28,
    letterSpacing: -0.449,
  },
});

export default HomeCard;
