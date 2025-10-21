import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../theme/Colors";

const Avatar = ({ initials, isHeader = false }) => (
  <View style={[styles.avatar, isHeader && styles.headerAvatar]}>
    <View style={[styles.avatarInner, isHeader && styles.headerAvatarInner]}>
      <Text style={[styles.avatarText, isHeader && styles.headerAvatarText]}>
        {initials}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.00)",
    borderWidth: 2,
    borderColor: "rgba(14, 165, 233, 0.10)",
  },
  avatarInner: {
    flex: 1,
    backgroundColor: "rgba(14, 165, 233, 0.10)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: Colors.primary_color,
    fontSize: 16,
    fontWeight: "500",
  },
  headerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.00)",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.20)",
  },
  headerAvatarInner: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.10)",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  headerAvatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "400",
  },
});

export default Avatar;
