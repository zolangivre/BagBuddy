import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Plane, Weight, TrendingUp } from "lucide-react-native";
import Colors from "@/theme/Colors";
import HomeCard from "@/components/HomeCard";
import Avatar from "@/components/Avatar";
import StatCard from "@/components/StatCard";
import ActionButton from "@/components/ActionButton";
import HomeSellView from "@/components/HomeSellView";
import SearchBar from "@/components/SearchBar";
import mockLisings from "@/mockData/listings";
import { useThemeContext } from "@/contexts/ThemeContext";
import i18n from "@/i18n";
import Label from "@/components/Label";

export default function HomeScreen() {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;

  const [mode, setMode] = useState("buy");

  return (
    <View
      style={{ backgroundColor: theme.background }}
      showsVerticalScrollIndicator={false}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <LinearGradient
          colors={["#0EA5E9", "#0EA5E9", "rgba(14, 165, 233, 0.90)"]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerText}>
              <Text style={theme.textStyles.titleLarge}>
                {i18n.t("welcome_back", { name: "Jalil" })}
              </Text>
              <Text style={theme.textStyles.muted}>
                {i18n.t("find_luggage_space")}
              </Text>
            </View>
            <Avatar initials="JB" isHeader={true} size={48} />
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <StatCard
              icon={<Plane size={20} color="#FFFFFF" />}
              value="24"
              label={i18n.t("active_routes")}
            />
            <StatCard
              icon={<Weight size={20} color="#FFFFFF" />}
              value="156kg"
              label={i18n.t("available_weight")}
            />
            <StatCard
              icon={<TrendingUp size={20} color="#FFFFFF" />}
              value="$12"
              label={i18n.t("avg_price")}
            />
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <SearchBar />
          </View>
        </LinearGradient>

        {/* Action Buttons */}
        <ActionButton onSelectionChange={setMode} type="home" />

        {/* Available Weight Section */}
        <View style={styles.weightSection}>
          {/* Weight Listings */}
          <View style={styles.listingsContainer}>
            {mode === "buy" ? (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={theme.textStyles.sectionTitle}>
                    {i18n.t("available_weight")} (3)
                  </Text>
                  <Label
                    text={`35kg ${i18n.t("available")}`}
                    backgroundColor={Colors.dark_cyan_translucent}
                    borderColor={Colors.dark_cyan_translucent_2}
                    colorText={Colors.primary_color}
                  />
                </View>
                {mockLisings.map((item) => (
                  <HomeCard key={item.id} item={item} />
                ))}
              </>
            ) : (
              <HomeSellView />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 70,
    paddingHorizontal: 25,
    paddingBottom: 32,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  headerText: {
    flex: 1,
    gap: 5,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },
  searchContainer: {
    paddingHorizontal: 8,
  },
  weightSection: {
    paddingHorizontal: 25,
    paddingTop: 15,
    marginBottom: 120,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  listingsContainer: {
    gap: 16,
  },
});
