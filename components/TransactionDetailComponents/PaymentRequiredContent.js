import { Alert } from "react-native";
import axios from "axios";
import { router } from "expo-router";
import { CreditCard } from "lucide-react-native";
import TransactionProgressCard from "@/components/TransactionProgressCard";
import SellerInformationCard from "@/components/TransactionDetailComponents/SellerInformationCard";
import StatusCard from "@/components/StatusCard";
import Button from "@/components/Button";
import CancelTransaction from "./CancelTransaction";
import Colors from "@/theme/Colors";
import { TRANSACTION_STATUS } from "@/constants/transaction-status";
import i18n from "@/i18n";

export default function PaymentRequiredContent({ transaction, role, status }) {
  const handleCompletePayment = () => {
    Alert.alert(
      i18n.t("confirm_payment_title"),
      i18n.t("confirm_payment_message"),
      [
        {
          text: i18n.t("cancel"),
          style: "cancel",
        },
        {
          text: i18n.t("confirm"),
          onPress: () => completePayment(),
        },
      ]
    );
  };

  const completePayment = async () => {
    try {
      const payload = {
        ...transaction,
        sellerStatus: TRANSACTION_STATUS.CONFIRMED,
        buyerStatus: TRANSACTION_STATUS.CONFIRMED,
      };

      const response = await axios.put(
        `${process.env.EXPO_PUBLIC_API_URL}/transactions/${transaction.id}`,
        payload
      );
      Alert.alert(
        i18n.t("payment_completed_title"),
        i18n.t("payment_completed_message")
      );
      router.replace(`/transaction-detail?transactionId=${response.data.id}`);
    } catch (error) {
      console.error("Error updating transaction:", error);
      Alert.alert(i18n.t("error"), i18n.t("payment_completed_error_message"));
    }
  };
  return (
    <>
      <TransactionProgressCard step={2} role={role} />
      <SellerInformationCard item={transaction} />
      <StatusCard status={status} transaction={transaction} />
      <Button
        text={i18n.t("complete_payment")}
        color={Colors.primary_color}
        leftIcon={<CreditCard size={24} color={Colors.white} />}
        onPress={handleCompletePayment}
      />
      <CancelTransaction transaction={transaction} />
    </>
  );
}
