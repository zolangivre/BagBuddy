import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import Colors from "@/theme/Colors";
import { useThemeContext } from "@/contexts/ThemeContext";
import { Pencil, Star } from "lucide-react-native";
import Avatar from "@/components/Avatar";
import { formatLocalizedDate } from "@/components/LocalizedDateTime";
import ButtonIcon from "@/components/ButtonIcon";
import ReviewModal from "./ReviewModal";
import { useMutation } from "@apollo/client/react";
import { UPDATE_REVIEW } from "@/lib/graphql/reviews";
import { withEndpoint } from "@/lib/apolloClient";
import i18n from "@/i18n";
import { router } from "expo-router";
import { useLanguage } from "@/contexts/LanguageContext";

const StarsReview = ({ theme, rating }) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <Star
        key={i}
        size={16}
        color={i < rating ? Colors.light_yellow : theme.title}
        fill={i < rating ? Colors.light_yellow : "none"}
      />
    );
  }
  return <View style={{ flexDirection: "row" }}>{stars}</View>;
};

const ReviewCard = ({ review, editMode }) => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] || Colors.light;
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [updateReview] = useMutation(UPDATE_REVIEW, {
    context: withEndpoint("reviews"),
  });
  const { language } = useLanguage();

  const handleOnSubmit = async ({ rating, comment }) => {
    try {
      // Seul le contenu est modifiable : qui est noté n'est jamais réécrit.
      await updateReview({
        variables: { id: review?.id, input: { rating, comment } },
      });
      router.replace(
        `/transaction-detail?transactionId=${review?.transactionId}`
      );
      Alert.alert(
        i18n.t("review_updated_title"),
        i18n.t("review_updated_message")
      );
    } catch (error) {
      console.error("Error submitting review:", error);
      Alert.alert(i18n.t("error"), i18n.t("review_updated_error_message"));
      return false;
    }
  };
  return (
    <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
      <Avatar initials={review.reviewerName.charAt(0)} size={40} />
      <View style={{ flexDirection: "column", gap: 5, flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1, flexDirection: "row", gap: 5, alignItems: "center", justifyContent: "space-between" }}>
            <Text style={theme.textStyles.sectionTitle}>
              {review.reviewerName}
            </Text>
            <Text style={theme.textStyles.bodySmall}>
              {formatLocalizedDate(review.createdAt, language)}
            </Text>
          </View>
        </View>
        <StarsReview theme={theme} rating={review.rating} />
        <Text style={theme.textStyles.bodyMedium}>{review.comment}</Text>
      </View>
      <View style={{ marginLeft: "auto" }}>
        {editMode && (
          <ButtonIcon
            icon={<Pencil size={20} color={Colors.primary_color} />}
            accessibilityLabel={i18n.t("a11y_edit_review")}
            onPress={() => setReviewModalVisible(true)}
          />
        )}
      </View>
      {editMode && (
        <ReviewModal
          visible={reviewModalVisible}
          onClose={() => setReviewModalVisible(false)}
          review={review}
          onSubmit={handleOnSubmit}
        />
      )}
    </View>
  );
};

export default ReviewCard;
