import { useCallback, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useThemeContext } from "@/contexts/ThemeContext";
import Colors from "@/theme/Colors";
import { globalStyles } from "@/theme/Styles";
import ScreenHeader from "@/components/ScreenHeader";
import { useQuery } from "@apollo/client/react";
import { REVIEWS_BY_REVIEWEE } from "@/lib/graphql/reviews";
import { withEndpoint } from "@/lib/apolloClient";
import i18n from "@/i18n";
import ReviewCard from "@/components/ReviewCard";
import { AuthContext } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";

export default function AllReviewsScreen() {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const { state } = useContext(AuthContext);
  const userInfo = state.userInfo;
  const { data, loading, refetch } = useQuery(REVIEWS_BY_REVIEWEE, {
    context: withEndpoint("reviews"),
    variables: { revieweeId: userInfo?.sub },
    skip: !userInfo?.sub,
    onError: (error) => console.error("Error fetching reviews:", error),
  });

  const reviews = data?.reviewsByReviewee ?? [];
  const isLoading = loading || !userInfo?.sub;

  useFocusEffect(
    useCallback(() => {
      if (userInfo?.sub) refetch();
    }, [refetch, userInfo?.sub])
  );

  if (isLoading) {
    return <LoadingScreen />;
  }


  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <ScreenHeader title={i18n.t("all_reviews")} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {reviews.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 20,
                minHeight: 100,
              }}
            >
              <Text
                style={[
                  theme.textStyles.bodyLarge,
                  { fontStyle: "italic", textAlign: "center" },
                ]}
              >
                {i18n.t("no_reviews_yet")}
              </Text>
            </View>
          ) : (
            reviews.map((review) => (
              <View
                style={[
                  globalStyles.card,
                  { backgroundColor: theme.background_card },
                ]}
                key={review.id}
              >
                <ReviewCard review={review} />
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  headerInfo: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 15,
    marginBottom: 30,
  },
});
