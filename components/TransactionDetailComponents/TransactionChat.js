import { useCallback, useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Send } from "lucide-react-native";
import { useApolloClient, useMutation } from "@apollo/client/react";
import {
  TRANSACTION_MESSAGES,
  SEND_TRANSACTION_MESSAGE,
} from "@/lib/graphql/transactions";
import { withEndpoint } from "@/lib/apolloClient";
import { graphqlErrorMessage } from "@/lib/graphqlError";
import { TRANSACTION_STATUS } from "@/constants/transaction-status";
import ButtonIcon from "@/components/ButtonIcon";
import Colors from "@/theme/Colors";
import { globalStyles } from "@/theme/Styles";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatLocalizedDateTime } from "@/components/LocalizedDateTime";
import i18n from "@/i18n";

/** Rythme de relecture du fil tant que l'écran est ouvert. */
const POLL_INTERVAL_MS = 10000;
const MAX_MESSAGE_LENGTH = 2000;

/**
 * Fil de discussion d'une transaction, réservé à ses deux participants.
 *
 * Le fil n'est pas lu par `useQuery` mais tenu en état local et complété par
 * relectures incrémentales (`afterId`) : chaque appel ne ramène que la suite,
 * et un échec de relecture de fond ne doit pas vider ce qui est déjà affiché.
 */
export default function TransactionChat({ transaction }) {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const { language } = useLanguage();
  const client = useApolloClient();
  const scrollRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const [sendMessage] = useMutation(SEND_TRANSACTION_MESSAGE, {
    context: withEndpoint("transactions"),
  });

  const transactionId = transaction?.id;
  // Une transaction annulée garde son fil lisible, mais n'en accepte plus.
  const closed =
    transaction?.sellerStatus === TRANSACTION_STATUS.CANCELLED ||
    transaction?.buyerStatus === TRANSACTION_STATUS.CANCELLED;

  /** Sans doublon : un envoi et une relecture peuvent ramener le même message. */
  const append = useCallback((incoming) => {
    if (!incoming?.length) return;
    setMessages((shown) => {
      const seen = new Set(shown.map((message) => message.id));
      const added = incoming.filter((message) => !seen.has(message.id));
      return added.length ? shown.concat(added) : shown;
    });
  }, []);

  useEffect(() => {
    if (!transactionId) return undefined;
    let cancelled = false;
    let lastId;

    const refresh = async (initial) => {
      try {
        const { data } = await client.query({
          query: TRANSACTION_MESSAGES,
          variables: { transactionId, afterId: lastId },
          context: withEndpoint("transactions"),
          fetchPolicy: "network-only",
        });
        if (cancelled) return;
        const next = data?.transactionMessages ?? [];
        if (next.length) lastId = next[next.length - 1].id;
        append(next);
        setError(null);
      } catch (cause) {
        // Seul un premier chargement raté mérite d'être signalé : une relecture
        // de fond en échec laisse le fil déjà affiché en place.
        if (initial && !cancelled) setError(i18n.t("chat_load_error"));
        console.error("Error loading messages:", cause);
      }
    };

    refresh(true);

    // Une transaction annulée a un fil figé côté serveur : le relire en boucle
    // ne peut rien rapporter.
    if (closed) {
      return () => {
        cancelled = true;
      };
    }

    const timer = setInterval(() => refresh(false), POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [transactionId, client, append, closed]);

  const handleSend = async () => {
    const body = draft.trim();
    if (!body || sending) return;
    setSending(true);
    try {
      const { data } = await sendMessage({
        variables: { transactionId, body },
      });
      append([data.sendTransactionMessage]);
      setDraft("");
      setError(null);
    } catch (cause) {
      setError(
        graphqlErrorMessage(
          cause,
          {
            invalid_message: "chat_invalid_message",
            conversation_closed: "chat_closed",
            too_many_messages: "chat_too_many_messages",
          },
          "chat_send_error"
        )
      );
      console.error("Error sending message:", cause);
    } finally {
      setSending(false);
    }
  };

  if (!transactionId) return null;

  return (
    <View
      style={[globalStyles.card, styles.card, { backgroundColor: theme.background_card }]}
    >
      <Text style={theme.textStyles.sectionTitle}>{i18n.t("messages")}</Text>

      <ScrollView
        ref={scrollRef}
        style={styles.log}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: false })
        }
      >
        {messages.length === 0 ? (
          <Text
            style={[
              theme.textStyles.bodyMedium,
              { fontStyle: "italic", textAlign: "center" },
            ]}
          >
            {i18n.t("no_messages_yet")}
          </Text>
        ) : (
          messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.bubble,
                message.mine
                  ? {
                      alignSelf: "flex-end",
                      backgroundColor: Colors.primary_color,
                    }
                  : {
                      alignSelf: "flex-start",
                      backgroundColor: theme.background,
                    },
              ]}
            >
              <Text
                style={
                  message.mine
                    ? [theme.textStyles.bodyMedium, { color: Colors.white }]
                    : theme.textStyles.bodyMedium
                }
              >
                {message.body}
              </Text>
              <Text
                style={[
                  styles.timestamp,
                  message.mine
                    ? { color: Colors.white, opacity: 0.8 }
                    : theme.textStyles.muted,
                ]}
              >
                {formatLocalizedDateTime(message.createdAt, language)}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      {error ? (
        <Text style={[theme.textStyles.bodyMedium, { color: Colors.error_color }]}>
          {error}
        </Text>
      ) : null}

      {closed ? (
        <Text style={[theme.textStyles.bodyMedium, { fontStyle: "italic" }]}>
          {i18n.t("chat_closed")}
        </Text>
      ) : (
        <View style={styles.composer}>
          <TextInput
            style={[
              styles.input,
              {
                color: theme.textStyles.bodyLarge.color,
                borderColor: Colors.very_light_grey ?? Colors.primary_color,
              },
            ]}
            value={draft}
            onChangeText={setDraft}
            placeholder={i18n.t("write_a_message")}
            placeholderTextColor={theme.textStyles.muted.color}
            maxLength={MAX_MESSAGE_LENGTH}
            multiline
            testID="chat-input"
          />
          <ButtonIcon
            onPress={handleSend}
            disabled={sending || !draft.trim()}
            testID="chat-send"
            icon={
              <Send
                size={20}
                color={
                  sending || !draft.trim()
                    ? Colors.tertiary_color
                    : Colors.primary_color
                }
              />
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
  },
  log: {
    maxHeight: 260,
  },
  bubble: {
    maxWidth: "85%",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    maxHeight: 100,
  },
});
