import { Stack } from "expo-router";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
// import client from "@/lib/apolloClient";
// import { ApolloProvider } from "@apollo/client/react";
import { AuthProvider } from "@/contexts/AuthContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";

export default function RootLayout() {
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
