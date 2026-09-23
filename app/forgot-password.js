import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation } from "@apollo/client/react";
import { Mail, MailCheck, Send } from "lucide-react-native";
import AuthScreen from "@/components/AuthScreen";
import AuthField from "@/components/AuthField";
import Button from "@/components/Button";
import Colors from "@/theme/Colors";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { withEndpoint } from "@/lib/apolloClient";
import { REQUEST_PASSWORD_RESET } from "@/lib/graphql/users";
import { isValidEmail } from "@/utils/authForm";

/**
 * Demande de lien de réinitialisation. Le lien de l'email ouvre le front web,
 * qui porte le formulaire du nouveau mot de passe : l'app n'a pas d'écran pour
 * le jeton du lien.
 */
export default function ForgotPasswordScreen() {
  const { i18n, language } = useLanguage();
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const params = useLocalSearchParams();
  const [requestReset, { loading }] = useMutation(REQUEST_PASSWORD_RESET, {
    context: withEndpoint("users"),
  });

  const [email, setEmail] = useState(params.email ?? "");
  const [error, setError] = useState(null);
  const [failure, setFailure] = useState(null);
  const [sentTo, setSentTo] = useState(null);

  const backToLogin = () =>
    router.replace({ pathname: "/login", params: { email: sentTo ?? email } });

  const handleSubmit = async () => {
    setFailure(null);
    if (!email.trim()) return setError(i18n.t("auth_error_email_required"));
    if (!isValidEmail(email)) return setError(i18n.t("auth_error_email_invalid"));
    const address = email.trim().toLowerCase();
    try {
      // Le serveur répond true dans tous les cas : il ne dit pas qui est inscrit.
      await requestReset({ variables: { input: { email: address, language } } });
      setSentTo(address);
    } catch {
      setFailure(i18n.t("auth_error_unavailable"));
    }
  };

  if (sentTo) {
    return (
      <AuthScreen
        title={i18n.t("auth_reset_sent_title")}
        subtitle={i18n.t("auth_reset_sent_subtitle")}
        footerText={i18n.t("auth_reset_not_received")}
        footerLinkText={i18n.t("auth_reset_try_again")}
        onFooterLinkPress={() => setSentTo(null)}
      >
        <View style={styles.sent}>
          <View style={styles.sentIcon}>
            <MailCheck size={32} color={Colors.primary_color} />
          </View>
          <Text style={[theme.textStyles.bodyMedium, styles.centered]}>
            {i18n.t("auth_reset_sent_message", { email: sentTo })}
          </Text>
        </View>
        <Button onPress={backToLogin} text={i18n.t("auth_back_to_login")} />
      </AuthScreen>
    );
  }

  return (
    <AuthScreen
      title={i18n.t("auth_forgot_title")}
      subtitle={i18n.t("auth_forgot_subtitle")}
      banner={failure ? { tone: "error", text: failure } : null}
      footerText={i18n.t("auth_remembered_password")}
      footerLinkText={i18n.t("auth_login_link")}
      onFooterLinkPress={backToLogin}
    >
      <AuthField
        label={i18n.t("auth_email")}
        icon={Mail}
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          setError(null);
        }}
        placeholder={i18n.t("auth_email_placeholder")}
        error={error}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="username"
        returnKeyType="send"
        onSubmitEditing={handleSubmit}
        testID="forgot-email"
      />
      <Button
        onPress={handleSubmit}
        text={i18n.t("auth_forgot_button")}
        loading={loading}
        rightIcon={<Send size={20} color={Colors.white} />}
        testID="forgot-submit"
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  sent: {
    alignItems: "center",
    gap: 14,
  },
  sentIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.dark_cyan_translucent,
  },
  centered: {
    textAlign: "center",
  },
});
