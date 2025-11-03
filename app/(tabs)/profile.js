import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
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
} from "lucide-react-native";
import { useThemeContext } from "@/contexts/ThemeContext";
import Colors from "@/theme/Colors";
import ActionButton from "@/components/ActionButton";
import ButtonIcon from "@/components/ButtonIcon";
import Avatar from "@/components/Avatar";
import StatCard from "@/components/StatCard";
import Label from "@/components/Label";
import mockListings from "@/mockData/listings";
import { useLanguage } from "@/contexts/LanguageContext";
import { globalStyles } from "@/theme/Styles";
import { formatLocalizedDate } from "@/components/LocalizedDateTime";
import mockReviews from "@/mockData/mockReviews";
import ReviewCard from "@/components/ReviewCard";
import mockUser from "@/mockData/mockUser";

const ProfileScreen = () => {
  const { theme: colorScheme, toggleTheme } = useThemeContext();
  const theme = Colors[colorScheme] || Colors.light;

  const [mode, setMode] = useState("listings");

  const listings = mockListings;
  const [isEnabled, setIsEnabled] = useState(false);
  const isDark = colorScheme === "dark";
  const { language, changeLanguage, i18n } = useLanguage();

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
          {mockReviews.map((review) => (
            <View
              style={[
                styles.transactionItem,
                { backgroundColor: theme.flightCard },
              ]}
              key={review.id}
            >
              <ReviewCard review={review} />
            </View>
          ))}
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
          <TouchableOpacity>
            <Text style={theme.textStyles.highlight}>
              {i18n.t("new_listing")}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionsList}>
          {listings.map((listing) => (
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
                  {listing.weight} kg • {listing.pricePerKg} $/kg
                </Text>
                <Text style={theme.textStyles.bodyMedium}>
                  {formatLocalizedDate(listing.dateDeparture, language)} →{" "}
                  {formatLocalizedDate(listing.dateArrival, language)}
                </Text>
              </View>
              <ButtonIcon
                href={`edit-listing?id=${listing.id}`}
                icon={<Pencil size={24} color={Colors.white} />}
                color={Colors.primary_color}
              />
            </View>
          ))}
        </View>
      </View>
    );
  };

  const Settings = () => {
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
          <Text style={theme.textStyles.sectionTitle}>
            {i18n.t("change_language") || "Langue"}
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
                English
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
                Français
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.settingsContainer}>
          <LogOut size={24} color={Colors.red} />
          <Text style={[theme.textStyles.sectionTitle, { color: Colors.red }]}>
            {i18n.t("log_out")}
          </Text>
        </View>
      </View>
    );
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
              icon={<Edit3 size={24} color="#EDEDED" />}
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
              <Avatar initials="JB" size={80} />

              <View style={styles.userDetails}>
                <View style={styles.nameRow}>
                  <Text style={theme.textStyles.titleMedium}>
                    {mockUser.firstname} {mockUser.lastname}
                  </Text>
                  {mockUser.verified ? (
                    <Label
                      text={i18n.t("verified")}
                      icon={<Shield size={16} color={Colors.light_green} />}
                      backgroundColor={Colors.light_green_translucent}
                      colorText={Colors.light_green}
                    />
                  ) : (
                    <Label
                      text={i18n.t("not_verified")}
                      icon={<Shield size={16} color={Colors.red} />}
                      backgroundColor={Colors.red_translucent}
                      colorText={Colors.red}
                    />
                  )}
                </View>
                <Text style={theme.textStyles.subtitle}>{mockUser.email}</Text>
                <Text style={theme.textStyles.bodyMedium}>
                  {mockUser.numberOfTransactions} {i18n.t("transactions_1")}
                </Text>
              </View>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <StatCard
                icon={<TrendingUp size={20} color={Colors.light_green} />}
                value={`$${mockUser.totalEarned}`}
                label={i18n.t("total_earned")}
                backgroundColor={Colors.light_green_translucent}
                borderColor={Colors.light_green_translucent_2}
                textColor={Colors.light_green}
                labelColor={Colors.dark_grey}
              />
              <StatCard
                icon={<Activity size={20} color={Colors.primary_color} />}
                value={`$${mockUser.totalSpent}`}
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
          {mode === "reviews" && <Review />}
          {mode === "listings" && <Listings />}
          {mode === "settings" && <Settings />}
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
  },
  options: { flexDirection: "colum", gap: 10 },
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
  selectedText: { color: "#FFF" },
});

export default ProfileScreen;
