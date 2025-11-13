import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

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
    <NativeTabs key={language}>
      <NativeTabs.Trigger name="home">
        <Label>{tabLabels.home}</Label>
        <Icon sf="house.fill" drawable="custom_android_drawable" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="transactions">
        <Icon sf="creditcard" drawable="custom_creditcard_drawable" />
        <Label>{tabLabels.transactions}</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Icon sf="person" drawable="custom_person_drawable" />
        <Label>{tabLabels.profile}</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
