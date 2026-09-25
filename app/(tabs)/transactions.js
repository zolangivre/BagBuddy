import React, { useState, useContext } from "react";
import { View, Text, FlatList, RefreshControl, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TrendingUp, Activity } from "lucide-react-native";
import Colors from "@/theme/Colors";
import TransactionCard from "@/components/TransactionCard";
import ActionButton from "@/components/ActionButton";
import StatCard from "@/components/StatCard";
import SearchPill from "@/components/SearchPill";
import ResultsToolbar from "@/components/ResultsToolbar";
import FilterSheet from "@/components/FilterSheet";
import { useThemeContext } from "@/contexts/ThemeContext";
import Label from "@/components/Label";
import i18n from "@/i18n";
import { NetworkStatus } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { MY_TRANSACTIONS } from "@/lib/graphql/transactions";
import { withEndpoint } from "@/lib/apolloClient";
import { AuthContext } from "@/contexts/AuthContext";
import Currency from "@/components/Currency";
import { TRANSACTION_STATUS } from "@/constants/transaction-status";
import { SafeActivityIndicator } from "@/components/SafeActivityIndicator";
import { useLanguage } from "@/contexts/LanguageContext";
// Les filtres de prix partent tels quels au serveur, qui compare en EUR : on
// les saisit donc en EUR quelle que soit la devise d'affichage.
import { BASE_CURRENCY } from "@/lib/exchangeRates";
import ErrorState from "@/components/ErrorState";
import useRefetchOnFocus from "@/hooks/useRefetchOnFocus";
import { quietly } from "@/utils/quietly";
import {
  countActiveFilters,
  currencySymbol,
  departsAround,
  filterChips,
  searchSummary,
} from "@/utils/filters";

/** Statuts proposés au filtre, vus du côté de l'appelant — mêmes que le web. */
const STATUS_OPTIONS = [
  TRANSACTION_STATUS.WAITING_FOR_RESPONSE_BUYER,
  TRANSACTION_STATUS.REQUEST_REJECTED,
  TRANSACTION_STATUS.PAYMENT_REQUIRED,
  TRANSACTION_STATUS.RESERVATION_RECEIVED,
  TRANSACTION_STATUS.AWAITING_PAYMENT,
  TRANSACTION_STATUS.CONFIRMED,
];

