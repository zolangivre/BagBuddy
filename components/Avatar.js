import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "@/theme/Colors";

const Avatar = ({ initials, size = 44 }) => (
  <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
    <View style={[styles.avatarInner, { borderRadius: (size - 4) / 2 }]}>
      <Text style={[styles.avatarText, { fontSize: size / 2 }]}>
        {initials}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: Colors.dark_cyan_translucent,
    borderWidth: 2,
    borderColor: "rgba(14, 165, 233, 0.10)",
  },
  avatarInner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: Colors.primary_color,
    fontWeight: "500",
  },
});

export default Avatar;
