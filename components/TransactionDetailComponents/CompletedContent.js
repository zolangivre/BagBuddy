import React, { useState } from "react";
import { Alert, View } from "react-native";
import { useMutation } from "@apollo/client/react";
import { CREATE_REVIEW } from "@/lib/graphql/reviews";
import {
  UPDATE_TRANSACTION,
  toTransactionUpdateInput,
} from "@/lib/graphql/transactions";
import { withEndpoint } from "@/lib/apolloClient";
import { router } from "expo-router";
import { Star } from "lucide-react-native";
import TransactionProgressCard from "@/components/TransactionProgressCard";
import SellerInformationCard from "./SellerInformationCard";
import StatusCard from "@/components/StatusCard";
import ReviewCard from "@/components/ReviewCard";
import ReviewModal from "@/components/ReviewModal";
import Colors from "@/theme/Colors";
import { globalStyles } from "@/theme/Styles";
import i18n from "@/i18n";
import { useThemeContext } from "@/contexts/ThemeContext";
import Button from "@/components/Button";

export default function CompletedContent({
  transaction,
  role,
  reviews,
  userInfo,
  status,
}) {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [createReview] = useMutation(CREATE_REVIEW, {
    context: withEndpoint("reviews"),
  });
  const [updateTransaction] = useMutation(UPDATE_TRANSACTION, {
    context: withEndpoint("transactions"),
  });

  const handleOnSubmit = async ({ rating, comment }) => {
    try {
      // L'auteur et la personne notée ne sont plus envoyés : le serveur prend
      // l'auteur dans le jeton et en déduit l'autre partie de la transaction.
      // C'est ce qui empêche de noter quelqu'un au hasard.
      await createReview({
        variables: {
          input: { transactionId: transaction?.id, rating, comment },
        },
      });
      await updateTransaction({
        variables: {
          id: transaction.id,
          input: toTransactionUpdateInput({
            sellerReview: role === "seller" ? true : transaction.sellerReview,
            buyerReview: role === "buyer" ? true : transaction.buyerReview,
          }),
        },
      });
      router.replace(`/transaction-detail?transactionId=${transaction.id}`);
      Alert.alert(
        i18n.t("review_submitted_title"),
        i18n.t("review_submitted_message")
      );
    } catch (error) {
      console.error("Error submitting review:", error);
      Alert.alert(i18n.t("error"), i18n.t("review_submitted_error_message"));
    }
  };
  return (
    <>
      {role === "buyer" ? (
        <TransactionProgressCard step={4} role={role} />
      ) : (
        <TransactionProgressCard step={3} role={role} />
      )}
      <SellerInformationCard item={transaction} />
      <StatusCard status={status} role={role} transaction={transaction} />
      {reviews.map((review) => (
        <View
          style={[
            globalStyles.card,
            { backgroundColor: theme.background_card },
          ]}
          key={review.id}
        >
          <ReviewCard review={review} editMode={userInfo?.sub === review?.reviewerId} />
        </View>
      ))}
      {((role === "buyer" && !transaction.buyerReview) ||
        (role === "seller" && !transaction.sellerReview)) && (
        <Button
          text={i18n.t("put_in_review")}
          color={Colors.light_yellow}
          leftIcon={<Star size={24} color={Colors.white} />}
          onPress={() => setReviewModalVisible(true)}
        />
      )}
      <ReviewModal
        visible={reviewModalVisible}
        onClose={() => setReviewModalVisible(false)}
        onSubmit={handleOnSubmit}
      />
    </>
  );
}
