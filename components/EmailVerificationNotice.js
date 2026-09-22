import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { MailWarning } from "lucide-react-native";
import { useMutation } from "@apollo/client/react";
import { SEND_VERIFICATION_EMAIL } from "@/lib/graphql/users";
import { withEndpoint } from "@/lib/apolloClient";
import Button from "@/components/Button";
import Colors from "@/theme/Colors";
import { globalStyles } from "@/theme/Styles";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import i18n from "@/i18n";

/**
 * Rappelle de confirmer son adresse et renvoie le lien.
 *
 * Le lien s'ouvre dans un navigateur, souvent sur un autre appareil : l'app ne
 * traite pas le jeton de vérification elle-même. Elle se contente de renvoyer
 * l'email, au plus un par minute (`verification_email_throttled` au-delà).
 */
export default function EmailVerificationNotice({ emailVerified }) {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const { language } = useLanguage();
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  const [sendVerificationEmail] = useMutation(SEND_VERIFICATION_EMAIL, {
    context: withEndpoint("users"),
  });

  if (emailVerified !== false) return null;

  const handleSend = async () => {
    setPending(true);
    try {
      const { data } = await sendVerificationEmail({
        variables: { language },
      });
      // false : l'adresse était déjà vérifiée entre-temps.
      setSent(true);
      Alert.alert(
        i18n.t("verification_email_title"),
        data?.sendVerificationEmail
          ? i18n.t("verification_email_sent")
          : i18n.t("verification_email_already_verified")
      );
    } catch (error) {
      const code = error?.graphQLErrors?.[0]?.extensions?.code;
      Alert.alert(
        i18n.t("error"),
        code === "verification_email_throttled"
          ? i18n.t("verification_email_throttled")
          : i18n.t("verification_email_error")
      );
      console.error("Error sending verification email:", error);
    } finally {
      setPending(false);
    }
  };

  return (
    <View
      style={[
        globalStyles.card,
        styles.card,
        { backgroundColor: theme.background_card },
      ]}
    >
      <View style={styles.headerRow}>
        <MailWarning size={20} color={Colors.light_yellow} />
        <Text style={[theme.textStyles.sectionTitle, { flex: 1 }]}>
          {i18n.t("verify_your_email")}
        </Text>
      </View>
      <Text style={theme.textStyles.bodyMedium}>
        {i18n.t("verify_your_email_message")}
      </Text>
      <Button
        text={
          pending
            ? i18n.t("loading")
            : sent
              ? i18n.t("resend_verification_email")
              : i18n.t("send_verification_email")
        }
        onPress={handleSend}
        disabled={pending}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});
