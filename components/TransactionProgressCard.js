import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../theme/Colors";
import ProgressBar from "./ProgressBar";
import { Dot, Check } from "lucide-react-native";

const Step = ({ number, title, description, isActive, isSuccess }) => (
  <View style={styles.progressStep}>
    <View
      style={
        isSuccess
          ? [styles.stepNumber, styles.stepSuccess]
          : isActive
          ? [styles.stepNumber, styles.stepNumberActive]
          : styles.stepNumber
      }
    >
      {isSuccess ? (
        <Check size={20} color="#FFFFFF" />
      ) : (
        <Text
          style={isActive ? styles.stepNumberTextActive : styles.stepNumberText}
        >
          {number}
        </Text>
      )}
    </View>
    <View style={styles.stepContent}>
      <Text
        style={
          isActive
            ? [styles.stepTitle, styles.stepTitleActive]
            : styles.stepTitle
        }
      >
        {title}
      </Text>
      <Text style={styles.stepDescription}>{description}</Text>
    </View>
    {isActive && <Dot size={20} color={Colors.primary_color} />}
  </View>
);

const TransactionProgressCard = ({ step }) => {
  return (
    <>
      <View style={styles.progressHeader}>
        <Text style={styles.cardTitle}>Transaction Progress</Text>
        <Text style={styles.progressCount}>{step} of 4</Text>
      </View>

      {/* Progress Bar */}
      <ProgressBar step={step} />

      {/* Progress Steps */}
      <View style={styles.progressSteps}>
        <Step
          number={1}
          title="Browse Listings"
          description="Find the perfect weight match"
          isActive={step === 0}
          isSuccess={step > 0}
        />
        <Step
          number={2}
          title="Waiting for Seller Response"
          description="Request sent. Awaiting seller reply."
          isActive={step === 1}
          isSuccess={step > 1}
        />
        <Step
          number={3}
          title="Payment"
          description="Approved. Complete your payment."
          isActive={step === 2}
          isSuccess={step > 2}
        />
        <Step
          number={4}
          title="Completed"
          description="Transaction successful"
          isActive={step === 3}
          isSuccess={step > 3}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    color: Colors.secondary_color,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    letterSpacing: -0.312,
  },
  progressCount: {
    color: Colors.tertiary_color,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: -0.15,
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
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumberActive: {
    backgroundColor: Colors.primary_color,
  },
  stepNumberText: {
    color: Colors.tertiary_color,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 20,
    letterSpacing: -0.15,
  },
  stepNumberTextActive: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 20,
    letterSpacing: -0.15,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    color: Colors.tertiary_color,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    letterSpacing: -0.312,
  },
  stepTitleActive: {
    color: Colors.primary_color,
  },
  stepDescription: {
    color: Colors.tertiary_color,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: -0.15,
  },
  stepSuccess: {
    backgroundColor: Colors.success_color,
  },
});

export default TransactionProgressCard;
