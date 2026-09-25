import { Alert } from "react-native";
import { useMutation } from "@apollo/client/react";
import { UPDATE_TRANSACTION } from "@/lib/graphql/transactions";
import { withEndpoint } from "@/lib/apolloClient";
import { router } from "expo-router";
import { X } from "lucide-react-native";
import Button from "@/components/Button";
import Colors from "@/theme/Colors";
import { TRANSACTION_STATUS } from "@/constants/transaction-status";
import i18n from "@/i18n";

export default function CancelTransaction({ transaction }) {
  const [updateTransaction, { loading: updating }] = useMutation(UPDATE_TRANSACTION, {
    context: withEndpoint("transactions"),
  });

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

  // L'annonce n'est plus retouchée ici : annuler une réservation qui tenait du
  // poids le rend à l'annonce côté serveur (effet RELEASE_CAPACITY de la
  // transition), et remainingWeight n'est de toute façon plus modifiable.
  const cancelTransaction = async () => {
    try {
      const { data } = await updateTransaction({
        variables: {
          id: transaction.id,
          input: {
            sellerStatus: TRANSACTION_STATUS.CANCELLED,
            buyerStatus: TRANSACTION_STATUS.CANCELLED,
          },
        },
      });

      Alert.alert(
        i18n.t("cancel_transaction_title"),
        i18n.t("cancel_transaction_message")
      );
      router.replace(
        `/transaction-detail?transactionId=${data.updateTransaction.id}`
      );
    } catch (error) {
      console.error("Error updating transaction:", error);
      Alert.alert(i18n.t("error"), i18n.t("cancel_transaction_error_message"));
    }
  };
  return (
    <>
      <Button
        text={i18n.t("cancel_transaction")}
        rightIcon={<X size={24} color={Colors.white} />}
        color={Colors.error_color}
        onPress={handleCancelTransaction}
        loading={updating}
      />
    </>
  );
}
