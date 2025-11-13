import Colors from "../theme/Colors";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ArrowRight, Weight } from "lucide-react-native";
import Avatar from "./Avatar";
import StatusBadge from "./StatusBadge";
import FlightInfoCard from "./FlightInfoCard";
import Label from "./Label";
import {
  USER_TRANSACTION_TYPE,
} from "@/constants/allConstants";
import { useRouter } from "expo-router";
import { useThemeContext } from "../contexts/ThemeContext";
import i18n from "@/i18n";

const TransactionCard = ({ transaction }) => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;

  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push(`/transactions/${transaction.id}`)}
    >
      <View
        style={[
          transactionCardStyles.container,
          { backgroundColor: theme.background_card },
        ]}
      >
        {/* User Info Row */}
        <View style={transactionCardStyles.userColumn}>
          <View style={transactionCardStyles.userInfo}>
            <Avatar style={{ flex: 1 }} initials={transaction.userInitials} />
            <Text
              style={[
                transactionCardStyles.userName,
                { flex: 1, color: theme.title },
              ]}
            >
              {transaction.userName}
            </Text>
            <ArrowRight size={16} color={Colors.tertiary_color} />
          </View>
          <View style={transactionCardStyles.statusContainer}>
            <Label
              text={i18n.t(transaction.type)}
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
            <StatusBadge status={transaction.status} />
          </View>
        </View>

        <FlightInfoCard item={transaction} />

        {/* Weight and Price Info */}
        <View style={transactionCardStyles.priceRow}>
          <View style={transactionCardStyles.weightContainer}>
            <Weight size={20} color={Colors.primary_color} />
            <Text
              style={[transactionCardStyles.weightText, { color: theme.text }]}
            >
              {transaction.weight}
            </Text>
          </View>
          <View style={transactionCardStyles.rateContainer}>
            <Text
              style={[transactionCardStyles.rateLabel, { color: theme.text }]}
            >
              {i18n.t("rate")}
            </Text>
            <Text
              style={[transactionCardStyles.rateValue, { color: theme.title }]}
            >
              {transaction.rate}
            </Text>
          </View>
          <View style={transactionCardStyles.totalContainer}>
            <Text
              style={[transactionCardStyles.totalLabel, { color: theme.text }]}
            >
              {i18n.t("total")}
            </Text>
            <Text style={transactionCardStyles.totalValue}>
              {transaction.total}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const transactionCardStyles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    gap: 20,
  },
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
  userName: {
    color: Colors.secondary_color,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
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
  weightText: {
    fontSize: 14,
    fontWeight: "400",
  },
  rateContainer: {
    alignItems: "center",
    flex: 1,
  },
  rateLabel: {
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 4,
  },
  rateValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  totalContainer: {
    alignItems: "flex-end",
    flex: 1,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 4,
  },
  totalValue: {
    color: Colors.primary_color,
    fontSize: 20,
    fontWeight: "700",
  },
});

export default TransactionCard;
