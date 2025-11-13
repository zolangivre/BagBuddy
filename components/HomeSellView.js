import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Plus, DollarSign } from "lucide-react-native";
import Colors from "../theme/Colors";
import Button from "./Button";
import RoundIconText from "./RoundIconText";
import HowStep from "./HowStep";
import { useThemeContext } from "../contexts/ThemeContext";
import i18n from "@/i18n";

const HomeSellView = () => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <View style={styles.content}>
      {/* Turn Extra Weight into Cash Section */}
      <View style={styles.cashSection}>
        <RoundIconText
          icon={<DollarSign size={40} color={Colors.success_color} />}
          backgroundColor={Colors.light_green_translucent}
          size={80}
        />
        <Text style={[styles.cashTitle, { color: theme.title }]}>{i18n.t("sell_weight_title")}</Text>
        <Text style={[styles.cashDescription, { color: theme.text }]}>
          {i18n.t("sell_weight_description")}
        </Text>
        <Button
          text={i18n.t("create_new_listing")}
          leftIcon={<Plus size={24} color="#FFFFFF" />}
          color={Colors.success_color}
        />
      </View>

      {/* How Selling Works Section */}
      <View style={[styles.howItWorksSection, { backgroundColor: theme.background_card }]}>
        <Text style={[styles.howItWorksTitle, { color: theme.title }]}>{i18n.t("how_selling_works")}</Text>

        <View style={styles.stepsContainer}>
          <HowStep
            number={1}
            title={i18n.t("list_your_flight")}
            subtitle={i18n.t("add_your_flight_details")}
            color={Colors.primary_color}
            backgroundColor={Colors.dark_cyan_translucent}
          />
          <HowStep
            number={2}
            title={i18n.t("get_requests")}
            subtitle={i18n.t("travelers_will_send_you")}
            color={Colors.primary_color}
            backgroundColor={Colors.dark_cyan_translucent}
          />
          <HowStep
            number={3}
            title={i18n.t("meet_and_earn")}
            subtitle={i18n.t("meet_at_the_airport")}
            color={Colors.light_green}
            backgroundColor={Colors.light_green_translucent}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: 15,
  },
  cashSection: {
    padding: 20,
    alignItems: "center",
    gap: 15,
    borderRadius: 16,
    backgroundColor: Colors.light_green_translucent,
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
    backgroundColor: Colors.light_green_translucent,
    justifyContent: "center",
    alignItems: "center",
  },
  cashTitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
  },
  cashDescription: {
    textAlign: "center",
    fontSize: 16,
    lineHeight: 26,
    paddingHorizontal: 6,
  },
  howItWorksSection: {
    width: "100%",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  howItWorksTitle: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  stepsContainer: {
    gap: 16,
  },
});

export default HomeSellView;
