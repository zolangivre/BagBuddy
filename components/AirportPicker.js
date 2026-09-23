import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { Search, X, PlaneTakeoff, PlaneLanding } from "lucide-react-native";
import Colors from "@/theme/Colors";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { AIRPORT } from "@/constants/airports";

const BY_CODE = new Map(AIRPORT.map((airport) => [airport.value, airport]));

// Proposés avant toute saisie : les liaisons les plus courantes de la diaspora
// que BagBuddy sert, plutôt qu'une liste alphabétique de 7 000 aéroports.
const POPULAR = ["CDG", "ORY", "JFK", "YUL", "DSS", "CMN", "ALG", "TUN", "ABJ", "LHR"]
  .map((code) => BY_CODE.get(code))
  .filter(Boolean);

function search(query) {
  const q = query.trim().toLowerCase();
  if (!q) return POPULAR;
  const exact = [];
  const rest = [];
  for (const airport of AIRPORT) {
    if (airport.value.toLowerCase() === q) exact.push(airport);
    else if (
      airport.value.toLowerCase().startsWith(q) ||
      airport.city.toLowerCase().includes(q) ||
      airport.name.toLowerCase().includes(q) ||
      airport.country.toLowerCase().includes(q)
    )
      rest.push(airport);
    if (exact.length + rest.length >= 60) break;
  }
  return [...exact, ...rest];
}

/**
 * Champ de départ ou d'arrivée : code IATA en gros, ville en dessous, et une
 * feuille de recherche plein écran (ville, aéroport, pays ou code).
 */
export default function AirportPicker({ kind, value, onChange }) {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const isDark = colorScheme === "dark";
  const { i18n } = useLanguage();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const results = useMemo(() => search(query), [query]);

  const Icon = kind === "from" ? PlaneTakeoff : PlaneLanding;
  const airport = value ? BY_CODE.get(value) : null;
  const fieldBackground = isDark ? Colors.dark_4 : Colors.very_light_blue;

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.field, { backgroundColor: fieldBackground }]}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={i18n.t(kind === "from" ? "filter_from" : "filter_to")}
      >
        <Icon size={18} color={value ? Colors.primary_color : theme.text} />
        <View style={styles.fieldText}>
          <Text style={theme.textStyles.caption}>
            {i18n.t(kind === "from" ? "filter_from" : "filter_to")}
          </Text>
          {value ? (
            <>
              <Text style={[styles.code, { color: theme.title }]}>{value}</Text>
              <Text style={theme.textStyles.caption} numberOfLines={1}>
                {airport?.city ?? ""}
              </Text>
            </>
          ) : (
            <Text style={[styles.placeholder, { color: theme.text }]}>
              {i18n.t("filter_anywhere")}
            </Text>
          )}
        </View>
        {value ? (
          <TouchableOpacity
            onPress={() => onChange(undefined)}
            hitSlop={10}
            accessibilityLabel={i18n.t("clear")}
          >
            <X size={16} color={theme.text} />
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>

      <Modal
        visible={open}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={close}
      >
        <View style={[styles.sheet, { backgroundColor: theme.background }]}>
          <View style={styles.sheetHeader}>
            <Text style={theme.textStyles.headerTitle}>
              {i18n.t(kind === "from" ? "filter_pick_from" : "filter_pick_to")}
            </Text>
            <TouchableOpacity onPress={close} hitSlop={10}>
              <Text style={styles.cancel}>{i18n.t("cancel")}</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.searchBox, { backgroundColor: fieldBackground }]}>
            <Search size={18} color={theme.text} />
            <TextInput
              style={[styles.searchInput, { color: theme.title }]}
              placeholder={i18n.t("filter_airport_search")}
              placeholderTextColor={theme.text}
              value={query}
              onChangeText={setQuery}
              autoFocus
              autoCorrect={false}
              returnKeyType="search"
            />
            {query ? (
              <TouchableOpacity onPress={() => setQuery("")} hitSlop={10}>
                <X size={16} color={theme.text} />
              </TouchableOpacity>
            ) : null}
          </View>

          {!query ? (
            <Text style={[theme.textStyles.caption, styles.sectionLabel]}>
              {i18n.t("filter_popular_airports")}
            </Text>
          ) : null}

          <FlatList
            data={results}
            keyExtractor={(item) => item.value}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            ListEmptyComponent={
              <Text style={[theme.textStyles.bodyMedium, styles.empty]}>
                {i18n.t("filter_no_airport")}
              </Text>
            }
            renderItem={({ item }) => {
              const selected = item.value === value;
              return (
                <TouchableOpacity
                  style={[
                    styles.row,
                    { borderBottomColor: theme.navTopBorder },
                    selected && { backgroundColor: Colors.dark_cyan_translucent },
                  ]}
                  onPress={() => {
                    onChange(item.value);
                    close();
                  }}
                >
                  <View style={styles.codeBadge}>
                    <Text style={styles.codeBadgeText}>{item.value}</Text>
                  </View>
                  <View style={styles.rowText}>
                    <Text
                      style={[styles.rowTitle, { color: theme.title }]}
                      numberOfLines={1}
                    >
                      {item.city}
                    </Text>
                    <Text style={theme.textStyles.caption} numberOfLines={1}>
                      {item.name} · {item.country}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    flex: 1,
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  fieldText: {
    flex: 1,
    minWidth: 0,
  },
  code: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  placeholder: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 2,
  },
  sheet: {
    flex: 1,
    paddingTop: 20,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  cancel: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.primary_color,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 20,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
  sectionLabel: {
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginTop: 20,
    marginBottom: 4,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  codeBadge: {
    width: 52,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: Colors.dark_cyan_translucent,
  },
  codeBadgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.primary_color,
  },
  rowText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  empty: {
    textAlign: "center",
    padding: 32,
  },
});
