import { useContext } from "react";
import { View, Text, FlatList, RefreshControl, StyleSheet } from "react-native";
import { useThemeContext } from "@/contexts/ThemeContext";
import Colors from "@/theme/Colors";
import { globalStyles } from "@/theme/Styles";
import ScreenHeader from "@/components/ScreenHeader";
import { NetworkStatus } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { REVIEWS_BY_REVIEWEE } from "@/lib/graphql/reviews";
import { withEndpoint } from "@/lib/apolloClient";
import i18n from "@/i18n";
import ReviewCard from "@/components/ReviewCard";
import { AuthContext } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";
import ErrorState from "@/components/ErrorState";
import useRefetchOnFocus from "@/hooks/useRefetchOnFocus";
import { quietly } from "@/utils/quietly";

export default function AllReviewsScreen() {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const { state } = useContext(AuthContext);
  const userInfo = state.userInfo;
  const { data, error, loading, networkStatus, refetch } = useQuery(
    REVIEWS_BY_REVIEWEE,
    {
      context: withEndpoint("reviews"),
      variables: { revieweeId: userInfo?.sub },
      skip: !userInfo?.sub,
    }
  );

  useRefetchOnFocus(refetch, Boolean(userInfo?.sub));

  const reviews = data?.reviewsByReviewee ?? [];
  const isLoading = (loading && !data) || !userInfo?.sub;

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <ScreenHeader title={i18n.t("all_reviews")} />
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.content}
        data={reviews}
        keyExtractor={(review) => review.id}
        renderItem={({ item }) => (
          <View
            style={[globalStyles.card, { backgroundColor: theme.background_card }]}
          >
            <ReviewCard review={item} />
          </View>
        )}
        ListEmptyComponent={
          error && !data ? (
            <ErrorState onRetry={refetch} />
          ) : (
            <View style={styles.empty}>
              <Text
                style={[
                  theme.textStyles.bodyLarge,
                  { fontStyle: "italic", textAlign: "center" },
                ]}
              >
                {i18n.t("no_reviews_yet")}
              </Text>
            </View>
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={networkStatus === NetworkStatus.refetch}
            onRefresh={() => quietly(refetch)}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 15,
    paddingBottom: 46,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: 100,
  },
});
