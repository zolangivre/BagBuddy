import { Stack, useRouter, useSegments } from "expo-router";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
// import client from "@/lib/apolloClient";
// import { ApolloProvider } from "@apollo/client/react";
import { AuthProvider } from "@/contexts/AuthContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { useEffect } from "react";

export default function RootLayout() {
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
      if (segments[0] === "redirect") {
        router.replace("/(tabs)/home");
      }
    }, [segments]);

  return (
    // <ApolloProvider client={client}>
    <LanguageProvider>
      <ThemeProvider>
        <CurrencyProvider>
          <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="edit-profile" />
            <Stack.Screen name="edit-listing" />
            <Stack.Screen name="transaction-detail" />
            <Stack.Screen name="profile-view" />
            <Stack.Screen name="start" />
          </Stack>
          </AuthProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </LanguageProvider>
    // </ApolloProvider>
  );
}
