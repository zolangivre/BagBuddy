import React, { useEffect, useState } from "react";
import { Alert, View, Text, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { ArrowLeft, Save, UserCog } from "lucide-react-native";
import { useQuery, useMutation } from "@apollo/client/react";
import { ME, UPDATE_PROFILE } from "@/lib/graphql/users";
import { withEndpoint } from "@/lib/apolloClient";
import { SafeActivityIndicator } from "@/components/SafeActivityIndicator";
import Colors from "@/theme/Colors";
import Button from "@/components/Button";
import ButtonIcon from "@/components/ButtonIcon";
import Input from "@/components/Input";
import { useThemeContext } from "@/contexts/ThemeContext";
import i18n from "@/i18n";
import { globalStyles } from "@/theme/Styles";

export default function EditProfileScreen() {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;

  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

  const { data, loading } = useQuery(ME, {
    context: withEndpoint("users"),
    onError: (error) => console.error("Error fetching profile:", error),
  });

  const [updateProfile] = useMutation(UPDATE_PROFILE, {
    context: withEndpoint("users"),
  });

  const profile = data?.me;

  useEffect(() => {
    if (!profile) return;
    setPhone(profile.phone ?? "");
    setLocation(profile.location ?? "");
    setBio(profile.bio ?? "");
  }, [profile]);

  const handleGoBack = () => {
    router.back();
  };

  /**
   * Le nom et l'email appartiennent à Keycloak, pas au profil applicatif :
   * `UpdateProfileInput` ne les accepte pas, et changer son adresse exige son
   * mot de passe actuel. Ces champs se modifient donc dans la console du compte.
   */
  const openAccountConsole = async () => {
    await WebBrowser.openBrowserAsync(
      `${process.env.EXPO_PUBLIC_KEYCLOAK_ACCOUNT_CONSOLE}`
    );
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      await updateProfile({
        variables: {
          input: {
            bio: bio.trim(),
            location: location.trim(),
            phone: phone.trim(),
          },
        },
      });
      Alert.alert(i18n.t("success"), i18n.t("profile_updated_successfully"));
      router.back();
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert(i18n.t("error"), i18n.t("profile_update_error"));
    } finally {
      setSaving(false);
    }
  };

  if (loading && !profile) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background,
        }}
      >
        <SafeActivityIndicator />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View
        style={[
          globalStyles.header,
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
            <Text style={theme.textStyles.headerTitle}>
              {i18n.t("edit_profile")}
            </Text>
          </View>
        </View>
        <ButtonIcon
          onPress={openAccountConsole}
          icon={<UserCog size={24} color={Colors.primary_color} />}
          accessibilityLabel={i18n.t("manage_your_account")}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View
            style={[globalStyles.card, { backgroundColor: theme.background_card, gap: 16 }]}
          >
            <View style={styles.cardHeader}>
              <Text style={theme.textStyles.cardTitle}>
                {i18n.t("personal_information")}
              </Text>
            </View>

            <View style={styles.cardContent}>
              <Text style={theme.textStyles.bodyMedium}>
                {i18n.t("identity_managed_by_account", {
                  name: profile?.name ?? "",
                  email: profile?.email ?? "",
                })}
              </Text>
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
            text={saving ? i18n.t("loading") : i18n.t("save_changes")}
            onPress={handleUpdateProfile}
            disabled={saving}
            leftIcon={<Save size={24} color={Colors.white} />}
            color={Colors.blue}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 24,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardContent: {
    gap: 16,
  },
});
