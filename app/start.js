import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Plane, DollarSign, Shield, ArrowRightIcon } from "lucide-react-native";
import Colors from "../theme/Colors";
import Button from "../components/Button";

export default function StartScreen() {
  return (
    <LinearGradient
      colors={[
        "rgba(14, 165, 233, 0.05)",
        "#FFFFFF",
        "rgba(224, 242, 254, 0.10)",
      ]}
      locations={[0, 0.5, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.wrapper}>
          {/* Header Section */}
          <View style={styles.headerContainer}>
            {/* Logo */}
            <View style={[styles.logoWrapper, styles.logoShadow]}>
              <Image
                source={require("../images/logo.png")}
                style={{ width: 72, height: 72, borderRadius: 24 }}
                resizeMode="contain"
              />
            </View>

            {/* Title */}
            <Text style={styles.title}>BagBuddy</Text>

            {/* Subtitle */}
            <Text style={styles.subtitle}>Turn spare weight into cash</Text>

            {/* Description */}
            <Text style={styles.description}>
              The smart way to share luggage allowance
            </Text>
          </View>

          {/* Features Card */}
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              {/* Same Flight */}
              <View style={styles.featureItem}>
                <View style={styles.featureIconWrap}>
                  <Plane
                    width={24}
                    height={24}
                    viewBox="0 0 25 25"
                    fill="none"
                    color={Colors.primary_color}
                  />
                </View>
                <Text style={styles.featureTitle}>Same Flight</Text>
                <Text style={styles.featureSubtitle}>Meet at the airport</Text>
              </View>

              {/* Fair Price */}
              <View style={styles.featureItem}>
                <View style={styles.featureIconWrapAlt}>
                  <DollarSign
                    width={24}
                    height={24}
                    viewBox="0 0 25 25"
                    fill="none"
                    color={Colors.success_color}
                  />
                </View>
                <Text style={styles.featureTitle}>Fair Price</Text>
                <Text style={styles.featureSubtitle}>Market rates</Text>
              </View>

              {/* Secure */}
              <View style={styles.featureItem}>
                <View style={styles.featureIconWrapAlt2}>
                  <Shield
                    width={24}
                    height={24}
                    viewBox="0 0 25 25"
                    fill="none"
                    color={Colors.loading_background_color}
                  />
                </View>
                <Text style={styles.featureTitle}>Secure</Text>
                <Text style={styles.featureSubtitle}>Verified users</Text>
              </View>
            </View>
          </View>

          {/* How it Works Card */}
          <View style={styles.cardAlt}>
            <Text style={styles.cardTitle}>How it works</Text>

            <View style={styles.gapContainer}>
              {/* Step 1 */}
              <View style={styles.stepRow}>
                <View style={styles.stepNumberWrap}>
                  <Text style={styles.stepNumber}>1</Text>
                </View>
                <View>
                  <Text style={styles.stepTitle}>Browse or List</Text>
                  <Text style={styles.stepSubtitle}>
                    Check your weight or spare space
                  </Text>
                </View>
              </View>

              {/* Step 2 */}
              <View style={styles.stepRow}>
                <View style={styles.stepNumberWrap}>
                  <Text style={styles.stepNumber}>2</Text>
                </View>
                <View style={styles.stepTextWrap}>
                  <Text style={styles.stepTitle}>Connect & Agree</Text>
                  <Text style={styles.stepSubtitle}>
                    Message travelers and confirm the details
                  </Text>
                </View>
              </View>

              {/* Step 3 */}
              <View style={styles.stepRow}>
                <View style={styles.stepNumberWrapAlt}>
                  <Text style={styles.stepNumberAlt}>3</Text>
                </View>
                <View style={styles.stepTextWrap}>
                  <Text style={styles.stepTitle}>Meet & Trade</Text>
                  <Text style={styles.stepSubtitle}>
                    Meet at check-in and complete the transaction
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Start Button */}
          <Button
            href="/(tabs)/home"
            text="Start your journey"
            rightIcon={
              <ArrowRightIcon
                width={24}
                height={24}
                viewBox="0 0 24 25"
                fill="none"
                color="#FFFFFF"
              />
            }
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    gap: 25,
    marginLeft: 25,
    marginRight: 25,
    marginBottom: 25,
    marginTop: 50,
    width: "100%",
  },
  headerContainer: { alignItems: "center", gap: 15, width: "100%" },
  logoWrapper: {
    width: 96,
    height: 96,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  logoShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 25,
    backgroundColor: Colors.primary_color,
  },
  title: {
    color: Colors.secondary_color,
    fontSize: 36,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    color: Colors.primary_color,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  description: {
    color: Colors.tertiary_color,
    fontSize: 14,
    textAlign: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  featureItem: { alignItems: "center", gap: 8 },
  featureIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(14,165,233,0.1)",
  },
  featureIconWrapAlt: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(16,185,129,0.1)",
  },
  featureIconWrapAlt2: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(245,158,11,0.1)",
  },
  featureTitle: {
    color: Colors.secondary_color,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  featureSubtitle: {
    color: Colors.tertiary_color,
    fontSize: 12,
    textAlign: "center",
  },
  cardAlt: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  cardTitle: {
    color: Colors.secondary_color,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  gapContainer: {
    gap: 16,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  stepNumberWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(14,165,233,0.1)",
  },
  stepNumberWrapAlt: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(16,185,129,0.1)",
  },
  stepNumber: { color: Colors.primary_color, fontSize: 14, fontWeight: "700" },
  stepNumberAlt: {
    color: Colors.success_color,
    fontSize: 14,
    fontWeight: "700",
  },
  stepTitle: { color: Colors.secondary_color, fontSize: 14, fontWeight: "600" },
  stepSubtitle: { color: Colors.tertiary_color, fontSize: 12, lineHeight: 18 },
  startButton: {
    width: "100%",
    height: 48,
    backgroundColor: Colors.primary_color,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  startButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
});
