import { useState, useContext, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Edit3,
  TrendingUp,
  Activity,
  Shield,
  Pencil,
  Heart,
  Bell,
  ChevronRight,
} from "lucide-react-native";
import { useThemeContext } from "@/contexts/ThemeContext";
import Colors from "@/theme/Colors";
import ActionButton from "@/components/ActionButton";
import ButtonIcon from "@/components/ButtonIcon";
import Avatar from "@/components/Avatar";
import StatCard from "@/components/StatCard";
import Label from "@/components/Label";
import { useLanguage } from "@/contexts/LanguageContext";
import { globalStyles } from "@/theme/Styles";
import { formatLocalizedDate } from "@/components/LocalizedDateTime";
import ReviewCard from "@/components/ReviewCard";
import { AuthContext } from "@/contexts/AuthContext";
import { router } from "expo-router";
import useRefetchOnFocus from "@/hooks/useRefetchOnFocus";
import { quietly } from "@/utils/quietly";
import Currency from "@/components/Currency";
import { useQuery } from "@apollo/client/react";
import { TRIPS_BY_USER } from "@/lib/graphql/trips";
import { TRANSACTION_STATS } from "@/lib/graphql/transactions";
import { REVIEWS_BY_REVIEWEE } from "@/lib/graphql/reviews";
import { ME } from "@/lib/graphql/users";
import { withEndpoint } from "@/lib/apolloClient";
import ProfileSectionCard, { ProfileSectionRow } from "@/components/Profile/ProfileSectionCard";
import ProfileSettingsCard from "@/components/Profile/ProfileSettingsCard";
import { initialsOf } from "@/utils/authForm";
import EmailVerificationNotice from "@/components/EmailVerificationNotice";
import PayoutAccountCard from "@/components/PayoutAccountCard";

