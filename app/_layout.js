import { Stack } from "expo-router";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

export default function RootLayout() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="edit-profile" />
          <Stack.Screen name="edit-listing" />
          <Stack.Screen name="transaction-detail" />
        </Stack>
      </ThemeProvider>
    </LanguageProvider>
  );
}
