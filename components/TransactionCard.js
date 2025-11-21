import Colors from "@/theme/Colors";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ArrowRight, Weight } from "lucide-react-native";
import Avatar from "@/components/Avatar";
import StatusBadge from "@/components/StatusBadge";
import FlightInfoCard from "./FlightInfoCard";
import Label from "@/components/Label";
import { USER_TRANSACTION_TYPE } from "@/constants/allConstants";
import { router } from "expo-router";
import { useThemeContext } from "@/contexts/ThemeContext";
import i18n from "@/i18n";
import { globalStyles } from "@/theme/Styles";
import Currency from "@/components/Currency";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";
import { formatLocalizedDate } from "@/components/LocalizedDateTime";
import { useLanguage } from "@/contexts/LanguageContext";

const TransactionCard = ({ transaction }) => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const { language } = useLanguage();
  const { state } = useContext(AuthContext);
  const userInfo = state.userInfo;
  const role = transaction.sellerId === userInfo.sub ? "seller" : "buyer";
  const status =
    transaction.sellerStatus && transaction.buyerStatus
      ? role === "seller"
        ? transaction.sellerStatus
        : transaction.buyerStatus
      : transaction.status;
  let type;
  let name;
  if (transaction.sellerId === userInfo.sub) {
    type = USER_TRANSACTION_TYPE.SELLING;
    name = transaction?.buyerInfo?.name;
  } else {
    type = USER_TRANSACTION_TYPE.BUYING;
    name = transaction?.listingInfo?.userInfo?.name;
  }
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "??";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: "transaction-detail",
          params: { transactionId: transaction.id },
        })
      }
    >
      <View
        style={[
          globalStyles.card,
          { backgroundColor: theme.background_card, gap: 20 },
        ]}
      >
        {/* User Info Row */}
        <View style={transactionCardStyles.userColumn}>
          <View style={transactionCardStyles.userInfo}>
            <Avatar initials={initials} />
            <View style={{ flex: 1 }}>
              <Text style={theme.textStyles.sectionTitle}>{name}</Text>
              <Text style={theme.textStyles.bodyMedium}>
                {i18n.t("created_on")}:{" "}
                {formatLocalizedDate(transaction?.createdAt, language)}
              </Text>
            </View>
            <ArrowRight size={16} color={Colors.tertiary_color} />
          </View>
          <View style={transactionCardStyles.statusContainer}>
            <Label
              text={i18n.t(type)}
              backgroundColor={
                transaction.type === USER_TRANSACTION_TYPE.BUYING
                  ? Colors.dark_cyan_translucent
                  : Colors.light_green_translucent
              }
              colorText={
                transaction.type === USER_TRANSACTION_TYPE.BUYING
                  ? Colors.primary_color
                  : Colors.light_green
              }
            />
            <StatusBadge status={status} />
          </View>
        </View>

        <FlightInfoCard item={transaction.listingInfo} />

        {/* Weight and Price Info */}
        <View style={transactionCardStyles.priceRow}>
          <View style={transactionCardStyles.weightContainer}>
            <Weight size={20} color={Colors.primary_color} />
            <Text style={theme.textStyles.bodyLarge}>
              {transaction.weight} kg
            </Text>
          </View>
          <View style={transactionCardStyles.rateContainer}>
            <Text style={theme.textStyles.bodyLarge}>{i18n.t("rate")}/kg</Text>
            <Currency
              amount={transaction.listingInfo.pricePerKg}
              style={theme.textStyles.statValue}
            />
          </View>
          <View style={transactionCardStyles.totalContainer}>
            <Text style={theme.textStyles.bodyLarge}>{i18n.t("total")}</Text>
            <Currency
              amount={transaction.total}
              style={theme.textStyles.number}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const transactionCardStyles = StyleSheet.create({
  userColumn: {
    flexDirection: "colum",
    width: "100%",
    gap: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  weightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rateContainer: {
    alignItems: "center",
    flex: 1,
  },
  totalContainer: {
    alignItems: "flex-end",
    flex: 1,
  },
});

export default TransactionCard;
