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
import { useQuery } from "@apollo/client/react";
import {
  SEARCH_TRIPS,
  TRIP_PAGE_SIZE,
  toTripSearchInput,
} from "@/lib/graphql/trips";
import { withEndpoint } from "@/lib/apolloClient";
import Currency from "@/components/Currency";
import { SafeActivityIndicator } from "@/components/SafeActivityIndicator";
import TripAlertCta from "@/components/TripAlertCta";
import Button from "@/components/Button";

export default function HomeScreen() {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const { state } = useContext(AuthContext);
  const userInfo = state.userInfo;
  const [mode, setMode] = useState("buy");
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [selectedSort, setSelectedSort] = useState(null);

  // Le filtrage, le tri et la pagination sont faits par le serveur. `overview`
  // porte les chiffres du bandeau (tout le catalogue) et `results` la page
  // courante du filtre : les agrégats valent pour le filtre entier, pas pour la
  // seule page affichée.
  const { data, loading: isLoading, refetch, fetchMore } = useQuery(
    SEARCH_TRIPS,
    {
      context: withEndpoint("trips"),
      variables: {
        filter: toTripSearchInput(appliedFilters),
        limit: TRIP_PAGE_SIZE,
        offset: 0,
      },
      notifyOnNetworkStatusChange: true,
      onError: (error) => console.error("Error fetching listings:", error),
    }
  );

  const filteredListings = data?.results?.items ?? [];
  const totalCount = data?.results?.totalCount ?? 0;
  const hasMore = filteredListings.length < totalCount;

  const overview = data?.overview;
  const totalWeight = overview?.totalRemainingWeight ?? 0;
  const averagePrice = overview?.averagePricePerKg ?? 0;

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleLoadMore = () => {
    fetchMore({
      variables: { offset: filteredListings.length },
      updateQuery: (previous, { fetchMoreResult }) => {
        if (!fetchMoreResult?.results) return previous;
        return {
          ...fetchMoreResult,
          results: {
            ...fetchMoreResult.results,
            items: [
              ...previous.results.items,
              ...fetchMoreResult.results.items,
            ],
          },
        };
      },
    });
  };

  // Les filtres ne sont plus appliqués ici : ils partent dans les variables de
  // la requête, et le serveur rend la page déjà filtrée et triée.
  const handleFilterApply = (filters) => {
    setAppliedFilters(filters);
    setSelectedSort(filters?.sort ?? null);
  };

  const handleClearFilters = () => {
    setAppliedFilters(null);
    setSelectedSort(null);
  };

  return (
    <View
      style={{ backgroundColor: theme.background }}
      showsVerticalScrollIndicator={false}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130 }}
      >
        {/* Header Section */}
        <LinearGradient
          colors={["#0EA5E9", "#0EA5E9", "rgba(14, 165, 233, 0.90)"]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerText}>
              <Text style={theme.textStyles.titleLarge}>
                {i18n.t("welcome_back", { name: userInfo?.given_name })}
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
              value={String(overview?.totalCount ?? 0)}
              label={i18n.t("active_routes")}
            />
            <StatCard
              icon={<Weight size={20} color={Colors.white} />}
              value={`${Number(totalWeight).toFixed(0)}kg`}
              label={i18n.t("available_weight")}
            />
            <StatCard
              icon={<TrendingUp size={20} color={Colors.white} />}
              value={<Currency amount={averagePrice ?? 0} />}
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
                {/* `isLoading` repasse à true pendant « charger plus » : sans
                    le test sur data, la liste disparaîtrait à chaque page. */}
                {isLoading && !data ? (
                  <View
                    style={{
                      minHeight: 300,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <SafeActivityIndicator/>
                  </View>
                ) : filteredListings.length > 0 ? (
                  <>
                    {filteredListings.map((item) => (
                      <HomeCard key={item.id} item={item} />
                    ))}
                    {hasMore ? (
                      <Button
                        text={
                          isLoading
                            ? i18n.t("loading")
                            : i18n.t("load_more_listings", {
                                shown: filteredListings.length,
                                total: totalCount,
                              })
                        }
                        onPress={handleLoadMore}
                        disabled={isLoading}
                      />
                    ) : null}
                  </>
                ) : (
                  <View
                    style={{
                      flex: 1,
                      minHeight: 300,
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
                    <TripAlertCta filters={appliedFilters} />
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
  },
  listingsContainer: {
    gap: 15,
  },
});
