import React, { useState, useContext, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import Colors from "@/theme/Colors";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { AuthContext } from "@/contexts/AuthContext";
import { Home, CreditCard, User } from "lucide-react-native";
import HomeScreen from "./home";
import TransactionsScreen from "./transactions";
import ProfileScreen from "./profile";

const AndroidTabBar = ({ tabs, activeTab, onTabPress }) => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <View
      style={[
        styles.tabBarContainer,
        { backgroundColor: theme.background_card },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabButton,
              isActive && {
                backgroundColor: tab.color || Colors.primary_color,
              },
            ]}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.8}
          >
            <tab.icon size={24} color={isActive ? Colors.white : theme.title} />
            <Text
              style={[
                styles.tabLabel,
                { color: isActive ? Colors.white : theme.title },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default function TabsLayout() {
  const { i18n, language } = useLanguage();
  const { state } = useContext(AuthContext);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("home");
  const [tabLabels, setTabLabels] = useState({
    home: i18n.t("home"),
    transactions: i18n.t("transactions"),
    profile: i18n.t("profile"),
  });
  const handleTabPress = (key) => {
    setActiveTab(key);
  };

  useEffect(() => {
    setTabLabels({
      home: i18n.t("home"),
      transactions: i18n.t("transactions"),
      profile: i18n.t("profile"),
    });
  }, [language, i18n]);

  useEffect(() => {
    if (!state.isSignedIn) {
      router.replace("/login");
    }
  }, [state.isSignedIn, router]);

  if (!state.isSignedIn) {
    return null;
  }

  const tabs = [
    {
      key: "home",
      label: tabLabels.home,
      icon: Home,
      color: Colors.primary_color,
      route: "/home",
    },
    {
      key: "transactions",
      label: tabLabels.transactions,
      icon: CreditCard,
      color: Colors.success_color,
      route: "/transactions",
    },
    {
      key: "profile",
      label: tabLabels.profile,
      icon: User,
      color: Colors.light_yellow,
      route: "/profile",
    },
  ];

  // iOS
  if (Platform.OS === "ios") {
    const {
      NativeTabs,
      Label,
      Icon,
    } = require("expo-router/unstable-native-tabs");
    return (
      <NativeTabs key={language}>
        <NativeTabs.Trigger name="home">
          <Label>{tabLabels.home}</Label>
          <Icon sf="house.fill" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="transactions">
          <Label>{tabLabels.transactions}</Label>
          <Icon sf="creditcard" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="profile">
          <Label>{tabLabels.profile}</Label>
          <Icon sf="person" />
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  // Android
  return (
    <View style={{ flex: 1 }}>
      {/* Contenu actif */}
      <View style={{ flex: 1 }}>
        {activeTab === "home" && <HomeScreen />}
        {activeTab === "transactions" && <TransactionsScreen />}
        {activeTab === "profile" && <ProfileScreen />}
      </View>

      {/* Navbar */}
      <AndroidTabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: "500",
  },
});
