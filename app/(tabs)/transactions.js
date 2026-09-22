import React, { useState, useCallback, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { View, Text, ScrollView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TrendingUp, Activity } from "lucide-react-native";
import Colors from "@/theme/Colors";
import TransactionCard from "@/components/TransactionCard";
import ActionButton from "@/components/ActionButton";
import StatCard from "@/components/StatCard";
import ActionBar from "@/components/ActionBar";
import { useThemeContext } from "@/contexts/ThemeContext";
import Label from "@/components/Label";
import i18n from "@/i18n";
import { useQuery } from "@apollo/client/react";
import { MY_TRANSACTIONS } from "@/lib/graphql/transactions";
import { withEndpoint } from "@/lib/apolloClient";
import { AuthContext } from "@/contexts/AuthContext";
import Currency from "@/components/Currency";
import { TRANSACTION_STATUS } from "@/constants/transaction-status";
import { SafeActivityIndicator } from "@/components/SafeActivityIndicator";

export default function TransactionsScreen() {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const { state } = useContext(AuthContext);
  const userInfo = state.userInfo;
  const [mode, setMode] = useState("active");
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedSort, setSelectedSort] = useState(null);

  // myTransactions ne prend pas d'identifiant : le serveur se cadre sur le
  // jeton et rend achats et ventes confondus, comme /transactions/user/{sub}.
  const { data, loading: isLoading, refetch } = useQuery(MY_TRANSACTIONS, {
    context: withEndpoint("transactions"),
    onError: (error) => console.error("Error fetching transactions:", error),
  });

  const transactions = data?.myTransactions ?? [];
  const numberOfTransactions = transactions.length;

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );
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
        t.sellerId === userInfo.sub &&
        t.sellerStatus === TRANSACTION_STATUS.COMPLETED
    )
    .reduce((sum, t) => sum + t.total, 0);

  let totalSpent = transactions
    .filter(
      (t) =>
        t.buyerId === userInfo.sub &&
        t.buyerStatus === TRANSACTION_STATUS.COMPLETED
    )
    .reduce((sum, t) => sum + t.total, 0);

  // La liste affichée est une pure fonction de `list`, du filtre et du mode :
  // la tenir en état imposait un effet, donc un rendu de plus, et forçait à
  // mémoïser `transactions` pour que cet effet ne boucle pas.
  const filterTransactions = () => {
    if (!appliedFilters) return list;

    const { from, to, minPrice, maxPrice, minWeight, maxWeight, status } =
      appliedFilters;

    return list.filter((item) => {
      const matchFrom = from ? item.departureAirport === from : true;
      const matchTo = to ? item.arrivalAirport === to : true;
      const matchPrice =
        (minPrice === undefined || item.pricePerKg >= minPrice) &&
        (maxPrice === undefined || item.pricePerKg <= maxPrice);
      const matchWeight =
        (minWeight === undefined || item.remainingWeight >= minWeight) &&
        (maxWeight === undefined || item.remainingWeight <= maxWeight);

      const role = item.sellerId === userInfo.sub ? "seller" : "buyer";
      const itemStatus =
        role === "seller" ? item.sellerStatus : item.buyerStatus;

      const matchStatus =
        mode === "active" && status ? itemStatus === status : true;
      return matchFrom && matchTo && matchPrice && matchWeight && matchStatus;
    });
  };

  const filteredTransactions = filterTransactions();

  const handleFilterApply = (filters) => {
    setAppliedFilters(
      filters && Object.keys(filters).length > 0 ? filters : null
    );
    setSelectedStatus(filters?.status ?? null);
    setSelectedSort(filters?.sort ?? null);
  };

  const handleClearFilters = () => {
    setAppliedFilters(null);
    setSelectedStatus(null);
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

          {/* Action Bar */}
          <View style={styles.searchContainer}>
            <ActionBar
              showStatusFilter={true}
              onFilterApply={handleFilterApply}
              onClear={handleClearFilters}
              selectedStatus={selectedStatus}
              selectedSort={selectedSort}
              appliedFilters={appliedFilters}
            />
          </View>
        </LinearGradient>

        {/* Tab Buttons */}
        <ActionButton onSelectionChange={setMode} type="transactions" />

        {/* Transactions List */}
        <View style={styles.weightSection}>
          <View style={styles.transactionsContainer}>
            {isLoading ? (
              <View
                style={{
                  minHeight: 350,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SafeActivityIndicator />
              </View>
            ) : filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                />
              ))
            ) : (
              <View
                style={{
                  flex: 1,
                  minHeight: 350,
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
                  {mode === "active"
                    ? i18n.t("no_active_transactions")
                    : i18n.t("no_completed_transactions")}
                </Text>
              </View>
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
  searchContainer: {
    paddingHorizontal: 8,
  },
  weightSection: {
    paddingHorizontal: 25,
    paddingTop: 15,
  },
  transactionsContainer: {
    gap: 15,
  },
});
