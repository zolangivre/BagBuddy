import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Plane, Weight, TrendingUp, Filter, Search } from "lucide-react-native";
import Colors from "../../theme/Colors";
import HomeCard from "../../components/HomeCard";
import Avatar from "../../components/Avatar";
import StatCard from "../../components/StatCard";
import ActionButton from "../../components/ActionButton";
import HomeSellView from "../../components/HomeSellView";

export default function HomeScreen() {
  const mockDataBuy = [
    {
      id: 1,
      name: "Sarah Chen",
      initials: "SC",
      flight: "UA 847",
      date: "Dec 15",
      departure: "LAX",
      arrival: "NRT",
      time: "11:30 PM",
      weight: "8 kg",
      pricePerKg: "$12",
      total: "$96",
    },
    {
      id: 2,
      name: "Marco Silva",
      initials: "MS",
      flight: "LH 441",
      date: "Dec 16",
      departure: "FRA",
      arrival: "JFK",
      time: "2:15 PM",
      weight: "15 kg",
      pricePerKg: "$8",
      total: "$120",
    },
    {
      id: 3,
      name: "Emma Watson",
      initials: "EW",
      flight: "BA 179",
      date: "Dec 17",
      departure: "LHR",
      arrival: "JFK",
      time: "9:45 PM",
      weight: "12 kg",
      pricePerKg: "$10",
      total: "$120",
    },
  ];

  const [mode, setMode] = useState("buy");

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <LinearGradient
        colors={["#0EA5E9", "#0EA5E9", "rgba(14, 165, 233, 0.90)"]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.welcomeText}>Welcome back, Jalil!</Text>
            <Text style={styles.subtitleText}>
              Find luggage space or earn from your extra weight
            </Text>
          </View>
          {<Avatar initials="JB" isHeader={true} />}
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <StatCard
            icon={<Plane size={20} color="#FFFFFF" />}
            value="24"
            label="Active Routes"
          />
          <StatCard
            icon={<Weight size={20} color="#FFFFFF" />}
            value="156kg"
            label="Available"
          />
          <StatCard
            icon={<TrendingUp size={20} color="#FFFFFF" />}
            value="$12"
            label="Avg Price"
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

      {/* Action Buttons */}
      <ActionButton onSelectionChange={setMode} type="home" />

      {/* Available Weight Section */}
      <View style={styles.weightSection}>
        {/* Weight Listings */}
        <View style={styles.listingsContainer}>
          {mode === "buy" ? (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Available Weight (3)</Text>
                <View style={styles.availableBadge}>
                  <Text style={styles.availableBadgeText}>35kg available</Text>
                </View>
              </View>
              {mockDataBuy.map((item) => (
                <HomeCard key={item.id} item={item} />
              ))}
            </>
          ) : (
            <HomeSellView />
          )}
        </View>
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
    alignItems: "center",
    marginBottom: 32,
  },
  headerText: {
    flex: 1,
  },
  welcomeText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
    letterSpacing: 0.07,
    marginBottom: 8,
  },
  subtitleText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    letterSpacing: -0.312,
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
  actionSection: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginTop: -15,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  buyButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: Colors.primary_color,
    borderRadius: 16,
    gap: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  buyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  sellButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 16,
    gap: 18,
  },
  sellButtonText: {
    color: Colors.secondary_color,
    fontSize: 16,
    fontWeight: "500",
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
  sectionTitle: {
    color: Colors.secondary_color,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
    letterSpacing: -0.312,
  },
  availableBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: "rgba(14, 165, 233, 0.10)",
    borderRadius: 10,
    borderWidth: 0.612,
    borderColor: "rgba(0, 0, 0, 0.00)",
  },
  availableBadgeText: {
    color: Colors.primary_color,
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
  },
  listingsContainer: {
    gap: 16,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
    gap: 5,
  },
  navLabel: {
    color: Colors.tertiary_color,
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  navLabelActive: {
    color: Colors.primary_color,
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
    letterSpacing: 0.5,
  },
});
