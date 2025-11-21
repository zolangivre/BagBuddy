import { useState, useContext, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Edit3,
  TrendingUp,
  Activity,
  Shield,
  Pencil,
  Moon,
  Sun,
  LogOut,
  Languages,
  CurrencyIcon,
  Eye,
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
import { useCurrency } from "@/contexts/CurrencyContext";
import Currency from "@/components/Currency";
import axios from "axios";

const ProfileScreen = () => {
  const { theme: colorScheme, toggleTheme } = useThemeContext();
  const theme = Colors[colorScheme] || Colors.light;
  const [mode, setMode] = useState("listings");
  const [listings, setListings] = useState([]);
  const [isEnabled] = useState(false);
  const isDark = colorScheme === "dark";
  const { language, changeLanguage, i18n } = useLanguage();
  const { currency, changeCurrency } = useCurrency();
  const { state, signOut } = useContext(AuthContext);
  const userInfo = state.userInfo;
  const [reviews, setReviews] = useState([]);
  const [numberOfTransactions, setNumberOfTransactions] = useState(null);
  const [totalEarned, setTotalEarned] = useState(null);
  const [totalSpent, setTotalSpent] = useState(null);

  const handleNewListing = () => {
    router.push("edit-listing");
  };
  const fetchListings = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/trips/user/${userInfo.sub}`
      );
      const transactionCountResponse = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/transactions/user/${userInfo.sub}/count`
      );
      const totalSpentResponse = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/transactions/buyer/${userInfo.sub}/total-spent`
      );
      const totalEarnedResponse = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/transactions/seller/${userInfo.sub}/total-earned`
      );
      setTotalSpent(totalSpentResponse.data);
      setTotalEarned(totalEarnedResponse.data);
      setNumberOfTransactions(transactionCountResponse.data);
      setListings(response.data);
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  }, []);

  const fetchRevieweeReview = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/reviews/reviewee/${userInfo.sub}`
      );
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchListings();
      fetchRevieweeReview();
    }, [fetchListings, fetchRevieweeReview])
  );

  const Review = () => {
    return (
      <View
        style={[
          globalStyles.card,
          { backgroundColor: theme.background_card, marginBottom: 120 },
        ]}
      >
        <View style={styles.transactionsHeader}>
          <Text style={theme.textStyles.cardTitle}>{i18n.t("reviews")}</Text>
        </View>
        <View style={styles.transactionsList}>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <View
                style={[
                  styles.transactionItem,
                  { backgroundColor: theme.flightCard },
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
    );
  };

  const Listings = () => {
    return (
      <View
        style={[
          globalStyles.card,
          { backgroundColor: theme.background_card, marginBottom: 120 },
        ]}
      >
        <View style={styles.transactionsHeader}>
          <Text style={theme.textStyles.cardTitle}>
            {i18n.t("active_listings")}
          </Text>
          <TouchableOpacity onPress={handleNewListing}>
            <Text style={theme.textStyles.highlight}>
              {i18n.t("new_listing")}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionsList}>
          {listings.length > 0 ? (
            listings.map((listing) => (
              <View
                key={listing.id}
                style={[
                  styles.transactionItem,
                  { backgroundColor: theme.flightCard },
                ]}
              >
                <View style={styles.transactionContent}>
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
                    pathname: "transaction-detail",
                    params: { listingId: listing.id },
                  }}
                  icon={<Eye size={20} color={Colors.primary_color} />}
                />
                <ButtonIcon
                  href={`edit-listing?id=${listing.id}`}
                  icon={<Pencil size={20} color={Colors.primary_color} />}
                />
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
                {i18n.t("no_active_listings")}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const Settings = () => {
    const handleLogout = () => {
      Alert.alert(
        "Déconnexion",
        "Êtes-vous sûr de vouloir vous déconnecter ?",
        [
          {
            text: "Annuler",
            style: "cancel",
          },
          {
            text: "Déconnexion",
            onPress: () => {
              signOut();
              router.push("/start");
            },
            style: "destructive",
          },
        ]
      );
    };
    return (
      <View
        style={[
          globalStyles.card,
          { backgroundColor: theme.background_card, marginBottom: 120 },
        ]}
      >
        <View style={styles.transactionsHeader}>
          <Text style={theme.textStyles.cardTitle}>{i18n.t("settings")}</Text>
        </View>
        <View style={{ gap: 20 }}>
          <View style={styles.settingsContainer}>
            {theme === Colors.dark ? (
              <Moon size={24} color={Colors.primary_color} />
            ) : (
              <Sun size={24} color={Colors.primary_color} />
            )}
            <View
              style={{
                flexDirection: "column",
                flex: 1,
              }}
            >
              <Text style={theme.textStyles.sectionTitle}>
                {i18n.t("dark_mode")}
              </Text>
              <Text style={theme.textStyles.bodyMedium}>
                {i18n.t("toggle_dark_mode")}
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleTheme}
              value={isDark}
            />
          </View>
          <View style={styles.settingsContainer}>
            <Languages size={24} color={Colors.primary_color} />
            <Text style={[theme.textStyles.sectionTitle, { flex: 1 }]}>
              {i18n.t("change_language")}
            </Text>

            <View style={styles.options}>
              <TouchableOpacity
                style={[
                  styles.button,
                  language === "en" && styles.selectedButton,
                ]}
                onPress={() => changeLanguage("en")}
              >
                <Text
                  style={[
                    theme.textStyles.bodyMedium,
                    language === "en" && styles.selectedText,
                  ]}
                >
                  EN
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  language === "fr" && styles.selectedButton,
                ]}
                onPress={() => changeLanguage("fr")}
              >
                <Text
                  style={[
                    theme.textStyles.bodyMedium,
                    language === "fr" && styles.selectedText,
                  ]}
                >
                  FR
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.settingsContainer}>
            <CurrencyIcon size={24} color={Colors.primary_color} />
            <Text style={[theme.textStyles.sectionTitle, { flex: 1 }]}>
              {i18n.t("change_currency")}
            </Text>
            <View style={styles.options}>
              <TouchableOpacity
                style={[
                  styles.button,
                  currency === "USD" && styles.selectedButton,
                ]}
                onPress={() => changeCurrency("USD")}
              >
                <Text
                  style={[
                    theme.textStyles.bodyMedium,
                    currency === "USD" && styles.selectedText,
                  ]}
                >
                  $
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  currency === "EUR" && styles.selectedButton,
                ]}
                onPress={() => changeCurrency("EUR")}
              >
                <Text
                  style={[
                    theme.textStyles.bodyMedium,
                    currency === "EUR" && styles.selectedText,
                  ]}
                >
                  €
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            style={[styles.settingsContainer, { justifyContent: "flex-start" }]}
          >
            <LogOut size={24} color={Colors.red} />
            <Text
              style={[theme.textStyles.sectionTitle, { color: Colors.red }]}
            >
              {i18n.t("log_out")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const Content = () => {
    switch (mode) {
      case "reviews":
        return <Review />;
      case "listings":
        return <Listings />;
      case "settings":
        return <Settings />;
      default:
        return <Listings />;
    }
  };

  return (
    <View style={{ backgroundColor: theme.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
              href="edit-profile"
              icon={<Edit3 size={24} color={Colors.white} />}
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
              <Avatar
                initials={
                  userInfo.name
                    ? userInfo.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : ""
                }
                size={80}
              />

              <View style={styles.userDetails}>
                <View
                  style={[
                    styles.nameRow,
                    {
                      flexDirection: "row",
                      flexWrap: "wrap",
                      alignItems: "flex-start",
                    },
                  ]}
                >
                  <Text
                    style={[theme.textStyles.titleMedium, { flexShrink: 1 }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {userInfo.name}
                  </Text>
                  <Label
                    text={
                      userInfo.email_verified
                        ? i18n.t("verified")
                        : i18n.t("not_verified")
                    }
                    icon={
                      userInfo.email_verified ? (
                        <Shield size={16} color={Colors.light_green} />
                      ) : (
                        <Shield size={16} color={Colors.red} />
                      )
                    }
                    backgroundColor={
                      userInfo.email_verified
                        ? Colors.light_green_translucent
                        : Colors.red_translucent
                    }
                    colorText={
                      userInfo.email_verified ? Colors.light_green : Colors.red
                    }
                    style={{ marginLeft: 8 }}
                  />
                </View>
                <Text style={theme.textStyles.subtitle}>{userInfo.email}</Text>
                <Text style={theme.textStyles.bodyMedium}>
                  {numberOfTransactions} {i18n.t("transactions_1")}
                </Text>
              </View>
            </View>
            <Text style={theme.textStyles.subtitle}>
              {i18n.t("bio")} : {userInfo.bio}
            </Text>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <StatCard
                icon={<TrendingUp size={20} color={Colors.light_green} />}
                value={`$${totalEarned}`}
                label={i18n.t("total_earned")}
                backgroundColor={Colors.light_green_translucent}
                borderColor={Colors.light_green_translucent_2}
                textColor={Colors.light_green}
                labelColor={Colors.dark_grey}
              />
              <StatCard
                icon={<Activity size={20} color={Colors.primary_color} />}
                value={`$${totalSpent}`}
                label={i18n.t("total_spent")}
                backgroundColor={Colors.dark_cyan_translucent}
                borderColor={Colors.dark_cyan_translucent_2}
                textColor={Colors.primary_color}
                labelColor={Colors.dark_grey}
              />
            </View>
          </View>

          {/* Tab Navigation */}
          <ActionButton onSelectionChange={setMode} type="profile" />

          {/* Reviews */}
          <Content />
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
  transactionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  transactionsList: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
  },
  transactionContent: {
    gap: 4,
  },
  settingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    justifyContent: "space-between",
  },
  options: { flexDirection: "row", gap: 10 },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.tertiary_color,
    borderRadius: 12,
  },
  selectedButton: {
    backgroundColor: Colors.primary_color,
    borderColor: Colors.primary_color,
  },
  selectedText: { color: Colors.white },
});

export default ProfileScreen;
