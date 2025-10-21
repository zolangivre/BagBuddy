import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSegments, Link } from "expo-router";
import { Home, CreditCard, User } from "lucide-react-native";
import Colors from "../theme/Colors";

const BottomTabNavigator = () => {
  const insets = useSafeAreaInsets();
  const segments = useSegments();

  // Get current route from segments
  const currentRoute = segments[segments.length - 1] || "home";

  return (
    <View
      style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 10) }]}
    >
      <Link href="/home" asChild>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIconContainer}>
            <View
              style={[
                styles.navIconPlaceholder,
                currentRoute === "home" && styles.activeNavIcon,
              ]}
            >
              <Home
                width={24}
                height={24}
                color={
                  currentRoute === "home"
                    ? Colors.primary_color
                    : Colors.tertiary_color
                }
              />
            </View>
          </View>
          <Text
            style={[
              styles.navLabel,
              currentRoute === "home" && styles.navLabelActive,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>
      </Link>

      <Link href="/transactions" asChild>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIconContainer}>
            <View
              style={[
                styles.navIconPlaceholder,
                currentRoute === "transactions" && styles.activeNavIcon,
              ]}
            >
              <CreditCard
                width={24}
                height={24}
                color={
                  currentRoute === "transactions"
                    ? Colors.primary_color
                    : Colors.tertiary_color
                }
              />
            </View>
          </View>
          <Text
            style={[
              styles.navLabel,
              currentRoute === "transactions" && styles.navLabelActive,
            ]}
          >
            Transactions
          </Text>
        </TouchableOpacity>
      </Link>

      <Link href="/profile" asChild>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIconContainer}>
            <View
              style={[
                styles.navIconPlaceholder,
                currentRoute === "profile" && styles.activeNavIcon,
              ]}
            >
              <User
                width={24}
                height={24}
                color={
                  currentRoute === "profile"
                    ? Colors.primary_color
                    : Colors.tertiary_color
                }
              />
            </View>
          </View>
          <Text
            style={[
              styles.navLabel,
              currentRoute === "profile" && styles.navLabelActive,
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 6,
  },
  navItem: {
    alignItems: "center",
    flex: 1,
    paddingVertical: 6,
    gap: 5,
  },
  navIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  activeNavIcon: {
    backgroundColor: "rgba(14, 165, 233, 0.10)",
    width: 56,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  navIconPlaceholder: {
    width: 56,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  navLabel: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
    letterSpacing: 0.5,
    color: Colors.tertiary_color,
    textAlign: "center",
  },
  navLabelActive: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
    letterSpacing: 0.5,
    color: Colors.primary_color,
    textAlign: "center",
  },
});

export default BottomTabNavigator;
