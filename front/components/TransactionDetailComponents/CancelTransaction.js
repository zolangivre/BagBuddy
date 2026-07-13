import { Alert } from "react-native";
import axios from "axios";
import { router } from "expo-router";
import { X } from "lucide-react-native";
import Button from "@/components/Button";
import Colors from "@/theme/Colors";
import { TRANSACTION_STATUS } from "@/constants/transaction-status";
import i18n from "@/i18n";

export default function CancelTransaction({ transaction }) {
  const listing = transaction.listingInfo;
  const handleCancelTransaction = () => {
    Alert.alert(
      i18n.t("confirm_cancel_transaction_title"),
      i18n.t("confirm_cancel_transaction_message"),
      [
        {
          text: i18n.t("cancel"),
          style: "cancel",
        },
        {
          text: i18n.t("confirm"),
          onPress: () => cancelTransaction(),
        },
      ]
    );
  };

  const cancelTransaction = async () => {
    const payload = {
      ...transaction,
      sellerStatus: TRANSACTION_STATUS.CANCELLED,
      buyerStatus: TRANSACTION_STATUS.CANCELLED,
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
        i18n.t("cancel_transaction_title"),
        i18n.t("cancel_transaction_message")
      );
      router.replace(
        `/transaction-detail?transactionId=${transactionRes.data.id}`
      );
    } catch (error) {
      console.error("Error updating transaction:", error);
      Alert.alert(i18n.t("error"), i18n.t("cancel_transaction_error_message"));
    }
  };
  const updateListing = async () => {
    try {
      const payload = {
        ...listing,
        remainingWeight: listing?.remainingWeight,
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
      <Button
        text={i18n.t("cancel_transaction")}
        rightIcon={<X size={24} color={Colors.white} />}
        color={Colors.error_color}
        onPress={handleCancelTransaction}
      />
    </>
  );
}
