import React, { useState, useContext, useCallback, useEffect } from "react";
import { useFocusEffect } from "expo-router";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Plane, Weight, TrendingUp } from "lucide-react-native";
import Colors from "@/theme/Colors";
import HomeCard from "@/components/HomeCard";
import Avatar from "@/components/Avatar";
import StatCard from "@/components/StatCard";
import ActionButton from "@/components/ActionButton";
import HomeSellView from "@/components/HomeSellView";
import SearchPill from "@/components/SearchPill";
import ResultsToolbar from "@/components/ResultsToolbar";
import FilterSheet from "@/components/FilterSheet";
import OptionSheet from "@/components/OptionSheet";
import { useThemeContext } from "@/contexts/ThemeContext";
import i18n from "@/i18n";
import { AuthContext } from "@/contexts/AuthContext";
import { useQuery } from "@apollo/client/react";
import {
  SEARCH_TRIPS,
  SEARCH_TRIP_COUNT,
  TRIP_PAGE_SIZE,
  toTripSearchInput,
} from "@/lib/graphql/trips";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import {
  SORT_OPTIONS,
  countActiveFilters,
  currencySymbol,
  filterChips,
  searchSummary,
} from "@/utils/filters";
import { initialsOf } from "@/utils/authForm";
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
  const { language } = useLanguage();
  const { currency } = useCurrency();
  const [appliedFilters, setAppliedFilters] = useState({});
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [draft, setDraft] = useState(null);
  const [countedDraft, setCountedDraft] = useState(null);

  // Le bouton de la feuille annonce le nombre de résultats du brouillon. On
  // attend que la saisie se pose avant de demander au serveur : sans ce délai,
  // taper « 12 » dans un prix lancerait une requête par chiffre.
  useEffect(() => {
    const timer = setTimeout(() => setCountedDraft(draft), 300);
    return () => clearTimeout(timer);
  }, [draft]);

  const { data: countData, previousData: previousCountData } = useQuery(
    SEARCH_TRIP_COUNT,
    {
      context: withEndpoint("trips"),
      variables: { filter: toTripSearchInput(countedDraft) },
      skip: !filtersOpen || !countedDraft,
    }
  );
  const draftCount = (countData ?? previousCountData)?.searchTrips?.totalCount;

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

  // Les filtres partent dans les variables de la requête : le serveur rend la
  // page déjà filtrée et triée. Le tri vit à part des autres filtres, pour que
  // changer l'un n'efface jamais l'autre.
  const sort = appliedFilters.sort;
  const handleFilterApply = (filters) => setAppliedFilters({ ...filters, sort });
  const handleSortSelect = (value) =>
    setAppliedFilters((current) => ({
      ...current,
      sort: value === "recent" ? undefined : value,
    }));
  const handleClearFilters = () => setAppliedFilters(sort ? { sort } : {});

  const chips = filterChips(appliedFilters, {
    i18n,
    language,
    currencySymbol: currencySymbol(currency),
  });
  const summary = searchSummary(chips, i18n);
  const activeCount = countActiveFilters(appliedFilters);

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
            <Avatar
              initials={initialsOf({
                givenName: userInfo?.given_name,
                familyName: userInfo?.family_name,
                name: userInfo?.name,
              })}
              isHeader={true}
              size={48}
            />
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
              value={`${totalWeight.toFixed(0)}kg`}
              label={i18n.t("available_weight")}
            />
            <StatCard
              icon={<TrendingUp size={20} color={Colors.white} />}
              value={<Currency amount={averagePrice} />}
              label={i18n.t("avg_price")}
            />
          </View>

          <SearchPill
            title={summary.title}
            subtitle={summary.subtitle}
            activeCount={activeCount}
            onPress={() => setFiltersOpen(true)}
            accessibilityLabel={i18n.t("filters")}
            testID="home-filters"
          />
        </LinearGradient>

        {/* Action Buttons */}
        <ActionButton onSelectionChange={setMode} type="home" />

        {/* Available Weight Section */}
        <View style={styles.weightSection}>
          {/* Weight Listings */}
          <View style={styles.listingsContainer}>
            {mode === "buy" ? (
              <>
                <ResultsToolbar
                  countLabel={
                    data
                      ? i18n.t(
                          totalCount === 1 ? "listings_count_one" : "listings_count",
                          { count: totalCount }
                        )
                      : " "
                  }
                  sortLabel={i18n.t(`sort_${sort ?? "recent"}`)}
                  onSortPress={() => setSortOpen(true)}
                  chips={chips}
                  onRemoveChip={(chip) => setAppliedFilters((current) => chip.remove(current))}
                  onClearAll={handleClearFilters}
                />
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
                        text={i18n.t("load_more_listings", {
                          shown: filteredListings.length,
                          total: totalCount,
                        })}
                        onPress={handleLoadMore}
                        loading={isLoading}
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

      <FilterSheet
        visible={filtersOpen}
        onClose={() => {
          setFiltersOpen(false);
          setDraft(null);
        }}
        value={appliedFilters}
        onApply={handleFilterApply}
        onDraftChange={setDraft}
        applyLabel={
          draftCount === undefined
            ? i18n.t("apply_filters")
            : draftCount === 0
              ? i18n.t("filter_show_none")
              : i18n.t(draftCount === 1 ? "filter_show_listing_one" : "filter_show_listings", {
                  count: draftCount,
                })
        }
        currencySymbol={currencySymbol(currency)}
        weightLabel={i18n.t("filter_available_weight")}
      />

      <OptionSheet
        visible={sortOpen}
        title={i18n.t("sort")}
        options={SORT_OPTIONS.map((value) => ({
          value,
          label: i18n.t(`sort_${value}`),
        }))}
        selected={sort ?? "recent"}
        onSelect={handleSortSelect}
        onClose={() => setSortOpen(false)}
      />
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
  weightSection: {
    paddingHorizontal: 25,
    paddingTop: 15,
  },
  listingsContainer: {
    gap: 15,
  },
});
