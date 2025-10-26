import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Save, Trash } from "lucide-react-native";
import Colors from "../theme/Colors";
import Button from "../components/Button";
import ButtonIcon from "../components/ButtonIcon";
import Input from "../components/Input";
import { useThemeContext } from "../contexts/ThemeContext";
import i18n from "@/i18n";

export default function EditProfileScreen() {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;

  const router = useRouter();
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [phone, setPhone] = useState("123-456-7890");
  const [location, setLocation] = useState("New York, NY");
  const [bio, setBio] = useState("Hello! I'm John.");

  const handleGoBack = () => {
    router.back();
  };

  const handleDelete = () => {
    console.log("Delete account");
  };

  const handleUpdateProfile = () => {
    // TODO: Implement update functionality
    console.log("Update listing");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.background_card,
            borderBottomColor: theme.navTopBorder,
          },
        ]}
      >
        <View style={styles.headerContent}>
          <ButtonIcon
            onPress={handleGoBack}
            icon={<ArrowLeft size={20} color={theme.title} />}
          />
          <View style={styles.titleContainer}>
            <Text style={[styles.headerTitle, { color: theme.title }]}>
              {i18n.t("edit_profile")}
            </Text>
          </View>
        </View>
        <ButtonIcon
          onPress={handleDelete}
          icon={<Trash size={24} color={Colors.error_color} />}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Flight Information Card */}
          <View
            style={[styles.card, { backgroundColor: theme.background_card }]}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: theme.title }]}>
                {i18n.t("personal_information")}
              </Text>
            </View>

            <View style={styles.cardContent}>
              {/* Flight Number */}
              <Input
                label={i18n.t("first_name")}
                value={firstName}
                onChangeText={setFirstName}
                placeholder={i18n.t("first_name_placeholder")}
              />
              <Input
                label={i18n.t("last_name")}
                value={lastName}
                onChangeText={setLastName}
                placeholder={i18n.t("last_name_placeholder")}
              />
              <Input
                label={i18n.t("email")}
                value={email}
                onChangeText={setEmail}
                placeholder={i18n.t("email_placeholder")}
                keyboardType="email-address"
              />
              <Input
                label={i18n.t("phone_number")}
                value={phone}
                onChangeText={setPhone}
                placeholder={i18n.t("phone_number_placeholder")}
                keyboardType="phone-pad"
              />
              <Input
                label={i18n.t("location")}
                value={location}
                onChangeText={setLocation}
                placeholder={i18n.t("location_placeholder")}
              />
              <Input
                label={i18n.t("bio")}
                value={bio}
                onChangeText={setBio}
                placeholder={i18n.t("bio_placeholder")}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
          <Button
            text={i18n.t("save_changes")}
            onPress={handleUpdateProfile}
            leftIcon={<Save size={24} color="#FFFFFF" />}
            color={Colors.blue}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  titleContainer: {
    flex: 1,
    paddingLeft: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 24,
  },
  card: {
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 0,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  cardContent: {
    padding: 24,
    paddingTop: 16,
    gap: 16,
  },
});
