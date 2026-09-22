import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { KeyRound } from "lucide-react-native";
import { useMutation } from "@apollo/client/react";
import { CONFIRM_HANDOVER } from "@/lib/graphql/transactions";
import { withEndpoint } from "@/lib/apolloClient";
import { graphqlErrorMessage } from "@/lib/graphqlError";
import Button from "@/components/Button";
import Colors from "@/theme/Colors";
import { globalStyles } from "@/theme/Styles";
import { useThemeContext } from "@/contexts/ThemeContext";
import i18n from "@/i18n";
import { router } from "expo-router";

const HANDOVER_CODE_LENGTH = 6;

/**
 * La preuve de remise d'une transaction payée.
 *
 * L'acheteur reçoit un code à son paiement et le donne à la personne qui reçoit
 * le colis ; le voyageur le saisit pour clore. Le code n'est rendu qu'à
 * l'acheteur — il vaut nul pour le voyageur, ce qui est exactement ce qui fait
 * de sa saisie une preuve. Cinq codes faux et il se bloque : seul l'acheteur
 * peut alors encore clore la transaction lui-même.
 */
export default function HandoverCard({ transaction, role }) {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);

  const [confirmHandover] = useMutation(CONFIRM_HANDOVER, {
    context: withEndpoint("transactions"),
  });

  const isBuyer = role === "buyer";

  // Rien à montrer tant que la transaction n'est pas payée : le code n'est posé
  // qu'au règlement.
  if (!transaction?.paidAt) return null;

  const handleConfirm = async () => {
    const trimmed = code.trim();
    if (trimmed.length !== HANDOVER_CODE_LENGTH) {
      Alert.alert(i18n.t("error"), i18n.t("handover_code_length"));
      return;
    }
    setPending(true);
    try {
      const { data } = await confirmHandover({
        variables: { id: transaction.id, code: trimmed },
      });
      Alert.alert(
        i18n.t("handover_confirmed_title"),
        i18n.t("handover_confirmed_message")
      );
      router.replace(
        `/transaction-detail?transactionId=${data.confirmHandover.id}`
      );
    } catch (error) {
      Alert.alert(
        i18n.t("error"),
        graphqlErrorMessage(
          error,
          [
            "invalid_handover_code",
            "handover_locked",
            "handover_not_expected",
          ],
          "handover_error"
        )
      );
      console.error("Error confirming handover:", error);
    } finally {
      setPending(false);
    }
  };

  return (
    <View
      style={[
        globalStyles.card,
        globalStyles.cardStack,
        { backgroundColor: theme.background_card },
      ]}
    >
      <View style={globalStyles.cardHeaderRow}>
        <KeyRound size={20} color={Colors.primary_color} />
        <Text style={[theme.textStyles.sectionTitle, { flex: 1 }]}>
          {i18n.t("handover_title")}
        </Text>
      </View>

      {isBuyer ? (
        <>
          <Text style={theme.textStyles.bodyMedium}>
            {i18n.t("handover_buyer_message")}
          </Text>
          {transaction.handoverCode ? (
            <Text style={[theme.textStyles.titleLarge, styles.code]}>
              {transaction.handoverCode}
            </Text>
          ) : (
            <Text style={[theme.textStyles.bodyMedium, { fontStyle: "italic" }]}>
              {i18n.t("handover_code_pending")}
            </Text>
          )}
        </>
      ) : (
        <>
          <Text style={theme.textStyles.bodyMedium}>
            {transaction.handoverLocked
              ? i18n.t("handover_locked")
              : i18n.t("handover_seller_message")}
          </Text>
          {transaction.handoverLocked ? null : (
            <>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.textStyles.bodyLarge.color,
                    borderColor: Colors.primary_color,
                  },
                ]}
                value={code}
                onChangeText={(value) =>
                  setCode(value.replace(/\D/g, "").slice(0, HANDOVER_CODE_LENGTH))
                }
                placeholder={"".padStart(HANDOVER_CODE_LENGTH, "0")}
                placeholderTextColor={theme.textStyles.muted.color}
                keyboardType="number-pad"
                maxLength={HANDOVER_CODE_LENGTH}
              />
              <Button
                text={i18n.t("confirm_handover")}
                onPress={handleConfirm}
                loading={pending}
                color={Colors.success_color}
              />
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  code: {
    textAlign: "center",
    letterSpacing: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 24,
    textAlign: "center",
    letterSpacing: 8,
  },
});
