import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Plus, DollarSign } from "lucide-react-native";
import Colors from "../theme/Colors";
import Button from "./Button";

const HomeSellView = () => {
  return (
    <View style={styles.content}>
      {/* Turn Extra Weight into Cash Section */}
      <View style={styles.cashSection}>
        <View style={styles.iconContainer}>
          <DollarSign size={40} color={Colors.success_color} />
        </View>
        <Text style={styles.cashTitle}>Turn Extra Weight into Cash</Text>
        <Text style={styles.cashDescription}>
          Have extra luggage allowance on your upcoming flight? List it here and
          earn money by helping other travelers.
        </Text>
        <Button
          text="Create new listing"
          leftIcon={<Plus size={24} color="#FFFFFF" />}
          color={Colors.success_color}
        />
      </View>

      {/* How Selling Works Section */}
      <View style={styles.howItWorksSection}>
        <Text style={styles.howItWorksTitle}>How Selling Works</Text>

        <View style={styles.stepsContainer}>
          {/* Step 1 */}
          <View style={styles.stepRow}>
            <View
              style={[
                styles.stepNumber,
                { backgroundColor: "rgba(14, 165, 233, 0.10)" },
              ]}
            >
              <Text
                style={[styles.stepNumberText, { color: Colors.primary_color }]}
              >
                1
              </Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>List Your Flight</Text>
              <Text style={styles.stepDescription}>
                Add your flight details and available weight
              </Text>
            </View>
          </View>

          {/* Step 2 */}
          <View style={styles.stepRow}>
            <View
              style={[
                styles.stepNumber,
                { backgroundColor: "rgba(14, 165, 233, 0.10)" },
              ]}
            >
              <Text
                style={[styles.stepNumberText, { color: Colors.primary_color }]}
              >
                2
              </Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Get Requests</Text>
              <Text style={styles.stepDescription}>
                Travelers will send you booking requests
              </Text>
            </View>
          </View>

          {/* Step 3 */}
          <View style={styles.stepRow}>
            <View
              style={[
                styles.stepNumber,
                { backgroundColor: "rgba(16, 185, 129, 0.10)" },
              ]}
            >
              <Text
                style={[styles.stepNumberText, { color: Colors.success_color }]}
              >
                3
              </Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Meet & Earn</Text>
              <Text style={styles.stepDescription}>
                Meet at the airport and get paid instantly
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 15,
    gap: 15,
    marginTop: -15,
  },
  cashSection: {
    padding: 20,
    alignItems: "center",
    gap: 15,
    borderRadius: 16,
    backgroundColor: "rgba(16, 185, 129, 0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(16, 185, 129, 0.10)",
    justifyContent: "center",
    alignItems: "center",
  },
  cashTitle: {
    color: Colors.secondary_color,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28,
    letterSpacing: -0.449,
    fontFamily: "Inter",
  },
  cashDescription: {
    color: Colors.tertiary_color,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 26,
    letterSpacing: -0.312,
    paddingHorizontal: 6,
    fontFamily: "Inter",
  },
  howItWorksSection: {
    padding: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  howItWorksTitle: {
    color: Colors.secondary_color,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
    letterSpacing: -0.312,
    marginBottom: 16,
    fontFamily: "Inter",
  },
  stepsContainer: {
    gap: 16,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 20,
    letterSpacing: -0.15,
    fontFamily: "Inter",
  },
  stepContent: {
    flex: 1,
    gap: 4,
  },
  stepTitle: {
    color: Colors.secondary_color,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    letterSpacing: -0.312,
    fontFamily: "Inter",
  },
  stepDescription: {
    color: Colors.tertiary_color,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: -0.15,
    fontFamily: "Inter",
  },
});

export default HomeSellView;