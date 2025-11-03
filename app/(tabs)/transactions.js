import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TrendingUp, Activity } from "lucide-react-native";
import Colors from "@/theme/Colors";
import TransactionCard from "@/components/TransactionCard";
import ActionButton from "@/components/ActionButton";
import StatCard from "@/components/StatCard";
import SearchBar from "@/components/SearchBar";
import mockTransactions from "@/mockData/transactions";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Label from "@/components/Label";

export default function TransactionsScreen() {
  const { i18n } = useLanguage();

  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;

  const [mode, setMode] = useState("active");

  const activeTransactions = mockTransactions.filter(
    (transaction) => transaction.status !== "completed"
  );
  const completedTransactions = mockTransactions.filter(
    (transaction) => transaction.status === "completed"
  );

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
                {i18n.t("transactions_title")}
              </Text>
              <Text style={theme.textStyles.muted}>
                {i18n.t("transactions_subtitle")}
              </Text>
            </View>
            <Label
              text={`4 ${i18n.t("total")}`}
              backgroundColor={"rgba(255, 255, 255, 0.10)"}
              borderColor="transparent"
              colorText={Colors.white}
            />
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <StatCard
              icon={<TrendingUp size={20} color={Colors.white} />}
              value="$0"
              label={i18n.t("total_earned")}
            />
            <StatCard
              icon={<Activity size={20} color={Colors.white} />}
              value="$45"
              label={i18n.t("total_spent")}
            />
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <SearchBar />
          </View>
        </LinearGradient>

        {/* Tab Buttons */}
        <ActionButton onSelectionChange={setMode} type="transactions" />

        {/* Transactions List */}
        <View style={styles.transactionsContainer}>
          {mode === "active"
            ? activeTransactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                />
              ))
            : completedTransactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
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
  transactionsContainer: {
    paddingHorizontal: 25,
    paddingTop: 15,
    gap: 15,
    marginBottom: 120,
  },
});
