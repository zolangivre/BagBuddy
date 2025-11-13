import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Weight, ArrowRight } from "lucide-react-native";
import Colors from "../theme/Colors";
import Avatar from "./Avatar";
import Button from "./Button";
import FlightInfoCard from "./FlightInfoCard";
import RoundIconText from "./RoundIconText";
import { useThemeContext } from "../contexts/ThemeContext";
import i18n from "@/i18n";

const HomeCard = ({ item }) => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <View
      key={item.id}
      style={[styles.listingCard, { backgroundColor: theme.background_card }]}
    >
      {/* User Header */}
      <View style={styles.listingUserHeader}>
        <View style={styles.listingUserInfo}>
          <Avatar initials={item.initials} />
          <View style={styles.userNameContainer}>
            <Text style={[styles.userName, { color: theme.title }]}>
              {item.name}
            </Text>
          </View>
        </View>
      </View>

      {/* Flight Info */}
      <FlightInfoCard item={item} />

      {/* Weight and Price Info */}
      <View style={styles.weightPriceContainer}>
        <View style={styles.weightInfo}>
          <RoundIconText
            icon={<Weight size={20} color={Colors.primary_color} />}
            backgroundColor={Colors.dark_cyan_translucent}
            size={32}
          />
          <View>
            <Text style={[styles.weightLabel, { color: theme.text }]}>
              {i18n.t("available_weight")}
            </Text>
            <Text style={[styles.weightValue, { color: theme.title }]}>
              {item.weight} kg
            </Text>
          </View>
        </View>
        <View style={styles.priceInfo}>
          <Text style={[styles.priceLabel, { color: theme.text }]}>
            {i18n.t("price_per_kg")}
          </Text>
          <Text style={styles.priceValue}>${item.pricePerKg}</Text>
        </View>
      </View>

      {/* Total and Reserve Button */}
      <View style={styles.totalContainer}>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: theme.text }]}>
            {i18n.t("total_for")} {item.weight}
          </Text>
          <Text style={styles.totalValue}>${item.total}</Text>
        </View>
      </View>

      <Button
        href={{
          pathname: "transaction-detail",
          params: { status: "payment_required" },
        }}
        text={i18n.t("reserve_weight")}
        rightIcon={<ArrowRight size={24} color="#FFFFFF" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listingCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    gap: 10,
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
    fontSize: 16,
    fontWeight: "600",
  },
  timeText: {
    color: Colors.tertiary_color,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
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
  weightLabel: {
    fontSize: 14,
    fontWeight: "400",
  },
  weightValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  priceInfo: {
    alignItems: "flex-end",
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: "400",
  },
  priceValue: {
    color: Colors.primary_color,
    fontSize: 20,
    fontWeight: "700",
  },
  totalContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "rgba(14, 165, 233, 0.05)",
    borderRadius: 16,
    borderColor: "rgba(14, 165, 233, 0.10)",
    marginBottom: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "400",
  },
  totalValue: {
    color: Colors.primary_color,
    fontSize: 20,
    fontWeight: "700",
  },
});

export default HomeCard;
