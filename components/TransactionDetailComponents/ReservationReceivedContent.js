import React from "react";
import { Alert } from "react-native";
import axios from "axios";
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
  const listing = transaction.listingInfo;
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
  const acceptRequest = async () => {
    const payload = {
      ...transaction,
      sellerStatus: TRANSACTION_STATUS.AWAITING_PAYMENT,
      buyerStatus: TRANSACTION_STATUS.PAYMENT_REQUIRED,
    };

    try {
      const updateTransactionReq = axios.put(
        `${process.env.EXPO_PUBLIC_API_URL}/transactions/${transaction.id}`,
        payload
      );

      const updateListingReq = updateListing();

      const [transactionRes] = await Promise.all([
        updateTransactionReq,
        updateListingReq,
      ]);

      Alert.alert(
        i18n.t("request_accepted_title"),
        i18n.t("request_accepted_message")
      );

      router.replace(
        `/transaction-detail?transactionId=${transactionRes.data.id}`
      );
    } catch (error) {
      console.error("Error during parallel update:", error);
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
      const payload = {
        ...transaction,
        sellerStatus: TRANSACTION_STATUS.WAITING_FOR_RESPONSE_SELLER,
        buyerStatus: TRANSACTION_STATUS.REQUEST_REJECTED,
      };

      const response = await axios.put(
        `${process.env.EXPO_PUBLIC_API_URL}/transactions/${transaction.id}`,
        payload
      );
      Alert.alert(
        i18n.t("request_declined_title"),
        i18n.t("request_declined_message")
      );
      router.replace(`/transaction-detail?transactionId=${response.data.id}`);
    } catch (error) {
      console.error("Error updating transaction:", error);
      Alert.alert(i18n.t("error"), i18n.t("request_declined_error_message"));
    }
  };
  const updateListing = async () => {
    try {
      const payload = {
        ...listing,
        remainingWeight: listing?.remainingWeight - transaction?.weight,
      };
      return await axios.put(
        `${process.env.EXPO_PUBLIC_API_URL}/trips/${transaction?.listingId}`,
        payload
      );
    } catch (error) {
      console.error("Error updating listing:", error);
      throw error;
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
