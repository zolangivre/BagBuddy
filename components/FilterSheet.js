import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { ArrowLeftRight, CalendarDays, X } from "lucide-react-native";
import AirportPicker from "@/components/AirportPicker";
import Chip from "@/components/Chip";
import Button from "@/components/Button";
import Colors from "@/theme/Colors";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  FLEX_DAYS,
  compactFilters,
  fromDayString,
  parseAmount,
  toDayString,
} from "@/utils/filters";

const AMOUNT_KEYS = ["minPrice", "maxPrice", "minWeight", "maxWeight"];

/** Brouillon éditable : les montants restent du texte tant qu'on tape. */
function toDraft(filters) {
  const draft = { ...filters };
  for (const key of AMOUNT_KEYS) {
    draft[key] = filters?.[key] !== undefined ? String(filters[key]) : "";
  }
  return draft;
}

function fromDraft(draft) {
  const filters = { ...draft };
  for (const key of AMOUNT_KEYS) filters[key] = parseAmount(draft[key]);
  return compactFilters(filters);
}

/**
 * Tous les filtres sur un seul écran, appliqués d'un coup.
 *
 * On travaille sur un brouillon : fermer la feuille n'applique rien, et le
 * bouton du bas dit combien de résultats on obtiendra avant de valider — le
 * parent le calcule à partir de `onDraftChange` et le rend dans `applyLabel`.
 *
 * `statusOptions` (transactions) ajoute une section de statut ; le tri n'est
 * pas ici mais à côté des résultats, où il se change sans rouvrir la feuille.
 */
