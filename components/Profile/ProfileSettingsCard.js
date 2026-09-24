import { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from "react-native";
import { Moon, Sun, LogOut, Languages, CurrencyIcon } from "lucide-react-native";
import Colors from "@/theme/Colors";
import { globalStyles } from "@/theme/Styles";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { AuthContext } from "@/contexts/AuthContext";

/** Deux ou trois choix exclusifs sous forme de pastilles (langue, devise). */
function SegmentedChoice({ options, value, onChange }) {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  return (
    <View style={styles.options} accessibilityRole="radiogroup">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <TouchableOpacity
            key={option.value}
            style={[styles.option, selected && styles.selectedOption]}
            onPress={() => onChange(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={option.accessibilityLabel}
          >
            <Text
              style={[theme.textStyles.bodyMedium, selected && styles.selectedText]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/** Réglages de l'onglet profil : thème, langue, devise et déconnexion. */
export default function ProfileSettingsCard() {
  const { theme: colorScheme, toggleTheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const isDark = colorScheme === "dark";
  const { language, changeLanguage, i18n } = useLanguage();
  const { currency, changeCurrency } = useCurrency();
  const { signOut } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert(i18n.t("log_out"), i18n.t("are_you_sure_you_want_to_log_out"), [
      { text: i18n.t("cancel"), style: "cancel" },
      {
        text: i18n.t("log_out"),
        // signOut ramène lui-même à /start.
        onPress: () => signOut(),
        style: "destructive",
      },
    ]);
  };

  return (
    <View style={[globalStyles.card, { backgroundColor: theme.background_card }]}>
      <View style={styles.header}>
        <Text style={theme.textStyles.cardTitle}>{i18n.t("settings")}</Text>
      </View>
      <View style={{ gap: 20 }}>
        <View style={styles.row}>
          {isDark ? (
            <Moon size={24} color={Colors.primary_color} />
          ) : (
            <Sun size={24} color={Colors.primary_color} />
          )}
          <View style={{ flexDirection: "column", flex: 1 }}>
            <Text style={theme.textStyles.sectionTitle}>{i18n.t("dark_mode")}</Text>
            <Text style={theme.textStyles.bodyMedium}>
              {i18n.t("toggle_dark_mode")}
            </Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isDark ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleTheme}
            value={isDark}
            accessibilityLabel={i18n.t("dark_mode")}
          />
        </View>
        <View style={styles.row}>
          <Languages size={24} color={Colors.primary_color} />
          <Text style={[theme.textStyles.sectionTitle, { flex: 1 }]}>
            {i18n.t("change_language")}
          </Text>
          <SegmentedChoice
            value={language}
            onChange={changeLanguage}
            options={[
              { value: "en", label: "EN", accessibilityLabel: "English" },
              { value: "fr", label: "FR", accessibilityLabel: "Français" },
            ]}
          />
        </View>
        <View style={styles.row}>
          <CurrencyIcon size={24} color={Colors.primary_color} />
          <Text style={[theme.textStyles.sectionTitle, { flex: 1 }]}>
            {i18n.t("change_currency")}
          </Text>
          <SegmentedChoice
            value={currency}
            onChange={changeCurrency}
            options={[
              { value: "USD", label: "$", accessibilityLabel: "USD" },
              { value: "EUR", label: "€", accessibilityLabel: "EUR" },
            ]}
          />
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          style={[styles.row, { justifyContent: "flex-start" }]}
          accessibilityRole="button"
        >
          <LogOut size={24} color={Colors.red} />
          <Text style={[theme.textStyles.sectionTitle, { color: Colors.red }]}>
            {i18n.t("log_out")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    justifyContent: "space-between",
  },
  options: { flexDirection: "row", gap: 10 },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.tertiary_color,
    borderRadius: 12,
  },
  selectedOption: {
    backgroundColor: Colors.primary_color,
    borderColor: Colors.primary_color,
  },
  selectedText: { color: Colors.white },
});
