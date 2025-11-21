import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Plus, DollarSign } from "lucide-react-native";
import Colors from "@/theme/Colors";
import Button from "@/components/Button";
import RoundIconText from "./RoundIconText";
import HowStep from "@/components/HowStep";
import { useThemeContext } from "@/contexts/ThemeContext";
import i18n from "@/i18n";
import { globalStyles } from "@/theme/Styles";

const HomeSellView = () => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <View style={styles.content}>
      {/* Turn Extra Weight into Cash Section */}
      <View
        style={[
          globalStyles.card,
          { backgroundColor: Colors.light_green_translucent, alignItems: "center", gap: 15},
        ]}
      >
        <RoundIconText
          icon={<DollarSign size={40} color={Colors.success_color} />}
          backgroundColor={Colors.light_green_translucent}
          size={80}
        />
        <Text
          style={[
            theme.textStyles.cardStatusTitle,
            { color: Colors.success_color },
          ]}
        >
          {i18n.t("sell_weight_title")}
        </Text>
        <Text
          style={[
            theme.textStyles.bodyLarge,
            { textAlign: "center", lineHeight: 26 },
          ]}
        >
          {i18n.t("sell_weight_description")}
        </Text>
        <Button
          text={i18n.t("create_new_listing")}
          href="edit-listing"
          leftIcon={<Plus size={24} color={Colors.white} />}
          color={Colors.success_color}
        />
      </View>

      {/* How Selling Works Section */}
      <View style={[globalStyles.card, { backgroundColor: theme.background_card }]}>
        <Text style={[theme.textStyles.cardTitle, { textAlign: "center", marginBottom: 10 }]}>
          {i18n.t("how_selling_works")}
        </Text>

        <View style={styles.gapContainer}>
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
  gapContainer: {
    marginTop: 16,
    gap: 16,
  },
});

export default HomeSellView;
