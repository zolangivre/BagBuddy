import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "@/theme/Colors";
import ProgressBar from "@/components/ProgressBar";
import { Dot, Check } from "lucide-react-native";
import { useThemeContext } from "@/contexts/ThemeContext";
import i18n from "@/i18n";
import { globalStyles } from "@/theme/Styles";

const TransactionProgressCard = ({ step, role }) => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;

  const Step = ({ number, title, description, isActive, isSuccess }) => (
    <View style={styles.progressStep}>
      <View
        style={
          isSuccess
            ? [styles.stepNumber, { backgroundColor: Colors.success_color }]
            : isActive
            ? [styles.stepNumber, { backgroundColor: Colors.primary_color }]
            : [styles.stepNumber, { backgroundColor: theme.flightCard }]
        }
      >
        {isSuccess ? (
          <Check size={20} color={Colors.white} />
        ) : (
          <Text
            style={
              isActive
                ? [styles.stepNumberText, { color: theme.title_inverse }]
                : [styles.stepNumberText, { color: theme.title }]
            }
          >
            {number}
          </Text>
        )}
      </View>
      <View style={styles.stepContent}>
        <Text
          style={
            isSuccess
              ? [styles.stepTitle, { color: theme.title }]
              : isActive
              ? [styles.stepTitle, { color: Colors.primary_color }]
              : [styles.stepTitle, { color: theme.text }]
          }
        >
          {title}
        </Text>
        <Text style={theme.textStyles.bodyMedium}>{description}</Text>
      </View>
      {isActive && <Dot size={20} color={Colors.primary_color} />}
    </View>
  );

  const totalSteps = role === "buyer" ? 4 : 3;
  return (
    <View
      style={[globalStyles.card, { backgroundColor: theme.background_card }]}
    >
      <View style={styles.progressHeader}>
        <Text style={theme.textStyles.cardTitle}>
          {i18n.t("transaction_progress")}
        </Text>
        <Text style={theme.textStyles.bodyMedium}>
          {step} {i18n.t("of")} {totalSteps}
        </Text>
      </View>

      {/* Progress Bar */}
      <ProgressBar step={step} totalSteps={totalSteps} width={"100%"} />

      {/* Progress Steps */}
      <View style={styles.progressSteps}>
        {role === "buyer" ? (
          <>
            <Step
              number={1}
              title={i18n.t("step_one_title_buyer")}
              description={i18n.t("step_one_description_buyer")}
              isActive={step === 0}
              isSuccess={step > 0}
            />
            <Step
              number={2}
              title={i18n.t("step_two_title_buyer")}
              description={i18n.t("step_two_description_buyer")}
              isActive={step === 1}
              isSuccess={step > 1}
            />
            <Step
              number={3}
              title={i18n.t("step_three_title_buyer")}
              description={i18n.t("step_three_description_buyer")}
              isActive={step === 2}
              isSuccess={step > 2}
            />
            <Step
              number={4}
              title={i18n.t("step_four_title_buyer")}
              description={i18n.t("step_four_description_buyer")}
              isActive={step === 3}
              isSuccess={step > 3}
            />
          </>
        ) : (
          <>
            <Step
              number={1}
              title={i18n.t("step_one_title_seller")}
              description={i18n.t("step_one_description_seller")}
              isActive={step === 0}
              isSuccess={step > 0}
            />
            <Step
              number={2}
              title={i18n.t("step_two_title_seller")}
              description={i18n.t("step_two_description_seller")}
              isActive={step === 1}
              isSuccess={step > 1}
            />
            <Step
              number={3}
              title={i18n.t("step_three_title_seller")}
              description={i18n.t("step_three_description_seller")}
              isActive={step === 2}
              isSuccess={step > 2}
            />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressSteps: {
    gap: 10,
  },
  progressStep: {
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "500",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default TransactionProgressCard;
