import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Plane, DollarSign, Shield, ArrowRight } from "lucide-react-native";
import Colors from "@/theme/Colors";
import Button from "@/components/Button";
import RoundIconText from "@/components/RoundIconText";
import HowStep from "@/components/HowStep";
import { useThemeContext } from "@/contexts/ThemeContext";
import i18n from "@/i18n";
import { globalStyles } from "@/theme/Styles";
import { router } from "expo-router";
import { AuthContext } from "@/contexts/AuthContext";
import { SafeActivityIndicator } from "@/components/SafeActivityIndicator";
// import { gql } from "@apollo/client";
// import { useQuery } from "@apollo/client/react";
// import axios from "axios";

// const GET_USERS = gql`
//   query {
//     users {
//       id
//       firstName
//       lastName
//     }
//   }
// `;

export default function StartScreen() {
  // const { loading, error, data } = useQuery(GET_USERS);
  const { state, signIn } = useContext(AuthContext);
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  useEffect(() => {
    if (state.isSignedIn && state.userInfo) {
      router.replace("/(tabs)/home");
    }
  }, [state.isSignedIn, state.userInfo]);
  const handleStart = () => {
    signIn();
  };

  if (!state) return null;

  if (state.isSignedIn && !state.userInfo) {
    return (
      <View style={styles.container}>
        <SafeActivityIndicator size="large" color="#0891b2" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (state.isSignedIn && state.userInfo) {
    return (
      <View style={styles.container}>
        <SafeActivityIndicator size="large" color="#0891b2" />
        <Text style={styles.loadingText}>Redirection...</Text>
      </View>
    );
  }

  const FeatureIconWrap = ({ title, subtitle, icon, backgroundColor }) => (
    <View style={styles.featureItem}>
      <RoundIconText icon={icon} backgroundColor={backgroundColor} size={48} />
      <Text style={[theme.textStyles.cardTitle, { textAlign: "center" }]}>
        {title}
      </Text>
      <Text style={[theme.textStyles.cardSubtitle, { textAlign: "center" }]}>
        {subtitle}
      </Text>
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
      <View style={styles.container}>
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
            <Text style={theme.textStyles.display}>BagBuddy</Text>

            {/* Subtitle */}
            <Text style={theme.textStyles.highlight}>
              {i18n.t("start_subtitle")}
            </Text>

            {/* Description */}
            <Text style={theme.textStyles.bodyMedium}>
              {i18n.t("start_description")}
            </Text>
          </View>

          {/* Features Card */}
          <View
            style={[
              globalStyles.card,
              { backgroundColor: theme.background_card },
            ]}
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
            style={[
              globalStyles.card,
              { backgroundColor: theme.background_card },
            ]}
          >
            <Text
              style={[
                theme.textStyles.cardTitle,
                { textAlign: "center", marginBottom: 10 },
              ]}
            >
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
            onPress={handleStart}
            text={i18n.t("start_button")}
            rightIcon={
              <ArrowRight
                width={24}
                height={24}
                viewBox="0 0 24 25"
                fill="none"
                color={Colors.white}
              />
            }
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 25,
    marginRight: 25,
    marginBottom: 25,
    marginTop: 50,
  },
  wrapper: {
    gap: 20,
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
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  featureItem: { alignItems: "center", gap: 8, width: "30%" },
  gapContainer: {
    marginTop: 16,
    gap: 16,
  },
});
