import { Alert } from "react-native";
import { useApolloClient, useMutation } from "@apollo/client/react";
import {
  UPDATE_TRANSACTION,
  TRANSACTION_PAID_AT,
  toTransactionUpdateInput,
} from "@/lib/graphql/transactions";
import { withEndpoint } from "@/lib/apolloClient";
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
import StripeBottomSheet from "@/components/StripeBottomSheet";
import { useState } from "react";

/** Combien de temps on laisse au webhook Stripe pour arriver. */
const PAID_AT_POLL_INTERVAL_MS = 2000;
const PAID_AT_POLL_ATTEMPTS = 15;

export default function PaymentRequiredContent({ transaction, role, status }) {
  const [showStripeModal, setShowStripeModal] = useState(false);
  const client = useApolloClient();
  const [updateTransaction] = useMutation(UPDATE_TRANSACTION, {
    context: withEndpoint("transactions"),
  });

  const handleCompletePayment = () => {
    setShowStripeModal(true);
  };

  /**
   * Le paiement n'est plus enregistré par le client : le webhook Stripe signé
   * pose paidAt et le montant, et le passage en « confirmé » est refusé tant
   * qu'il n'est pas arrivé. On l'attend donc avant de demander la transition.
   */
  const waitForPayment = async () => {
    for (let attempt = 0; attempt < PAID_AT_POLL_ATTEMPTS; attempt++) {
      try {
        const { data } = await client.query({
          query: TRANSACTION_PAID_AT,
          variables: { id: transaction.id },
          context: withEndpoint("transactions"),
          fetchPolicy: "network-only",
        });
        if (data?.transaction?.paidAt) return true;
      } catch (error) {
        // Une lecture ratée ne doit pas interrompre l'attente : l'argent est
        // déjà parti chez Stripe, seul le webhook reste à arriver.
        console.warn("Waiting for payment confirmation:", error);
      }
      await new Promise((resolve) =>
        setTimeout(resolve, PAID_AT_POLL_INTERVAL_MS)
      );
    }
    return false;
  };

  const handlePaymentSuccess = async () => {
    try {
      const settled = await waitForPayment();
      if (!settled) {
        // Le paiement est passé chez Stripe : l'écran rechargé montrera la
        // transaction confirmée dès que le webhook aura été traité.
        Alert.alert(
          i18n.t("payment_completed_title"),
          i18n.t("payment_completed_message")
        );
        router.replace(
          `/transaction-detail?transactionId=${transaction.id}`
        );
        return;
      }

      const { data } = await updateTransaction({
        variables: {
          id: transaction.id,
          input: toTransactionUpdateInput({
            sellerStatus: TRANSACTION_STATUS.CONFIRMED,
            buyerStatus: TRANSACTION_STATUS.CONFIRMED,
          }),
        },
      });

      Alert.alert(
        i18n.t("payment_completed_title"),
        i18n.t("payment_completed_message")
      );

      router.replace(
        `/transaction-detail?transactionId=${data.updateTransaction.id}`
      );
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
      <StripeBottomSheet
        visible={showStripeModal}
        onClose={() => setShowStripeModal(false)}
        amountUSD={transaction.total}
        transactionId={transaction.id}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
}
