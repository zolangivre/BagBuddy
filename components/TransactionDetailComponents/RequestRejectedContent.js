import React, { useState } from "react";
import { Alert, Text } from "react-native";
import axios from "axios";
import { router } from "expo-router";
import { Send } from "lucide-react-native";
import TransactionProgressCard from "@/components/TransactionProgressCard";
import SellerInformationCard from "./SellerInformationCard";
import StatusCard from "@/components/StatusCard";
import WeightSelectorCard from "@/components/WeightSelectorCard";
import Button from "@/components/Button";
import Colors from "@/theme/Colors";
import { TRANSACTION_STATUS } from "@/constants/transaction-status";
import i18n from "@/i18n";
import { useThemeContext } from "@/contexts/ThemeContext";

export default function RequestRejectedContent({ transaction, role, status }) {
  const [selectedWeight, setSelectedWeight] = useState(1);
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;

  const listing = transaction.listingInfo;
  const handleNewRequest = () => {
    Alert.alert(
      i18n.t("confirm_new_request_title"),
      i18n.t("confirm_new_request_message"),
      [
        {
          text: i18n.t("cancel"),
          style: "cancel",
        },
        {
          text: i18n.t("confirm"),
          onPress: () => newRequest(),
        },
      ]
    );
  };

  const newRequest = async () => {
    try {
      const payload = {
        ...transaction,
        sellerStatus: TRANSACTION_STATUS.RESERVATION_RECEIVED,
        buyerStatus: TRANSACTION_STATUS.WAITING_FOR_RESPONSE_BUYER,
        weight: selectedWeight,
        total: selectedWeight * listing.pricePerKg,
      };

      const response = await axios.put(
        `${process.env.EXPO_PUBLIC_API_URL}/transactions/${transaction.id}`,
        payload
      );
      Alert.alert(
        i18n.t("reservation_request_sent_title"),
        i18n.t("reservation_request_sent_message")
      );
      router.replace(`/transaction-detail?transactionId=${response.data.id}`);
    } catch (error) {
      console.error("Error updating transaction:", error);
      Alert.alert(i18n.t("error"), i18n.t("reservation_request_error_message"));
    }
  };
  let sellerName = transaction?.listingInfo?.sellerUserInfo?.name;
  return (
    <>
      <TransactionProgressCard step={1} role={role} />
      <SellerInformationCard item={transaction} />
      <StatusCard status={status} transaction={transaction} />
      <Text style={[theme.textStyles.titleMedium, { textAlign: "center" }]}>
        {i18n.t("try_a_different_amount")}
      </Text>
      <Text style={[theme.textStyles.bodyLarge, { textAlign: "center" }]}>
        {i18n.t("try_a_different_amount_description", {
          seller: sellerName,
        })}
      </Text>
      <WeightSelectorCard
        item={listing}
        onWeightChange={(value) => {
          setSelectedWeight(value);
        }}
      />
      <Button
        onPress={handleNewRequest}
        text={i18n.t("send_new_request")}
        rightIcon={<Send size={24} color={Colors.white} />}
      />
    </>
  );
}
