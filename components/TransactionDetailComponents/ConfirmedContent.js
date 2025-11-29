import { Alert } from "react-native";
import axios from "axios";
import { router } from "expo-router";
import TransactionProgressCard from "@/components/TransactionProgressCard";
import SellerInformationCard from "./SellerInformationCard";
import StatusCard from "@/components/StatusCard";
import MeetingDetailsCard from "./MeetingDetailsCard";
import Button from "@/components/Button";
import Colors from "@/theme/Colors";
import { TRANSACTION_STATUS } from "@/constants/transaction-status";
import i18n from "@/i18n";

export default function ConfirmedContent({ transaction, role, status }) {
  const handleConfirmed = () => {
    Alert.alert(
      i18n.t("confirm_mark_as_completed_title"),
      i18n.t("confirm_mark_as_completed_message"),
      [
        {
          text: i18n.t("cancel"),
          style: "cancel",
        },
        {
          text: i18n.t("confirm"),
          onPress: () => confirmedTransaction(),
        },
      ]
    );
  };
  const confirmedTransaction = async () => {
    try {
      const payload = {
        ...transaction,
        sellerStatus: TRANSACTION_STATUS.COMPLETED,
        buyerStatus: TRANSACTION_STATUS.COMPLETED,
      };

      const response = await axios.put(
        `${process.env.EXPO_PUBLIC_API_URL}/transactions/${transaction.id}`,
        payload
      );
      Alert.alert(
        i18n.t("confirmed_completed_title"),
        i18n.t("confirmed_completed_message")
      );
      router.replace(`/transaction-detail?transactionId=${response.data.id}`);
    } catch (error) {
      console.error("Error updating transaction:", error);
      Alert.alert(i18n.t("error"), i18n.t("confirmed_completed_error_message"));
    }
  };
  return (
    <>
      {role === "buyer" ? (
        <TransactionProgressCard step={3} role={role} />
      ) : (
        <TransactionProgressCard step={2} role={role} />
      )}
      <SellerInformationCard item={transaction} />
      <StatusCard status={status} role={role} transaction={transaction} />
      {/* <MeetingDetailsCard /> */}
      {role === "buyer" && (
        <Button
          onPress={handleConfirmed}
          text={i18n.t("mark_as_completed")}
          color={Colors.success_color}
        />
      )}
    </>
  );
}
