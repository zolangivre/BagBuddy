import React, { useState } from "react";
import { Alert, Text } from "react-native";
import { useMutation } from "@apollo/client/react";
import { UPDATE_TRANSACTION } from "@/lib/graphql/transactions";
import { withEndpoint } from "@/lib/apolloClient";
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
  const [updateTransaction] = useMutation(UPDATE_TRANSACTION, {
    context: withEndpoint("transactions"),
  });
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
      // Le total n'est plus calculé ici : le serveur retarife la demande contre
      // l'annonce au moment de la transition.
      const { data } = await updateTransaction({
        variables: {
          id: transaction.id,
          input: {
            sellerStatus: TRANSACTION_STATUS.RESERVATION_RECEIVED,
            buyerStatus: TRANSACTION_STATUS.WAITING_FOR_RESPONSE_BUYER,
            weight: selectedWeight,
          },
        },
      });
      Alert.alert(
        i18n.t("reservation_request_sent_title"),
        i18n.t("reservation_request_sent_message")
      );
      router.replace(
        `/transaction-detail?transactionId=${data.updateTransaction.id}`
      );
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