export default function FilterSheet({
  visible,
  onClose,
  value,
  onApply,
  onDraftChange,
  applyLabel,
  currencySymbol,
  weightLabel,
  statusOptions = null,
}) {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const isDark = colorScheme === "dark";
  const { i18n, language } = useLanguage();
  const insets = useSafeAreaInsets();

  const [draft, setDraft] = useState(() => toDraft(value));
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Repart des filtres appliqués à chaque ouverture : ce qu'on a tapé puis
  // abandonné la fois précédente ne doit pas réapparaître. Seulement au passage
  // fermé → ouvert : un nouvel objet `value` venu d'un rendu du parent ne doit
  // pas effacer la saisie en cours.
  const wasVisible = useRef(false);
  useEffect(() => {
    if (visible && !wasVisible.current) {
      setDraft(toDraft(value));
      setCalendarOpen(false);
    }
    wasVisible.current = visible;
  }, [visible, value]);

  const parsed = useMemo(() => fromDraft(draft), [draft]);

  useEffect(() => {
    if (visible) onDraftChange?.(parsed);
  }, [visible, parsed, onDraftChange]);

  const set = (patch) => setDraft((prev) => ({ ...prev, ...patch }));

  const priceInvalid =
    parsed.minPrice !== undefined &&
    parsed.maxPrice !== undefined &&
    parsed.minPrice > parsed.maxPrice;
  const weightInvalid =
    parsed.minWeight !== undefined &&
    parsed.maxWeight !== undefined &&
    parsed.minWeight > parsed.maxWeight;
  const invalid = priceInvalid || weightInvalid;

  const openCalendar = () => {
    const current = draft.date ? fromDayString(draft.date) : new Date();
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: current,
        mode: "date",
        minimumDate: new Date(),
        onChange: (event, date) => {
          if (event.type === "set" && date) set({ date: toDayString(date) });
        },
      });
    } else {
      setCalendarOpen((open) => !open);
      if (!draft.date) set({ date: toDayString(current) });
    }
  };

  const dateLabel = draft.date
    ? fromDayString(draft.date).toLocaleDateString(language, {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : i18n.t("filter_any_date");

  const fieldBackground = isDark ? Colors.dark_4 : Colors.very_light_blue;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.background }]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={[styles.header, { borderBottomColor: theme.navTopBorder }]}>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={10}
            accessibilityLabel={i18n.t("close")}
          >
            <X size={24} color={theme.title} />
          </TouchableOpacity>
          <Text style={theme.textStyles.headerTitle}>{i18n.t("filters")}</Text>
          <TouchableOpacity
            onPress={() => setDraft(toDraft({ sort: value?.sort }))}
            hitSlop={10}
          >
            <Text style={styles.reset}>{i18n.t("filter_reset")}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {/* Trajet */}
          <Section title={i18n.t("filter_route")}>
            <View style={styles.routeRow}>
              <AirportPicker kind="from" value={draft.from} onChange={(from) => set({ from })} />
              <AirportPicker kind="to" value={draft.to} onChange={(to) => set({ to })} />
              <TouchableOpacity
                style={[
                  styles.swap,
                  { backgroundColor: theme.background_card, borderColor: theme.background },
                ]}
                onPress={() => set({ from: draft.to, to: draft.from })}
                accessibilityLabel={i18n.t("filter_swap")}
              >
                <ArrowLeftRight size={16} color={Colors.primary_color} />
              </TouchableOpacity>
            </View>
          </Section>

          {/* Date */}
          <Section title={i18n.t("filter_departure_date")}>
            <TouchableOpacity
              style={[styles.dateField, { backgroundColor: fieldBackground }]}
              onPress={openCalendar}
              activeOpacity={0.7}
            >
              <CalendarDays
                size={20}
                color={draft.date ? Colors.primary_color : theme.text}
              />
              <Text
                style={[
                  styles.dateText,
                  { color: draft.date ? theme.title : theme.text },
                ]}
              >
                {dateLabel}
              </Text>
              {draft.date ? (
                <TouchableOpacity
                  onPress={() => {
                    set({ date: undefined, flexDays: undefined });
                    setCalendarOpen(false);
                  }}
                  hitSlop={10}
                  accessibilityLabel={i18n.t("clear")}
                >
                  <X size={16} color={theme.text} />
                </TouchableOpacity>
              ) : null}
            </TouchableOpacity>

            {calendarOpen && draft.date ? (
              <DateTimePicker
                value={fromDayString(draft.date)}
                mode="date"
                display="inline"
                minimumDate={new Date()}
                locale={language}
                accentColor={Colors.primary_color}
                themeVariant={isDark ? "dark" : "light"}
                onChange={(event, date) => {
                  if (date) set({ date: toDayString(date) });
                }}
              />
            ) : null}

            {/* Peu de voyageurs partent exactement le bon jour : un filtre au
                jour près renvoie souvent une liste vide. */}
            {draft.date ? (
              <View style={styles.chips}>
                {FLEX_DAYS.map((days) => (
                  <Chip
                    key={days}
                    label={
                      days === 0
                        ? i18n.t("filter_exact_date")
                        : `± ${days} ${i18n.t(days === 1 ? "filter_day" : "filter_days")}`
                    }
                    selected={(draft.flexDays ?? 0) === days}
                    onPress={() => set({ flexDays: days || undefined })}
                  />
                ))}
              </View>
            ) : null}
          </Section>

          {/* Prix */}
          <Section title={i18n.t("filter_price_per_kg")}>
            <View style={styles.pair}>
              <AmountField
                label={i18n.t("filter_min")}
                unit={currencySymbol}
                value={draft.minPrice}
                onChangeText={(minPrice) => set({ minPrice })}
                invalid={priceInvalid}
                background={fieldBackground}
              />
              <AmountField
                label={i18n.t("filter_max")}
                unit={currencySymbol}
                value={draft.maxPrice}
                onChangeText={(maxPrice) => set({ maxPrice })}
                invalid={priceInvalid}
                background={fieldBackground}
              />
            </View>
            {priceInvalid ? (
              <Text style={styles.error}>{i18n.t("filter_min_above_max")}</Text>
            ) : null}
          </Section>

          {/* Poids */}
          <Section title={weightLabel}>
            <View style={styles.pair}>
              <AmountField
                label={i18n.t("filter_min")}
                unit="kg"
                value={draft.minWeight}
                onChangeText={(minWeight) => set({ minWeight })}
                invalid={weightInvalid}
                background={fieldBackground}
              />
              <AmountField
                label={i18n.t("filter_max")}
                unit="kg"
                value={draft.maxWeight}
                onChangeText={(maxWeight) => set({ maxWeight })}
                invalid={weightInvalid}
                background={fieldBackground}
              />
            </View>
            {weightInvalid ? (
              <Text style={styles.error}>{i18n.t("filter_min_above_max")}</Text>
            ) : null}
          </Section>

          {statusOptions ? (
            <Section title={i18n.t("filter_status")}>
              <View style={styles.chips}>
                <Chip
                  label={i18n.t("all_statuses")}
                  selected={!draft.status}
                  onPress={() => set({ status: undefined })}
                />
                {statusOptions.map((status) => (
                  <Chip
                    key={status}
                    label={i18n.t(status)}
                    selected={draft.status === status}
                    onPress={() => set({ status })}
                  />
                ))}
              </View>
            </Section>
          ) : null}
        </ScrollView>

        <View
          style={[
            styles.footer,
            {
              borderTopColor: theme.navTopBorder,
              backgroundColor: theme.background_card,
              paddingBottom: insets.bottom + 12,
            },
          ]}
        >
          <Button
            text={applyLabel ?? i18n.t("apply_filters")}
            disabled={invalid}
            style={invalid && styles.disabled}
            onPress={() => {
              onApply(parsed);
              onClose();
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Section({ title, children }) {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  return (
    <View style={styles.section}>
      <Text style={theme.textStyles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function AmountField({ label, unit, value, onChangeText, invalid, background }) {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  return (
    <View
      style={[
        styles.amount,
        { backgroundColor: background },
        invalid && { borderColor: Colors.error_color },
      ]}
    >
      <Text style={theme.textStyles.caption}>{label}</Text>
      <View style={styles.amountRow}>
        <TextInput
          style={[styles.amountInput, { color: theme.title }]}
          value={value}
          onChangeText={(text) => onChangeText(text.replace(/[^0-9.,]/g, ""))}
          keyboardType="decimal-pad"
          placeholder="—"
          placeholderTextColor={theme.text}
          maxLength={7}
        />
        <Text style={[styles.unit, { color: theme.text }]}>{unit}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  reset: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.primary_color,
  },
  content: {
    padding: 20,
    gap: 28,
  },
  section: {
    gap: 12,
  },
  routeRow: {
    flexDirection: "row",
    gap: 10,
  },
  swap: {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: 34,
    height: 34,
    marginLeft: -17,
    marginTop: -17,
    borderRadius: 17,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  dateField: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    height: 52,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    textTransform: "capitalize",
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pair: {
    flexDirection: "row",
    gap: 12,
  },
  amount: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    paddingVertical: 2,
  },
  unit: {
    fontSize: 15,
    fontWeight: "500",
  },
  error: {
    fontSize: 12,
    color: Colors.error_color,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  disabled: {
    opacity: 0.45,
  },
});
