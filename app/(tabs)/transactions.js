import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Filter, Search, TrendingUp, Activity } from "lucide-react-native";
import Colors from "../../theme/Colors";
import TransactionCard from "../../components/TransactionCard";
import ActionButton from "@/components/ActionButton";
import StatCard from "@/components/StatCard";

export default function TransactionsScreen() {
  const [mode, setMode] = useState("active");

  const mockTransactions = [
    {
      id: 1,
      userName: "Sarah Chen",
      userInitials: "SC",
      type: "buying",
      status: "confirmed",
      statusText: "Confirmed",
      flightNumber: "UA 847",
      date: "Dec 15",
      departure: "LAX",
      arrival: "NRT",
      time: "11:30 PM",
      weight: "6kg",
      rate: "$12/kg",
      total: "$72",
    },
    {
      id: 2,
      userName: "Mike Rodriguez",
      userInitials: "MR",
      type: "selling",
      status: "pending",
      statusText: "Pending confirmation",
      flightNumber: "AA 123",
      date: "Dec 16",
      departure: "JFK",
      arrival: "LHR",
      time: "8:15 AM",
      weight: "10kg",
      rate: "$8/kg",
      total: "$80",
    },
    {
      id: 3,
      userName: "Alex Thompson",
      userInitials: "AT",
      type: "selling",
      status: "sent",
      statusText: "Reservation sent",
      flightNumber: "DL 456",
      date: "Dec 20",
      departure: "ATL",
      arrival: "CDG",
      time: "6:45 AM",
      weight: "8kg",
      rate: "$12/kg",
      total: "$96",
    },
  ];

  const activeTransactions = mockTransactions.filter(
    (transaction) => transaction.status !== "completed"
  );
  const completedTransactions = mockTransactions.filter(
    (transaction) => transaction.status === "completed"
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <LinearGradient
        colors={["#0EA5E9", "#0EA5E9", "rgba(14, 165, 233, 0.90)"]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Transactions</Text>
            <Text style={styles.headerSubtitle}>Manage your weight trades</Text>
          </View>
          <View style={styles.totalBadge}>
            <Text style={styles.totalBadgeText}>4 total</Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <StatCard
            icon={<TrendingUp size={20} color="#FFFFFF" />}
            value="$0"
            label="Total Earned"
          />
          <StatCard
            icon={<Activity size={20} color="#FFFFFF" />}
            value="$45"
            label="Total Spent"
          />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Filter size={20} color={Colors.tertiary_color} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search routes, flights, or destinations..."
              placeholderTextColor={Colors.tertiary_color}
            />
            <Search size={20} color={Colors.tertiary_color} />
          </View>
        </View>
      </LinearGradient>

      {/* Tab Buttons */}
      <ActionButton onSelectionChange={setMode} type="transactions" />

      {/* Transactions List */}
      <View style={styles.transactionsContainer}>
        {mode === "active"
          ? activeTransactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))
          : completedTransactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
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
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
    letterSpacing: 0.07,
    marginBottom: 4,
  },
  headerSubtitle: {
    color: "rgba(255, 255, 255, 0.80)",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    letterSpacing: -0.312,
  },
  totalBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "rgba(255, 255, 255, 0.10)",
    borderRadius: 10,
    borderWidth: 0.612,
    borderColor: "rgba(0, 0, 0, 0.00)",
  },
  totalBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },
  searchContainer: {
    paddingHorizontal: 8,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "400",
    letterSpacing: -0.312,
    color: Colors.tertiary_color,
  },
  transactionsContainer: {
    paddingHorizontal: 25,
    paddingTop: 15,
    gap: 15,
    marginBottom: 120,
  },
});