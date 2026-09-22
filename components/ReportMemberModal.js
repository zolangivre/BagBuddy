import { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useMutation } from "@apollo/client/react";
import { REPORT_MEMBER, REPORT_REASONS } from "@/lib/graphql/users";
import { withEndpoint } from "@/lib/apolloClient";
import Button from "@/components/Button";
import Colors from "@/theme/Colors";
import { useThemeContext } from "@/contexts/ThemeContext";
import i18n from "@/i18n";

const MAX_DETAILS_LENGTH = 2000;

/**
 * Signale un membre à la modération, qui reçoit le signalement par email.
 *
 * L'auteur n'est pas envoyé : c'est toujours l'appelant, résolu côté serveur.
 * Le serveur refuse l'auto-signalement (`cannot_report_self`) et plafonne à dix
 * signalements par 24 h (`too_many_reports`).
 */
export default function ReportMemberModal({
  visible,
  onClose,
  reportedSub,
  transactionId,
}) {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState("");
  const [pending, setPending] = useState(false);

  const [reportMember] = useMutation(REPORT_MEMBER, {
    context: withEndpoint("users"),
  });

  const handleSubmit = async () => {
    setPending(true);
    try {
      await reportMember({
        variables: {
          input: {
            reportedSub,
            transactionId,
            reason,
            details: details.trim() || undefined,
          },
        },
      });
      Alert.alert(i18n.t("report_sent_title"), i18n.t("report_sent_message"));
      setDetails("");
      setReason(REPORT_REASONS[0]);
      onClose();
    } catch (error) {
      const code = error?.graphQLErrors?.[0]?.extensions?.code;
      Alert.alert(
        i18n.t("error"),
        {
          cannot_report_self: i18n.t("cannot_report_self"),
          too_many_reports: i18n.t("too_many_reports"),
        }[code] ?? i18n.t("report_error")
      );
      console.error("Error reporting member:", error);
    } finally {
      setPending(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View
          style={[styles.sheet, { backgroundColor: theme.background_card }]}
        >
          <Text style={theme.textStyles.sectionTitle}>
            {i18n.t("report_member")}
          </Text>
          <Text style={theme.textStyles.bodyMedium}>
            {i18n.t("report_member_intro")}
          </Text>

          <ScrollView style={styles.reasons}>
            {REPORT_REASONS.map((value) => {
              const selected = reason === value;
              return (
                <Pressable
                  key={value}
                  onPress={() => setReason(value)}
                  style={[
                    styles.reason,
                    {
                      borderColor: selected
                        ? Colors.primary_color
                        : Colors.very_light_grey,
                      backgroundColor: selected
                        ? Colors.dark_cyan_translucent
                        : "transparent",
                    },
                  ]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                >
                  <Text style={theme.textStyles.bodyLarge}>
                    {i18n.t(`report_reason_${value.toLowerCase()}`)}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <TextInput
            style={[
              styles.input,
              {
                color: theme.textStyles.bodyLarge.color,
                borderColor: Colors.very_light_grey,
              },
            ]}
            value={details}
            onChangeText={setDetails}
            placeholder={i18n.t("report_details_placeholder")}
            placeholderTextColor={theme.textStyles.muted.color}
            maxLength={MAX_DETAILS_LENGTH}
            multiline
          />

          <Button
            text={pending ? i18n.t("loading") : i18n.t("send_report")}
            onPress={handleSubmit}
            disabled={pending}
            color={Colors.error_color}
          />
          <Button
            text={i18n.t("cancel")}
            onPress={onClose}
            color={Colors.tertiary_color}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    gap: 12,
    maxHeight: "85%",
  },
  reasons: {
    maxHeight: 220,
  },
  reason: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minHeight: 72,
    textAlignVertical: "top",
  },
});
