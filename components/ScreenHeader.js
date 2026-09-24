import { View, Text, StyleSheet } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";
import ButtonIcon from "@/components/ButtonIcon";
import Colors from "@/theme/Colors";
import { globalStyles } from "@/theme/Styles";
import { useThemeContext } from "@/contexts/ThemeContext";
import i18n from "@/i18n";

/**
 * En-tête des écrans empilés : retour, titre, et une action facultative à
 * droite. `globalStyles.header` en porte déjà le cadre ; ce composant réunit ce
 * que les écrans répétaient autour.
 */
export default function ScreenHeader({ title, onBack, right = null }) {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <View
      style={[
        globalStyles.header,
        {
          backgroundColor: theme.background_card,
          borderBottomColor: theme.navTopBorder,
        },
      ]}
    >
      <View style={styles.left}>
        <ButtonIcon
          onPress={onBack ?? (() => router.back())}
          icon={<ArrowLeft size={20} color={theme.title} />}
          accessibilityLabel={i18n.t("a11y_back")}
        />
        <View style={styles.title}>
          <Text style={theme.textStyles.sectionTitle}>{title}</Text>
        </View>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  title: {
    flex: 1,
  },
});
