import {
  NativeTabs,
  Icon,
  Label,
  VectorIcon,
} from "expo-router/unstable-native-tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabsLayout() {
  const { i18n, language } = useLanguage();
  const [tabLabels, setTabLabels] = useState({
    home: i18n.t("home"),
    transactions: i18n.t("transactions"),
    profile: i18n.t("profile"),
  });

  useEffect(() => {
    setTabLabels({
      home: i18n.t("home"),
      transactions: i18n.t("transactions"),
      profile: i18n.t("profile"),
    });
  }, [language, i18n]);

  return (
    <NativeTabs
      key={language}
      minimizeBehavior="onScrollDown"
      style={{ backgroundColor: "white", color: "red" }}
    >
      <NativeTabs.Trigger name="home">
        <Label>{tabLabels.home}</Label>
        {Platform.select({
          ios: <Icon sf="house.fill" drawable="custom_ios_drawable" />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name="home" />} />
          ),
        })}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="transactions">
        {Platform.select({
          ios: <Icon sf="creditcard" drawable="custom_ios_drawable" />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name="credit-card" />} />
          ),
        })}
        <Label>{tabLabels.transactions}</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        {Platform.select({
          ios: <Icon sf="person" drawable="custom_person_drawable" />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name="person" />} />
          ),
        })}
        <Label>{tabLabels.profile}</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
