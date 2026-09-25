import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import ButtonIcon from "@/components/ButtonIcon";
import FormBanner from "@/components/FormBanner";
import Colors from "@/theme/Colors";
import { typography } from "@/theme/Fonts";
import { globalStyles } from "@/theme/Styles";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Cadre commun des écrans de connexion, d'inscription et de mot de passe
 * oublié : même dégradé et même logo que l'écran d'accueil, le formulaire dans
 * une carte, et un lien de bas de page vers l'écran voisin.
 *
 * `banner` affiche un message global au-dessus du formulaire :
 * `{ tone: "error" | "success", text }`.
 */
export default function AuthScreen({
  title,
  subtitle,
  banner = null,
  footerText = null,
  footerLinkText = null,
  onFooterLinkPress = null,
  children,
}) {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const insets = useSafeAreaInsets();
  const { i18n } = useLanguage();

  return (
    <LinearGradient
      colors={theme.startBackground}
      locations={[0, 0.5, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.flex}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBar}>
            {router.canGoBack() ? (
              <ButtonIcon
                onPress={() => router.back()}
                color={theme.background_card}
                style={styles.backButton}
                icon={<ArrowLeft size={20} color={theme.title} />}
                accessibilityLabel={i18n.t("a11y_back")}
              />
            ) : null}
          </View>

          <View style={styles.header}>
            <View style={styles.logo}>
              <Image
                source={require("../images/icon.png")}
                style={styles.logoImage}
                resizeMode="cover"
              />
            </View>
            <Text style={[styles.title, { color: theme.title }]}>{title}</Text>
            {subtitle ? (
              <Text style={[theme.textStyles.bodyLarge, styles.centered]}>
                {subtitle}
              </Text>
            ) : null}
          </View>

          <View
            style={[
              globalStyles.card,
              styles.card,
              { backgroundColor: theme.background_card },
            ]}
          >
            {banner ? <FormBanner {...banner} /> : null}
            {children}
          </View>

          {footerText || footerLinkText ? (
            <View style={styles.footer}>
              {footerText ? (
                <Text style={theme.textStyles.bodyMedium}>{footerText}</Text>
              ) : null}
              {footerLinkText ? (
                <TouchableOpacity onPress={onFooterLinkPress} hitSlop={8}>
                  <Text style={styles.link}>{footerLinkText}</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    gap: 24,
  },
  topBar: {
    height: 40,
    flexDirection: "row",
  },
  backButton: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  header: {
    alignItems: "center",
    gap: 10,
  },
  logo: {
    width: 76,
    height: 76,
    borderRadius: 20,
    marginBottom: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary_color,
    shadowColor: Colors.primary_color,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  },
  logoImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  title: {
    ...typography.headline1,
    fontSize: 28,
    textAlign: "center",
  },
  centered: {
    textAlign: "center",
  },
  card: {
    gap: 18,
  },
  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  link: {
    ...typography.title3,
    color: Colors.primary_color,
  },
});
