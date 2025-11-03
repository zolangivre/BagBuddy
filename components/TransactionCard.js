import Colors from "../theme/Colors";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ArrowRight, Weight } from "lucide-react-native";
import Avatar from "./Avatar";
import StatusBadge from "./StatusBadge";
import FlightInfoCard from "./FlightInfoCard";
import Label from "./Label";
import { USER_TRANSACTION_TYPE } from "@/constants/allConstants";
import { useRouter } from "expo-router";
import { useThemeContext } from "@/contexts/ThemeContext";
import i18n from "@/i18n";
import { globalStyles} from "@/theme/Styles";

const TransactionCard = ({ transaction }) => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const router = useRouter();
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
            <Avatar style={{ flex: 1 }} initials={transaction.initials} />
            <Text style={{ ...theme.textStyles.sectionTitle, flex: 1 }}>
              {transaction.sellerName}
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
            <Text style={theme.textStyles.bodyLarge}>
              {transaction.weight} kg
            </Text>
          </View>
          <View style={transactionCardStyles.rateContainer}>
            <Text style={theme.textStyles.bodyLarge}>{i18n.t("rate")}</Text>
            <Text style={theme.textStyles.statValue}>
              ${transaction.pricePerKg}/kg
            </Text>
          </View>
          <View style={transactionCardStyles.totalContainer}>
            <Text style={theme.textStyles.bodyLarge}>{i18n.t("total")}</Text>
            <Text style={theme.textStyles.number}>{transaction.total} $</Text>
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
