import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ArrowLeft, Flag, Star, ShieldCheck } from "lucide-react-native";
import { useThemeContext } from "@/contexts/ThemeContext";
import Colors from "@/theme/Colors";
import ButtonIcon from "@/components/ButtonIcon";
import { useRouter, useLocalSearchParams } from "expo-router";
import ReviewCard from "@/components/ReviewCard";
import { globalStyles } from "@/theme/Styles";
import { useQuery } from "@apollo/client/react";
import { REVIEW_SUMMARY } from "@/lib/graphql/reviews";
import { TRANSACTION_COUNT } from "@/lib/graphql/transactions";
import { PUBLIC_USER } from "@/lib/graphql/users";
import { initialsOf } from "@/utils/authForm";
import { withEndpoint } from "@/lib/apolloClient";
import i18n from "@/i18n";
import LoadingScreen from "@/components/LoadingScreen";
import ReportMemberModal from "@/components/ReportMemberModal";
import ErrorState from "@/components/ErrorState";

const ProfileView = () => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] || Colors.light;
  const router = useRouter();
  const { userInfo } = useLocalSearchParams();
  const snapshot = JSON.parse(userInfo);
  const [reportVisible, setReportVisible] = useState(false);

  // L'annonce ne porte qu'un instantané du vendeur, pris à la publication : la
  // bio ou la ville ont pu changer depuis, et la vérification de l'email n'y
  // figure pas. Le profil public se lit donc à jour ; l'instantané sert à
  // afficher quelque chose tout de suite, et de repli si userservice ne répond pas.
  const { data: userData } = useQuery(PUBLIC_USER, {
    context: withEndpoint("users"),
    variables: { sub: snapshot.sub },
  });
  const live = userData?.user;
  const parsedUserInfo = {
    ...snapshot,
    ...(live
      ? Object.fromEntries(
          Object.entries(live).filter(([, value]) => value != null && value !== "")
        )
      : {}),
  };

  const handleGoBack = () => {
    router.back();
  };
  // L'objet est celui qu'une annonce porte (UserInfoView), sérialisé par
  // l'écran appelant : champs en camelCase, comme le schéma.
  const initials = initialsOf(parsedUserInfo) || "?";

  // Les avis reçus et la moyenne vivent dans le même schéma : une seule requête
  // là où le REST en demandait deux. Le compteur de transactions, lui, est servi
  // par un autre service, donc par un autre endpoint.
  const {
    data: reviewData,
    error: reviewsError,
    loading: reviewsLoading,
    refetch: refetchReviews,
  } = useQuery(REVIEW_SUMMARY, {
    context: withEndpoint("reviews"),
    variables: { revieweeId: parsedUserInfo.sub },
  });

  const { data: countData, loading: countLoading } = useQuery(TRANSACTION_COUNT, {
    context: withEndpoint("transactions"),
    variables: { userId: parsedUserInfo.sub },
  });

  const reviews = reviewData?.reviewsByReviewee ?? [];
  const averageRating = reviewData?.averageRating ?? null;
  const numberOfTransactions = countData?.transactionCount ?? null;
  // Un refetch ne remplace pas l'écran par un spinner. Un compteur illisible
  // s'affiche « N/A » ; des avis illisibles, eux, ont leur message d'erreur,
  // pour ne pas passer pour « pas encore d'avis ».
  const isLoading = (reviewsLoading && !reviewData) || (countLoading && !countData);

  if (isLoading) {
    return <LoadingScreen />;
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
              accessibilityLabel={i18n.t("a11y_back")}
            />
            <ButtonIcon
              onPress={() => setReportVisible(true)}
              icon={<Flag size={20} color={Colors.white} />}
              accessibilityLabel={i18n.t("report_member")}
            />
          </View>
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={{ flexDirection: "column", gap: 4 }}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>{parsedUserInfo.name}</Text>
                {live?.emailVerified ? (
                  <ShieldCheck
                    size={18}
                    color={Colors.white}
                    accessibilityLabel={i18n.t("verified")}
                  />
                ) : null}
              </View>
              {parsedUserInfo.location ? (
                <Text style={styles.userLocation}>{parsedUserInfo.location}</Text>
              ) : null}
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
                <Text style={theme.textStyles.bodySmall}>{i18n.t("rating")}</Text>
              </View>
              <View style={styles.columnContainer}>
                <Text style={theme.textStyles.titleMedium}>
                  {numberOfTransactions !== null ? numberOfTransactions : "N/A"}
                </Text>
                <Text style={theme.textStyles.bodySmall}>
                  {i18n.t("transactions")}
                </Text>
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
                <Text style={theme.textStyles.cardTitle}>{i18n.t("bio")}</Text>
              </View>
              <Text style={theme.textStyles.bodyMedium}>
                {parsedUserInfo.bio || i18n.t("account_no_bio")}
              </Text>
            </View>
          </View>
          {/* Review List */}
          <View style={{ gap: 16, marginBottom: 50 }}>
            {reviewsError && !reviewData ? (
              <ErrorState
                onRetry={refetchReviews}
                style={[
                  globalStyles.card,
                  { backgroundColor: theme.background_card, minHeight: 0 },
                ]}
              />
            ) : reviews.length > 0 ? (
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

      <ReportMemberModal
        visible={reportVisible}
        onClose={() => setReportVisible(false)}
        reportedSub={parsedUserInfo.sub}
      />
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
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
