import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Star } from "lucide-react-native";
import { useThemeContext } from "@/contexts/ThemeContext";
import Colors from "@/theme/Colors";
import ButtonIcon from "@/components/ButtonIcon";
import { useRouter, useLocalSearchParams } from "expo-router";
import ReviewCard from "@/components/ReviewCard";
import { globalStyles } from "@/theme/Styles";
import { useEffect, useState } from "react";
import axios from "axios";
import i18n from "@/i18n";

const ProfileView = () => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] || Colors.light;
  const router = useRouter();
  const { userInfo } = useLocalSearchParams();
  const parsedUserInfo = JSON.parse(userInfo);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [numberOfTransactions, setNumberOfTransactions] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleGoBack = () => {
    router.back();
  };
  let initials = parsedUserInfo.given_name
    ? parsedUserInfo.given_name.charAt(0).toUpperCase() +
      parsedUserInfo.family_name.charAt(0).toUpperCase()
    : "NN";

  const fetchRevieweeReview = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/reviews/reviewee/${parsedUserInfo.sub}`
      );
      const averageRatingResponse = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/reviews/reviewee/${parsedUserInfo.sub}/average`
      );
      const transactionCountResponse = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/transactions/user/${parsedUserInfo.sub}/count`
      );
      setNumberOfTransactions(transactionCountResponse.data);
      setAverageRating(averageRatingResponse.data);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRevieweeReview();
  }, [parsedUserInfo.sub]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background,
        }}
      >
        <ActivityIndicator size="medium" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={["#0EA5E9", "#0EA5E9", "rgba(14, 165, 233, 0.90)"]}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <ButtonIcon
              onPress={handleGoBack}
              icon={<ArrowLeft size={24} color={Colors.white} />}
            />
          </View>
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={{ flexDirection: "column", gap: 4 }}>
              <Text style={styles.userName}>{parsedUserInfo.name}</Text>
              <Text style={styles.userLocation}>{parsedUserInfo.location}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Recent Transactions */}
          <View
            style={[
              globalStyles.card,
              { backgroundColor: theme.background_card },
            ]}
          >
            <View style={styles.rowContainer}>
              <View style={styles.columnContainer}>
                <View style={[styles.rowContainer, { gap: 4 }]}>
                  <Star
                    size={20}
                    color={Colors.light_yellow}
                    fill={Colors.light_yellow}
                  />
                  <Text style={theme.textStyles.titleMedium}>
                    {averageRating ? averageRating.toFixed(1) : "N/A"}
                  </Text>
                </View>
                <Text style={theme.textStyles.bodySmall}>Rating</Text>
              </View>
              <View style={styles.columnContainer}>
                <Text style={theme.textStyles.titleMedium}>
                  {numberOfTransactions !== null ? numberOfTransactions : "N/A"}
                </Text>
                <Text style={theme.textStyles.bodySmall}>Transactions</Text>
              </View>
            </View>
          </View>
          <View
            style={[
              globalStyles.card,
              { backgroundColor: theme.background_card },
            ]}
          >
            <View style={{ alignItems: "center", marginBottom: 16, gap: 8 }}>
              <View style={styles.cardHeader}>
                <Text style={theme.textStyles.cardTitle}>Bio</Text>
              </View>
              <Text style={theme.textStyles.bodyMedium}>
                {parsedUserInfo.bio}
              </Text>
            </View>
          </View>
          {/* Review List */}
          <View style={{ gap: 16, marginBottom: 50 }}>
            {reviews.length > 0 ? (
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
            ) : (
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
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 70,
    paddingHorizontal: 25,
    paddingBottom: 32,
  },
  headerTop: {
    flexDirection: "row",
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    gap: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    color: Colors.primary_color,
    fontSize: 32,
    fontWeight: "600",
  },
  userName: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  userLocation: {
    color: Colors.very_light_grey,
    fontSize: 16,
    fontWeight: "400",
  },
  content: {
    flex: 1,
    marginTop: -50,
    paddingHorizontal: 15,
    gap: 25,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  columnContainer: {
    flexDirection: "column",
    gap: 4,
    alignItems: "center",
  },
});

export default ProfileView;
