import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Edit3,
  TrendingUp,
  Activity,
  Shield,
  Plane,
  CheckCircle,
  Clock,
  Pencil,
} from "lucide-react-native";
import Colors from "../../theme/Colors";
// import StatCard from "../../components/StatCard";
import ActionButton from "../../components/ActionButton";
// import Button from "../../components/Button"
import ButtonIcon from "../../components/ButtonIcon";

const Profile = () => {
  const [mode, setMode] = useState("overview");

  const transactions = [
    {
      id: 1,
      type: "Buyer",
      status: "completed",
      flight: "UA 847 • LAX → NRT",
      weight: "6kg",
      date: "Dec 15, 2024",
      amount: "$72",
      icon: <Plane size={16} color="#FFFFFF" />,
      statusText: "Completed",
    },
    {
      id: 2,
      type: "Seller",
      status: "confirmed",
      flight: "AA 123 • JFK → LHR",
      weight: "10kg",
      date: "Dec 10, 2024",
      amount: "$80",
      icon: <CheckCircle size={16} color="#10B981" />,
      statusText: "Confirmed",
    },
    {
      id: 3,
      type: "Buyer",
      status: "pending",
      flight: "SQ 25 • SIN → JFK",
      weight: "3kg",
      date: "Dec 8, 2024",
      amount: "$45",
      icon: <Clock size={16} color="#0EA5E9" />,
      statusText: "Pending confirmation",
    },
  ];

  const renderStatusBadge = (type, status, statusText, icon) => {
    const typeStyles =
      type === "Seller"
        ? { backgroundColor: Colors.primary_color, color: "#FFFFFF" }
        : {
            backgroundColor: "rgba(0, 0, 0, 0.10)",
            color: Colors.tertiary_color,
          };

    const statusStyles =
      status === "completed"
        ? {
            backgroundColor: "#10B981",
            borderColor: "transparent",
            color: "#FFFFFF",
          }
        : status === "confirmed"
        ? {
            backgroundColor: "rgba(16, 185, 129, 0.10)",
            borderColor: "rgba(16, 185, 129, 0.20)",
            color: "#10B981",
          }
        : {
            backgroundColor: "rgba(14, 165, 233, 0.10)",
            borderColor: "rgba(14, 165, 233, 0.20)",
            color: "#0EA5E9",
          };

    return (
      <View style={styles.badgeContainer}>
        <View style={[styles.typeBadge, typeStyles]}>
          <Text style={[styles.badgeText, { color: typeStyles.color }]}>
            {type}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: statusStyles.backgroundColor,
              borderColor: statusStyles.borderColor,
            },
          ]}
        >
          {icon}
          <Text style={[styles.badgeText, { color: statusStyles.color }]}>
            {statusText}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
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
              <Text style={styles.headerTitle}>Profile</Text>
              <Text style={styles.headerSubtitle}>Manage your account</Text>
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
          <View style={styles.profileCard}>
            <View style={styles.profileInfo}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>JB</Text>
                </View>
              </View>
              <View style={styles.userDetails}>
                <View style={styles.nameRow}>
                  <Text style={styles.userName}>Jalil Baroudi</Text>
                  <View style={styles.verifiedBadge}>
                    <Shield size={16} color="#10B981" />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                </View>
                <Text style={styles.userEmail}>jalil.baroudi@gmail.com</Text>
                <Text style={styles.transactionCount}>12 transactions</Text>
              </View>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <TrendingUp size={20} color="#10B981" />
                </View>
                <Text style={styles.statValue}>$0</Text>
                <Text style={styles.statLabel}>Total Earned</Text>
              </View>
              <View style={[styles.statCard, styles.statCardBlue]}>
                <View style={styles.statIconContainerBlue}>
                  <Activity size={20} color="#0EA5E9" />
                </View>
                <Text style={styles.statValueBlue}>$72</Text>
                <Text style={styles.statLabel}>Total Spent</Text>
              </View>
            </View>
            {/* <View style={styles.statsRow}>
              <StatCard
                icon={<TrendingUp size={20} color="#FFFFFF" />}
                value="$0"
                label="Total Earned"
                style
              />
              <StatCard
                icon={<Activity size={20} color="#FFFFFF" />}
                value="$72"
                label="Total Spent"
              />
            </View> */}
          </View>

          {/* Tab Navigation */}
          <ActionButton onSelectionChange={setMode} type="profile" />

          {/* Recent Transactions */}
          {mode === "overview" && (
            <View style={styles.transactionsCard}>
              <View style={styles.transactionsHeader}>
                <Text style={styles.transactionsTitle}>
                  Recent Transactions
                </Text>
                <TouchableOpacity>
                  <Text style={styles.viewAllButton}>View all</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.transactionsList}>
                {transactions.map((transaction) => (
                  <View key={transaction.id} style={styles.transactionItem}>
                    <View style={styles.transactionContent}>
                      {renderStatusBadge(
                        transaction.type,
                        transaction.status,
                        transaction.statusText,
                        transaction.icon
                      )}
                      <Text style={styles.flightText}>
                        {transaction.flight}
                      </Text>
                      <Text style={styles.weightDateText}>
                        {transaction.weight} • {transaction.date}
                      </Text>
                    </View>
                    <Text style={styles.amountText}>{transaction.amount}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          {mode === "listings" && (
            <View style={styles.transactionsCard}>
              <View style={styles.transactionsHeader}>
                <Text style={styles.transactionsTitle}>Active Listings</Text>
                {/* <TouchableOpacity>
                  <Text style={styles.viewAllButton}>View all</Text>
                </TouchableOpacity> */}
                {/* <Button
                  // href=""
                  text="New listing"
                /> */}
              </View>

              <View style={styles.transactionsList}>
                {transactions.map((transaction) => (
                  <View key={transaction.id} style={styles.transactionItem}>
                    <View style={styles.transactionContent}>
                      <Text style={styles.flightText}>
                        {transaction.flight}
                      </Text>
                      <Text style={styles.weightDateText}>
                        {transaction.weight} • {transaction.date}
                      </Text>
                    </View>
                    <ButtonIcon
                      href="edit-listing"
                      icon={<Pencil size={24} color="#EDEDED" />}
                      color={Colors.primary_color}
                    />
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
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
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
    letterSpacing: 0.07,
  },
  headerSubtitle: {
    color: "rgba(255, 255, 255, 0.80)",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    letterSpacing: -0.312,
  },
  editButton: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: "rgba(224, 242, 254, 0.10)",
  },
  content: {
    flex: 1,
    marginTop: -15,
    paddingHorizontal: 15,
    gap: 25,
  },
  profileCard: {
    padding: 25,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
    gap: 25,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingVertical: 14,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.00)",
    borderWidth: 4,
    borderColor: "rgba(14, 165, 233, 0.10)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(14, 165, 233, 0.10)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: Colors.primary_color,
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
    letterSpacing: 0.07,
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
  userName: {
    color: Colors.secondary_color,
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
    letterSpacing: 0.07,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 0.612,
    borderColor: "rgba(0, 0, 0, 0.00)",
    backgroundColor: "rgba(16, 185, 129, 0.10)",
  },
  verifiedText: {
    color: "#10B981",
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
  },
  userEmail: {
    color: Colors.tertiary_color,
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    letterSpacing: -0.312,
  },
  transactionCount: {
    color: Colors.tertiary_color,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: -0.15,
    marginTop: 10,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
  },
  statCard: {
    flex: 1,
    padding: 17,
    borderRadius: 16,
    borderWidth: 0.612,
    borderColor: "rgba(16, 185, 129, 0.10)",
    backgroundColor: "rgba(16, 185, 129, 0.05)",
    alignItems: "center",
    gap: 4,
  },
  statCardBlue: {
    borderColor: "rgba(14, 165, 233, 0.10)",
    backgroundColor: "rgba(14, 165, 233, 0.05)",
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(16, 185, 129, 0.10)",
    justifyContent: "center",
    alignItems: "center",
  },
  statIconContainerBlue: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(14, 165, 233, 0.10)",
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: {
    color: "#10B981",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
    letterSpacing: 0.07,
    textAlign: "center",
  },
  statValueBlue: {
    color: Colors.primary_color,
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
    letterSpacing: 0.07,
    textAlign: "center",
  },
  statLabel: {
    color: Colors.tertiary_color,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: -0.15,
    textAlign: "center",
  },
  transactionsCard: {
    padding: 25,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    gap: 25,
    marginBottom: 120,
  },
  transactionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionsTitle: {
    color: Colors.secondary_color,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    letterSpacing: -0.312,
  },
  viewAllButton: {
    color: Colors.primary_color,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: -0.15,
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
    backgroundColor: "rgba(224, 242, 254, 0.30)",
  },
  transactionContent: {
    flex: 1,
    gap: 4,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  typeBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
    minHeight: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    gap: 4,
    minHeight: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  flightText: {
    color: Colors.secondary_color,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    letterSpacing: -0.15,
  },
  weightDateText: {
    color: Colors.tertiary_color,
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
  },
  amountText: {
    color: Colors.primary_color,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    letterSpacing: -0.312,
    textAlign: "right",
  },
});

export default Profile;