const ProfileScreen = () => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] || Colors.light;
  const [mode, setMode] = useState("listings");
  const { language, i18n } = useLanguage();
  const { state } = useContext(AuthContext);
  const userInfo = state.userInfo;
  const handleAllListing = () => {
    router.push("all-listing");
  };

  const handleAllReviews = () => {
    router.push("all-reviews");
  };

  const skipUser = !userInfo?.sub;

  const {
    data: listingsData,
    loading: isLoadingListings,
    refetch: refetchListings,
  } = useQuery(TRIPS_BY_USER, {
    context: withEndpoint("trips"),
    // Le profil n'en montre que cinq, « voir tout » ouvre l'écran dédié.
    variables: { userId: userInfo?.sub, limit: 5 },
    skip: skipUser,
  });

  // Les trois chiffres du bandeau en un aller-retour, là où le REST demandait
  // /count, /total-spent et /total-earned séparément.
  const { data: statsData, refetch: refetchStats } = useQuery(TRANSACTION_STATS, {
    context: withEndpoint("transactions"),
    variables: { sub: userInfo?.sub },
    skip: skipUser,
  });

  const {
    data: reviewsData,
    loading: isLoadingReviews,
    refetch: refetchReviews,
  } = useQuery(REVIEWS_BY_REVIEWEE, {
    context: withEndpoint("reviews"),
    variables: { revieweeId: userInfo?.sub, limit: 5 },
    skip: skipUser,
  });

  // Le profil applicatif complète le /userinfo de Keycloak : bio, localisation,
  // téléphone et compte de versement n'y figurent pas. Il est créé à la volée
  // côté serveur à la première lecture.
  const { data: profileData, refetch: refetchProfile } = useQuery(ME, {
    context: withEndpoint("users"),
  });

  const profile = profileData?.me;
  const listings = listingsData?.tripsByUser ?? [];
  const reviews = reviewsData?.reviewsByReviewee ?? [];
  const numberOfTransactions = statsData?.transactionCount ?? null;
  const totalEarned = statsData?.totalEarned ?? null;
  const totalSpent = statsData?.totalSpent ?? null;

  const refetchAll = useCallback(() => {
    quietly(refetchListings);
    quietly(refetchStats);
    quietly(refetchReviews);
    quietly(refetchProfile);
  }, [refetchListings, refetchStats, refetchReviews, refetchProfile]);
  useRefetchOnFocus(refetchAll, !skipUser);

  const openProfilePage = () => {
    router.push("edit-profile");
  };

  const renderContent = () => {
    switch (mode) {
      case "reviews":
        return (
          <ProfileSectionCard
            title={i18n.t("reviews")}
            onViewAll={handleAllReviews}
            loading={isLoadingReviews && !reviewsData}
            isEmpty={reviews.length === 0}
            emptyText={i18n.t("no_reviews_yet")}
          >
            {reviews.slice(0, 5).map((review) => (
              <ProfileSectionRow key={review.id}>
                <ReviewCard review={review} />
              </ProfileSectionRow>
            ))}
          </ProfileSectionCard>
        );
      case "settings":
        return <ProfileSettingsCard />;
      case "listings":
      default:
        return (
          <ProfileSectionCard
            title={i18n.t("active_listings")}
            onViewAll={handleAllListing}
            loading={isLoadingListings && !listingsData}
            isEmpty={listings.length === 0}
            emptyText={i18n.t("no_active_listings")}
          >
            {listings.slice(0, 5).map((listing) => (
              <ProfileSectionRow key={listing.id}>
                <View style={styles.listingContent}>
                  <Text style={theme.textStyles.sectionTitle}>
                    {listing.departureAirport} → {listing.arrivalAirport}
                  </Text>
                  <Text style={theme.textStyles.bodyMedium}>
                    {listing.remainingWeight} kg •{" "}
                    <Currency amount={listing.pricePerKg} />
                    /kg
                  </Text>
                  <Text style={theme.textStyles.bodyMedium}>
                    {formatLocalizedDate(listing.departureDate, language)} →{" "}
                    {formatLocalizedDate(listing.arrivalDate, language)}
                  </Text>
                </View>
                <ButtonIcon
                  href={{
                    pathname: "edit-listing",
                    params: { id: listing.id },
                  }}
                  icon={<Pencil size={20} color={Colors.primary_color} />}
                  accessibilityLabel={i18n.t("a11y_edit_listing")}
                />
              </ProfileSectionRow>
            ))}
          </ProfileSectionCard>
        );
    }
  };

  return (
    <View style={{ backgroundColor: theme.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 130 }}
      >
        {/* Header */}
        <LinearGradient
          colors={["#0EA5E9", "#0EA5E9", "rgba(14, 165, 233, 0.90)"]}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerText}>
              <Text style={theme.textStyles.titleLarge}>
                {i18n.t("profile")}
              </Text>
              <Text style={theme.textStyles.muted}>
                {i18n.t("manage_your_account")}
              </Text>
            </View>
            <ButtonIcon
              onPress={openProfilePage}
              icon={<Edit3 size={24} color={Colors.white} />}
              accessibilityLabel={i18n.t("edit_profile")}
            />
          </View>
        </LinearGradient>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Profile Card */}
          <View
            style={[
              globalStyles.card,
              { backgroundColor: theme.background_card, gap: 25 },
            ]}
          >
            <View style={styles.profileInfo}>
              <View style={{ flexDirection: "column", alignItems: "center", gap: 8 }}>
                <Avatar
                  initials={
                    initialsOf({
                      givenName: userInfo?.given_name,
                      familyName: userInfo?.family_name,
                      name: userInfo?.name,
                    }) || "?"
                  }
                  size={80}
                />
                <Label
                  text={
                    userInfo?.email_verified
                      ? i18n.t("verified")
                      : i18n.t("not_verified")
                  }
                  icon={
                    userInfo?.email_verified ? (
                      <Shield size={16} color={Colors.light_green} />
                    ) : (
                      <Shield size={16} color={Colors.red} />
                    )
                  }
                  backgroundColor={
                    userInfo?.email_verified
                      ? Colors.light_green_translucent
                      : Colors.red_translucent
                  }
                  colorText={
                    userInfo?.email_verified ? Colors.light_green : Colors.red
                  }
                />
              </View>

              <View style={styles.userDetails}>
                <View
                  style={[
                    styles.nameRow,
                  ]}
                >
                  <Text
                    style={[theme.textStyles.titleMedium, { flexShrink: 1 }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {userInfo?.name}
                  </Text>
                </View>
                <Text style={theme.textStyles.subtitle}>{userInfo?.email}</Text>
                <Text style={theme.textStyles.bodyMedium}>
                  {numberOfTransactions} {i18n.t("transactions_1")}
                </Text>
              </View>
            </View>
            <Text style={[theme.textStyles.subtitle, { textAlign: "justify" }]}>
              {i18n.t("bio")} : {profile?.bio ?? userInfo?.bio}
            </Text>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <StatCard
                icon={<TrendingUp size={20} color={Colors.light_green} />}
                value={<Currency amount={totalEarned ?? 0} />}
                label={i18n.t("total_earned")}
                backgroundColor={Colors.light_green_translucent}
                borderColor={Colors.light_green_translucent_2}
                textColor={Colors.light_green}
                labelColor={Colors.dark_grey}
              />
              <StatCard
                icon={<Activity size={20} color={Colors.primary_color} />}
                value={<Currency amount={totalSpent ?? 0} />}
                label={i18n.t("total_spent")}
                backgroundColor={Colors.dark_cyan_translucent}
                borderColor={Colors.dark_cyan_translucent_2}
                textColor={Colors.primary_color}
                labelColor={Colors.dark_grey}
              />
            </View>
          </View>

          <EmailVerificationNotice emailVerified={profile?.emailVerified} />

          {/* Favoris et alertes de trajet */}
          <View
            style={[
              globalStyles.card,
              styles.shortcuts,
              { backgroundColor: theme.background_card },
            ]}
          >
            <TouchableOpacity
              style={styles.shortcutRow}
              onPress={() => router.push("favorites")}
            >
              <Heart size={20} color={Colors.error_color} />
              <Text style={[theme.textStyles.sectionTitle, { flex: 1 }]}>
                {i18n.t("favorites")}
              </Text>
              <ChevronRight size={20} color={theme.title} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shortcutRow}
              onPress={() => router.push("trip-alerts")}
            >
              <Bell size={20} color={Colors.primary_color} />
              <Text style={[theme.textStyles.sectionTitle, { flex: 1 }]}>
                {i18n.t("trip_alerts")}
              </Text>
              <ChevronRight size={20} color={theme.title} />
            </TouchableOpacity>
          </View>

          <PayoutAccountCard />

          {/* Tab Navigation */}
          <ActionButton onSelectionChange={setMode} type="profile" />

          {/* Reviews */}
          {renderContent()}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 0,
    height: 200,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
  },
  headerText: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginTop: -50,
    paddingHorizontal: 15,
    gap: 25,
  },
  shortcuts: {
    gap: 4,
  },
  shortcutRow: {
    ...globalStyles.cardHeaderRow,
    paddingVertical: 10,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingVertical: 14,
  },
  userDetails: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
  },
  listingContent: {
    gap: 4,
  },
});

export default ProfileScreen;