export default function TransactionsScreen() {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const { state } = useContext(AuthContext);
  const userInfo = state.userInfo;
  const [mode, setMode] = useState("active");
  const { language } = useLanguage();
  const [appliedFilters, setAppliedFilters] = useState({});
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draft, setDraft] = useState(null);

  // myTransactions ne prend pas d'identifiant : le serveur se cadre sur le
  // jeton et rend achats et ventes confondus, comme /transactions/user/{sub}.
  const {
    data,
    error,
    loading,
    networkStatus,
    refetch,
  } = useQuery(MY_TRANSACTIONS, {
    context: withEndpoint("transactions"),
  });
  // Seul le premier chargement remplace la liste par un spinner : un refetch
  // (retour sur l'onglet, tirer pour rafraîchir) garde l'ancienne à l'écran.
  const isLoading = loading && !data;
  const isRefreshing = networkStatus === NetworkStatus.refetch;

  const transactions = data?.myTransactions ?? [];
  const numberOfTransactions = transactions.length;

  useRefetchOnFocus(refetch);
  let list =
    mode === "active"
      ? transactions.filter((t) => {
          const isCompleted =
            t.sellerStatus === TRANSACTION_STATUS.COMPLETED &&
            t.buyerStatus === TRANSACTION_STATUS.COMPLETED;
          const isCancelled =
            t.sellerStatus === TRANSACTION_STATUS.CANCELLED ||
            t.buyerStatus === TRANSACTION_STATUS.CANCELLED;
          return !isCompleted && !isCancelled;
        })
      : transactions.filter((t) => {
          const isCompleted =
            t.sellerStatus === TRANSACTION_STATUS.COMPLETED &&
            t.buyerStatus === TRANSACTION_STATUS.COMPLETED;
          const isCancelled =
            t.sellerStatus === TRANSACTION_STATUS.CANCELLED ||
            t.buyerStatus === TRANSACTION_STATUS.CANCELLED;
          return isCompleted || isCancelled;
        });

  let totalEarned = transactions
    .filter(
      (t) =>
        t.sellerId === userInfo?.sub &&
        t.sellerStatus === TRANSACTION_STATUS.COMPLETED
    )
    .reduce((sum, t) => sum + t.total, 0);

  let totalSpent = transactions
    .filter(
      (t) =>
        t.buyerId === userInfo?.sub &&
        t.buyerStatus === TRANSACTION_STATUS.COMPLETED
    )
    .reduce((sum, t) => sum + t.total, 0);

  // La liste affichée est une pure fonction de `list`, du filtre et du mode.
  // Trajet, date et prix sont ceux de l'annonce (`listingInfo`) ; le poids est
  // celui que la transaction réserve.
  const applyFilters = (filters) => {
    const { from, to, minPrice, maxPrice, minWeight, maxWeight, date, flexDays, status } =
      filters ?? {};

    return list.filter((item) => {
      const listing = item.listingInfo ?? {};
      const role = item.sellerId === userInfo?.sub ? "seller" : "buyer";
      const itemStatus = role === "seller" ? item.sellerStatus : item.buyerStatus;
      return (
        (!from || listing.departureAirport === from) &&
        (!to || listing.arrivalAirport === to) &&
        (minPrice === undefined || listing.pricePerKg >= minPrice) &&
        (maxPrice === undefined || listing.pricePerKg <= maxPrice) &&
        (minWeight === undefined || item.weight >= minWeight) &&
        (maxWeight === undefined || item.weight <= maxWeight) &&
        departsAround(listing.departureDate, date, flexDays) &&
        (mode !== "active" || !status || itemStatus === status)
      );
    });
  };

  const filteredTransactions = applyFilters(appliedFilters);
  const draftCount = draft ? applyFilters(draft).length : null;

  const handleClearFilters = () => setAppliedFilters({});

  const chips = filterChips(appliedFilters, {
    i18n,
    language,
    currencySymbol: currencySymbol(BASE_CURRENCY),
  });
  const summary = searchSummary(chips, i18n);
  const countLabel = (count) =>
    i18n.t(count === 1 ? "transactions_count_one" : "transactions_count", { count });

  const header = (
    <>
      {/* Header Section */}
      <LinearGradient
        colors={["#0EA5E9", "#0EA5E9", "rgba(14, 165, 233, 0.90)"]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={theme.textStyles.titleLarge}>
              {i18n.t("transactions_title")}
            </Text>
            <Text style={theme.textStyles.muted}>
              {i18n.t("transactions_subtitle")}
            </Text>
          </View>
          <Label
            text={`${numberOfTransactions} ${i18n.t("total")}`}
            backgroundColor={"rgba(255, 255, 255, 0.10)"}
            borderColor="transparent"
            colorText={Colors.white}
          />
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <StatCard
            icon={<TrendingUp size={20} color={Colors.white} />}
            value={<Currency amount={totalEarned ?? 0} />}
            label={i18n.t("total_earned")}
          />
          <StatCard
            icon={<Activity size={20} color={Colors.white} />}
            value={<Currency amount={totalSpent ?? 0} />}
            label={i18n.t("total_spent")}
          />
        </View>

        <SearchPill
          title={chips.some((chip) => chip.key === "route") ? summary.title : i18n.t("filter_search_transactions")}
          subtitle={summary.subtitle}
          activeCount={countActiveFilters(appliedFilters)}
          onPress={() => setFiltersOpen(true)}
          accessibilityLabel={i18n.t("filters")}
        />
      </LinearGradient>

      {/* Tab Buttons */}
      <ActionButton onSelectionChange={setMode} type="transactions" />

      <View style={styles.section}>
        <ResultsToolbar
          countLabel={isLoading ? " " : countLabel(filteredTransactions.length)}
          chips={chips}
          onRemoveChip={(chip) => setAppliedFilters((current) => chip.remove(current))}
          onClearAll={handleClearFilters}
        />
      </View>
    </>
  );

  const emptyList = isLoading ? (
    <View style={styles.placeholder}>
      <SafeActivityIndicator />
    </View>
  ) : error && !data ? (
    <ErrorState onRetry={refetch} />
  ) : (
    <View style={styles.placeholder}>
      <Text
        style={[
          theme.textStyles.bodyLarge,
          { fontStyle: "italic", textAlign: "center" },
        ]}
      >
        {mode === "active"
          ? i18n.t("no_active_transactions")
          : i18n.t("no_completed_transactions")}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <FlatList
        data={isLoading ? [] : filteredTransactions}
        keyExtractor={(transaction) => transaction.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TransactionCard transaction={item} />
          </View>
        )}
        ListHeaderComponent={header}
        ListEmptyComponent={emptyList}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => quietly(refetch)}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130 }}
      />

      <FilterSheet
        visible={filtersOpen}
        onClose={() => {
          setFiltersOpen(false);
          setDraft(null);
        }}
        value={appliedFilters}
        onApply={setAppliedFilters}
        onDraftChange={setDraft}
        applyLabel={
          draftCount === null
            ? i18n.t("apply_filters")
            : i18n.t("filter_show_count", { label: countLabel(draftCount) })
        }
        currencySymbol={currencySymbol(BASE_CURRENCY)}
        weightLabel={i18n.t("filter_reserved_weight")}
        statusOptions={mode === "active" ? STATUS_OPTIONS : null}
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
    justifyContent: "space-between",
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
  section: {
    paddingHorizontal: 25,
    paddingTop: 15,
    paddingBottom: 15,
  },
  item: {
    paddingHorizontal: 25,
    paddingBottom: 15,
  },
  placeholder: {
    flex: 1,
    minHeight: 350,
    justifyContent: "center",
    alignItems: "center",
  },
});
