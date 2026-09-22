import { View } from "react-native";
import Colors from "@/theme/Colors";
import { globalStyles } from "@/theme/Styles";
import { useThemeContext } from "@/contexts/ThemeContext";
import { SafeActivityIndicator } from "@/components/SafeActivityIndicator";

/** Écran d'attente pleine page, le temps d'un premier chargement. */
export default function LoadingScreen() {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <View style={[globalStyles.centered, { backgroundColor: theme.background }]}>
      <SafeActivityIndicator />
    </View>
  );
}
