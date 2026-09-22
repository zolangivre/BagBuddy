import { Stack } from "expo-router";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import client from "@/lib/apolloClient";
import { ApolloProvider } from "@apollo/client/react";
import { AuthProvider } from "@/contexts/AuthContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";

export default function RootLayout() {

  return (
    <ApolloProvider client={client}>
    <LanguageProvider>
      <ThemeProvider>
        <CurrencyProvider>
          <AuthProvider>
            {/* Sous AuthProvider : les favoris ne se lisent qu'avec un jeton. */}
            <FavoritesProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="edit-profile" />
                <Stack.Screen name="edit-listing" />
                <Stack.Screen name="transaction-detail" />
                <Stack.Screen name="profile-view" />
                <Stack.Screen name="favorites" />
                <Stack.Screen name="trip-alerts" />
                <Stack.Screen name="start" />
              </Stack>
            </FavoritesProvider>
          </AuthProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </LanguageProvider>
    </ApolloProvider>
  );
}
