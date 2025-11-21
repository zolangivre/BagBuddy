import React, { useState, useContext, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Plane, Weight, TrendingUp } from "lucide-react-native";
import Colors from "@/theme/Colors";
import HomeCard from "@/components/HomeCard";
import Avatar from "@/components/Avatar";
import StatCard from "@/components/StatCard";
import ActionButton from "@/components/ActionButton";
import HomeSellView from "@/components/HomeSellView";
import ActionBar from "@/components/ActionBar";
import { useThemeContext } from "@/contexts/ThemeContext";
import i18n from "@/i18n";
import { AuthContext } from "@/contexts/AuthContext";
import axios from "axios";
import Currency from "@/components/Currency";

export default function HomeScreen() {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const { state } = useContext(AuthContext);
  const userInfo = state.userInfo;
  const [listings, setListings] = useState([]);
  const [mode, setMode] = useState("buy");
  const [filteredListings, setFilteredListings] = useState(listings);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [selectedSort, setSelectedSort] = useState(null);

  const fetchListings = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/trips`
      );

      const availableListings = response.data.filter(
        (listing) => listing.remainingWeight > 0
      );
      setListings(availableListings);
      if (appliedFilters) {
        applyFilters(availableListings, appliedFilters);
      } else {
        setFilteredListings(availableListings);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  }, [appliedFilters]);

  useFocusEffect(
    useCallback(() => {
      fetchListings();
    }, [fetchListings])
  );

  let totalWeight = listings.reduce(
    (sum, item) => sum + item.remainingWeight,
    0
  );
  let averagePrice =
    listings.length > 0
      ? (
          listings.reduce((sum, item) => sum + item.pricePerKg, 0) /
          listings.length
        ).toFixed(2)
      : 0;

  const applyFilters = (data, filters) => {
    const { from, to, minPrice, maxPrice, minWeight, maxWeight, sort } =
      filters;

    let filtered = data.filter((item) => {
      const matchFrom = from ? item.departureAirport === from : true;
      const matchTo = to ? item.arrivalAirport === to : true;
      const matchPrice =
        (minPrice === undefined || item.pricePerKg >= minPrice) &&
        (maxPrice === undefined || item.pricePerKg <= maxPrice);
      const matchWeight =
        (minWeight === undefined || item.remainingWeight >= minWeight) &&
        (maxWeight === undefined || item.remainingWeight <= maxWeight);
      return matchFrom && matchTo && matchPrice && matchWeight;
    });

    if (sort) {
      switch (sort) {
        case "recent":
          filtered = filtered.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          break;
        case "earliest_departure":
          filtered = filtered.sort(
            (a, b) => new Date(a.departureDate) - new Date(b.departureDate)
          );
          break;
        case "price_low":
          filtered = filtered.sort((a, b) => a.pricePerKg - b.pricePerKg);
          break;
        case "price_high":
          filtered = filtered.sort((a, b) => b.pricePerKg - a.pricePerKg);
          break;
        case "weight_high":
          filtered = filtered.sort(
            (a, b) => b.remainingWeight - a.remainingWeight
          );
          break;
        case "weight_low":
          filtered = filtered.sort(
            (a, b) => a.remainingWeight - b.remainingWeight
          );
          break;
      }
    }

    setFilteredListings(filtered);
  };

  const handleFilterApply = (filters) => {
    setAppliedFilters(filters);
    if (!filters) {
      setFilteredListings(listings);
      return;
    }
    setSelectedSort(filters?.sort ?? null);
    applyFilters(listings, filters);
  };

  const handleClearFilters = () => {
    setFilteredListings(listings);
    setAppliedFilters(null);
    setSelectedSort(null);
  };

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
                {i18n.t("welcome_back", { name: userInfo.given_name })}
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
              icon={<Plane size={20} color={Colors.white} />}
              value={listings.length.toString()}
              label={i18n.t("active_routes")}
            />
            <StatCard
              icon={<Weight size={20} color={Colors.white} />}
              value={`${totalWeight}kg`}
              label={i18n.t("available_weight")}
            />
            <StatCard
              icon={<TrendingUp size={20} color={Colors.white} />}
              value={<Currency amount={averagePrice} />}
              label={i18n.t("avg_price")}
            />
          </View>

          {/* Action Bar */}
          <View style={styles.searchContainer}>
            <ActionBar
              showStatusFilter={false}
              onFilterApply={handleFilterApply}
              onClear={handleClearFilters}
              appliedFilters={appliedFilters}
              selectedSort={selectedSort}
            />
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
                {filteredListings.length > 0 ? (
                  filteredListings.map((item) => (
                    <HomeCard key={item.id} item={item} />
                  ))
                ) : (
                  <View
                    style={{
                      flex: 1,
                      minHeight: 200,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={[
                        theme.textStyles.bodyLarge,
                        { fontStyle: "italic", textAlign: "center" },
                      ]}
                    >
                      {i18n.t("no_results_found")}
                    </Text>
                  </View>
                )}
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
