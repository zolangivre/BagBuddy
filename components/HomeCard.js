import { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Weight, ArrowRight } from "lucide-react-native";
import Colors from "@/theme/Colors";
import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import FlightInfoCard from "@/components/FlightInfoCard";
import RoundIconText from "@/components/RoundIconText";
import { useThemeContext } from "@/contexts/ThemeContext";
import i18n from "@/i18n";
import { router } from "expo-router";
import { globalStyles } from "@/theme/Styles";
import Currency from "@/components/Currency";
import { useCurrency } from "@/contexts/CurrencyContext";
import { AuthContext } from "@/contexts/AuthContext";
import { formatLocalizedDate } from "@/components/LocalizedDateTime";
import { useLanguage } from "@/contexts/LanguageContext";

const HomeCard = ({ item }) => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const { language } = useLanguage();
  const { currency } = useCurrency();
  const handleUserPress = () => {
    router.push({
      pathname: "profile-view",
      params: { userInfo: JSON.stringify(item.userInfo) },
    });
  };
  const total = (item.remainingWeight * item.pricePerKg).toFixed(2);
  const { state } = useContext(AuthContext);
  const userInfo = state.userInfo;

  const initials = item.userInfo.given_name
    ? item.userInfo.given_name.charAt(0).toUpperCase() +
      item.userInfo.family_name.charAt(0).toUpperCase()
    : "NN";

  const role = item.userInfo.sub === userInfo.sub ? "seller" : "buyer";

  return (
    <View
      key={item.id}
      style={[
        globalStyles.card,
        { backgroundColor: theme.background_card, gap: 20 },
      ]}
    >
      {/* User Header */}
      <View style={styles.listingUserHeader}>
        <TouchableOpacity onPress={handleUserPress}>
          <View style={styles.listingUserInfo}>
            <Avatar initials={initials} />
            <View style={{ flex: 1 }}>
              <Text style={theme.textStyles.sectionTitle}>
                {item.userInfo.name}
              </Text>
              <Text style={theme.textStyles.bodyMedium}>
                {i18n.t("listed_on")}:{" "}
                {formatLocalizedDate(item?.createdAt, language)}
              </Text>
            </View>
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
            <Text style={theme.textStyles.titleMedium}>
              {item.remainingWeight} kg
            </Text>
          </View>
        </View>
        <View style={styles.priceInfo}>
          <Text style={theme.textStyles.bodyLarge}>
            {i18n.t("price_per_kg")}
          </Text>
          <Currency
            amount={item.pricePerKg}
            style={theme.textStyles.number}
            currency={currency}
          />
        </View>
      </View>

      {/* Total and Reserve Button */}
      <View style={styles.totalContainer}>
        <View style={styles.totalRow}>
          <Text style={theme.textStyles.bodyLarge}>
            {i18n.t("total_for")} {item.remainingWeight} kg
          </Text>
          <Currency amount={total} style={theme.textStyles.number} />
        </View>
      </View>
      {role === "buyer" && (
        <Button
          href={{
            pathname: "transaction-detail",
            params: { listingId: item.id },
          }}
          text={i18n.t("reserve_weight")}
          rightIcon={<ArrowRight size={24} color={Colors.white} />}
        />
      )}
      {role === "seller" && (
        <Button
          href={{
            pathname: "transaction-detail",
            params: { listingId: item.id },
          }}
          text={i18n.t("view_your_listing")}
          rightIcon={<ArrowRight size={24} color={Colors.white} />}
        />
      )}
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
