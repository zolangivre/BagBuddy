import { useState, useCallback, useContext } from "react";
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
import ButtonIcon from "@/components/ButtonIcon";
import { ArrowLeft } from "lucide-react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import i18n from "@/i18n";
import ReviewCard from "@/components/ReviewCard";
import { AuthContext } from "@/contexts/AuthContext";
import { SafeActivityIndicator } from "@/components/SafeActivityIndicator";

export default function AllReviewsScreen() {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const router = useRouter();
  const { state } = useContext(AuthContext);
  const userInfo = state.userInfo;
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/reviews/reviewee/${userInfo?.sub}`
      );
      setReviews(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userInfo?.sub]);

  useFocusEffect(
    useCallback(() => {
      fetchAllReviews();
    }, [fetchAllReviews])
  );

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
        <SafeActivityIndicator size="medium" color={theme.primary} />
      </View>
    );
  }

  const handleGoBack = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View
        style={[
          globalStyles.header,
          {
            backgroundColor: theme.background_card,
            borderBottomColor: theme.navTopBorder,
          },
        ]}
      >
        <View style={styles.headerContent}>
          <ButtonIcon
            onPress={handleGoBack}
            icon={<ArrowLeft size={20} color={theme.title} />}
          />
          <View style={styles.titleContainer}>
            <Text style={theme.textStyles.sectionTitle}>
              {i18n.t("all_reviews")}
            </Text>
          </View>
        </View>
      </View>
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
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
