import React from "react";
import { Alert } from "react-native";
import { useMutation } from "@apollo/client/react";
import {
  UPDATE_TRANSACTION,
  toTransactionUpdateInput,
} from "@/lib/graphql/transactions";
import { withEndpoint } from "@/lib/apolloClient";
import { router } from "expo-router";
import { CheckCircle, XCircle } from "lucide-react-native";
import TransactionProgressCard from "@/components/TransactionProgressCard";
import SellerInformationCard from "./SellerInformationCard";
import StatusCard from "@/components/StatusCard";
import Button from "@/components/Button";
import Colors from "@/theme/Colors";
import { TRANSACTION_STATUS } from "@/constants/transaction-status";
import i18n from "@/i18n";

export default function ReservationReceivedContent({
  transaction,
  role,
  status,
}) {
  const [updateTransaction] = useMutation(UPDATE_TRANSACTION, {
    context: withEndpoint("transactions"),
  });

  const handleAcceptRequest = () => {
    Alert.alert(
      i18n.t("confirm_accept_request_title"),
      i18n.t("confirm_accept_request_message"),
      [
        {
          text: i18n.t("cancel"),
          style: "cancel",
        },
        {
          text: i18n.t("confirm"),
          onPress: () => acceptRequest(),
        },
      ]
    );
  };
  // Accepter est le point d'engagement : c'est le serveur qui retire le poids de
  // l'annonce (effet RESERVE_CAPACITY), le client ne la touche plus.
  const acceptRequest = async () => {
    try {
      const { data: transactionRes } = await updateTransaction({
        variables: {
          id: transaction.id,
          input: toTransactionUpdateInput({
            sellerStatus: TRANSACTION_STATUS.AWAITING_PAYMENT,
            buyerStatus: TRANSACTION_STATUS.PAYMENT_REQUIRED,
          }),
        },
      });

      Alert.alert(
        i18n.t("request_accepted_title"),
        i18n.t("request_accepted_message")
      );

      router.replace(
        `/transaction-detail?transactionId=${transactionRes.updateTransaction.id}`
      );
    } catch (error) {
      console.error("Error updating transaction:", error);
      Alert.alert(i18n.t("error"), i18n.t("request_accepted_error_message"));
    }
  };
  const handleDeclineRequest = () => {
    Alert.alert(
      i18n.t("confirm_decline_request_title"),
      i18n.t("confirm_decline_request_message"),
      [
        {
          text: i18n.t("cancel"),
          style: "cancel",
        },
        {
          text: i18n.t("confirm"),
          onPress: () => declineRequest(),
        },
      ]
    );
  };
  const declineRequest = async () => {
    try {
      const { data } = await updateTransaction({
        variables: {
          id: transaction.id,
          input: toTransactionUpdateInput({
            sellerStatus: TRANSACTION_STATUS.WAITING_FOR_RESPONSE_SELLER,
            buyerStatus: TRANSACTION_STATUS.REQUEST_REJECTED,
          }),
        },
      });
      Alert.alert(
        i18n.t("request_declined_title"),
        i18n.t("request_declined_message")
      );
      router.replace(
        `/transaction-detail?transactionId=${data.updateTransaction.id}`
      );
    } catch (error) {
      console.error("Error updating transaction:", error);
      Alert.alert(i18n.t("error"), i18n.t("request_declined_error_message"));
    }
  };
  return (
    <>
      <TransactionProgressCard step={0} role={role} />
      <SellerInformationCard item={transaction} />
      <StatusCard status={status} transaction={transaction} />
      <Button
        onPress={handleAcceptRequest}
        text={i18n.t("accept_request")}
        leftIcon={<CheckCircle size={24} color={Colors.white} />}
      />
      <Button
        onPress={handleDeclineRequest}
        text={i18n.t("decline_request")}
        leftIcon={<XCircle size={24} color={Colors.white} />}
        color={Colors.error_color}
      />
    </>
  );
}
