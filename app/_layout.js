import { Stack } from "expo-router";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import client from "@/lib/apolloClient";
import { ApolloProvider } from "@apollo/client/react";

export default function RootLayout() {
  return (
      <ApolloProvider client={client}>
        <LanguageProvider>
          <ThemeProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="edit-profile" />
              <Stack.Screen name="edit-listing" />
              <Stack.Screen name="transaction-detail" />
              <Stack.Screen name="profile-view" />
            </Stack>
          </ThemeProvider>
        </LanguageProvider>
      </ApolloProvider>
  );
}
