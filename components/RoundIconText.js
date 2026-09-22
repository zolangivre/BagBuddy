import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { typography } from "@/theme/Fonts";

const RoundIconText = ({ icon = null, text, backgroundColor, size, colorText }) => {

  return (
    <>
      {icon ? (
        <View
          style={[
            styles.roundIconText,
            { backgroundColor: backgroundColor, width: size, height: size },
          ]}
        >
          {icon}
        </View>
      ) : null}
      {text ? (
        <View
          style={[
            styles.roundIconText,
            { backgroundColor: backgroundColor, width: size, height: size },
          ]}
        >
          <Text style={[typography.headline5, { color: colorText }]}>
            {text}
          </Text>
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  roundIconText: {
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default RoundIconText;
