import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Weight, ArrowRight } from "lucide-react-native";
import Colors from "../theme/Colors";
import Avatar from "./Avatar";
import Button from "./Button";
import FlightInfoCard from "./FlightInfoCard";
import RoundIconText from "./RoundIconText";
import { useThemeContext } from "../contexts/ThemeContext";
import i18n from "@/i18n";
import { router } from "expo-router";
import { globalStyles } from "@/theme/Styles";

const HomeCard = ({ item }) => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const handleUserPress = () => {
    router.push({
      pathname: "profile-view",
    });
  }

  return (
    <View
      key={item.id}
      style={[globalStyles.card, { backgroundColor: theme.background_card, gap: 20 }]}
    >
      {/* User Header */}
      <View style={styles.listingUserHeader}>
        <TouchableOpacity onPress={handleUserPress}>
          <View style={styles.listingUserInfo}>
            <Avatar initials={item.initials} />
            <Text style={theme.textStyles.sectionTitle}>{item.sellerName}</Text>
          </View>
        </TouchableOpacity>
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
            <Text style={theme.textStyles.bodyLarge}>
              {i18n.t("available_weight")}
            </Text>
            <Text style={theme.textStyles.titleMedium}>{item.weight} kg</Text>
          </View>
        </View>
        <View style={styles.priceInfo}>
          <Text style={theme.textStyles.bodyLarge}>
            {i18n.t("price_per_kg")}
          </Text>
          <Text style={theme.textStyles.number}>${item.pricePerKg}</Text>
        </View>
      </View>

      {/* Total and Reserve Button */}
      <View style={styles.totalContainer}>
        <View style={styles.totalRow}>
          <Text style={theme.textStyles.bodyLarge}>
            {i18n.t("total_for")} {item.weight} kg
          </Text>
          <Text style={theme.textStyles.number}>${item.total}</Text>
        </View>
      </View>

      <Button
        href={{
          pathname: "transaction-detail",
          params: { listingId: item.id },
        }}
        text={i18n.t("reserve_weight")}
        rightIcon={<ArrowRight size={24} color="#FFFFFF" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listingUserHeader: {
    marginBottom: 10,
  },
  listingUserInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
  priceInfo: {
    alignItems: "flex-end",
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
});

export default HomeCard;
