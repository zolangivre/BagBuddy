import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Plane, DollarSign, Shield, ArrowRightIcon } from "lucide-react-native";
import Colors from "../theme/Colors";
import Button from "../components/Button";
import RoundIconText from "../components/RoundIconText";
import HowStep from "../components/HowStep";
import { useThemeContext } from "@/contexts/ThemeContext";
import i18n from "@/i18n";

export default function StartScreen() {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;

  const FeatureIconWrap = ({ title, subtitle, icon, backgroundColor }) => (
    <View style={styles.featureItem}>
      <RoundIconText icon={icon} backgroundColor={backgroundColor} size={48} />
      <Text style={[styles.featureTitle, { color: theme.title }]}>{title}</Text>
      <Text style={[styles.featureSubtitle, { color: theme.text }]}>{subtitle}</Text>
    </View>
  );

  return (
    <LinearGradient
      colors={theme.startBackground}
      locations={[0, 0.5, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={styles.scrollContainer}>
        <View style={styles.wrapper}>
          {/* Header Section */}
          <View style={styles.headerContainer}>
            {/* Logo */}
            <View style={[styles.logoWrapper, styles.logoShadow]}>
              <Image
                source={require("../images/logo.png")}
                style={{ width: 115, height: 115, borderRadius: 24 }}
                resizeMode="contain"
              />
            </View>

            {/* Title */}
            <Text style={[styles.title, { color: theme.title }]}>BagBuddy</Text>

            {/* Subtitle */}
            <Text style={styles.subtitle}>{i18n.t("start_subtitle")}</Text>

            {/* Description */}
            <Text style={[styles.description, { color: theme.text }]}>
              {i18n.t("start_description")}
            </Text>
          </View>

          {/* Features Card */}
          <View
            style={[styles.card, { backgroundColor: theme.background_card }]}
          >
            <View style={styles.rowBetween}>
              <FeatureIconWrap
                title={i18n.t("feature_one_title")}
                subtitle={i18n.t("feature_one_description")}
                icon={<Plane size={24} color={Colors.dark_cyan} />}
                backgroundColor={Colors.dark_cyan_translucent}
              />
              <FeatureIconWrap
                title={i18n.t("feature_two_title")}
                subtitle={i18n.t("feature_two_description")}
                icon={<DollarSign size={24} color={Colors.light_green} />}
                backgroundColor={Colors.light_green_translucent}
              />
              <FeatureIconWrap
                title={i18n.t("feature_three_title")}
                subtitle={i18n.t("feature_three_description")}
                icon={<Shield size={24} color={Colors.light_yellow} />}
                backgroundColor={Colors.light_yellow_translucent}
              />
            </View>
          </View>

          {/* How it Works Card */}
          <View
            style={[styles.card, { backgroundColor: theme.background_card }]}
          >
            <Text style={[styles.cardTitle, { color: theme.title }]}>
              {i18n.t("how_card_title")}
            </Text>

            <View style={styles.gapContainer}>
              <HowStep
                number={1}
                title={i18n.t("step_one_title")}
                subtitle={i18n.t("step_one_description")}
                color={Colors.primary_color}
                backgroundColor={Colors.dark_cyan_translucent}
              />
              <HowStep
                number={2}
                title={i18n.t("step_two_title")}
                subtitle={i18n.t("step_two_description")}
                color={Colors.primary_color}
                backgroundColor={Colors.dark_cyan_translucent}
              />
              <HowStep
                number={3}
                title={i18n.t("step_three_title")}
                subtitle={i18n.t("step_three_description")}
                color={Colors.light_green}
                backgroundColor={Colors.light_green_translucent}
              />
            </View>
          </View>

          {/* Start Button */}
          <Button
            href="/(tabs)/home"
            text={i18n.t("start_button")}
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
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
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
    fontSize: 14,
    textAlign: "center",
  },
  card: {
    width: "100%",
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
  featureItem: { alignItems: "center", gap: 8, width: "30%" },
  featureTitle: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  featureSubtitle: {
    fontSize: 12,
    textAlign: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  gapContainer: {
    gap: 16,
  },
});
