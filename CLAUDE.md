# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

BagBuddy is an Expo Router (React Native) mobile app that connects travelers with spare luggage space to people who want to send/bring back items from abroad — a peer-to-peer marketplace similar to BlaBlaCar/Leboncoin/Vinted, but for luggage space. Each user can act as a seller (offering kilos) or a buyer (reserving kilos). The app talks to a GraphQL backend and a Keycloak instance for auth, both of which live in a separate repo: [bagbuddy-back](https://github.com/zolangivre/bagbuddy-back). This repo contains the mobile app only.

The codebase is JavaScript (not TypeScript) despite `strict: true` in tsconfig — type checking in CI only checks the handful of files explicitly listed in `tsconfig.json`'s `include` array, not the whole `app/` and `components/` tree.

## Commands

```bash
npm install
npx expo start          # dev server; press i (iOS sim), a (Android), s (Expo Go), or scan QR
npm run ios              # expo run:ios
npm run android          # expo run:android
npm run web               # expo start --web
npm run lint              # expo lint (eslint-config-expo flat config)
npx tsc --noEmit          # type check (only files listed in tsconfig.json "include")
npx expo export --platform ios      # production export, used in CI
npx expo export --platform android  # production export, used in CI
```

CI (`.github/workflows/ci.yaml`) runs on push/PR to `main`: install → `tsc --noEmit` → `npm run lint` → `expo export` for iOS and Android. Match this locally before pushing.

### E2E tests (Detox, iOS simulator only)

```bash
xcodebuild -workspace ios/BagBuddy.xcworkspace -scheme BagBuddy -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build
npx detox test --configuration ios.sim.debug
```

Detox config lives in `package.json` (`"detox"` key) and targets an "iPhone 17 Pro" simulator. Test files live in `e2e/*.e2e.js` and are picked up via `e2e/jest.config.js` (`testMatch: **/*.e2e.js`).

### Environment variables

The app reads `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_KEYCLOAK_URL`, and `EXPO_PUBLIC_KEYCLOAK_CLIENT_ID` from `.env` (gitignored). Copy `.env.example` to `.env` — its defaults point at the local backend. These must be set for auth and data fetching to work locally.

## Architecture

### Routing (Expo Router, file-based)

- `app/_layout.js` is the root: wraps everything in `ApolloProvider` → `LanguageProvider` → `ThemeProvider` → `CurrencyProvider` → `AuthProvider`, then a `Stack` with `headerShown: false`.
- `app/index.js` immediately redirects to `/start`.
- `app/(tabs)/` is the authenticated tab group (`home`, `transactions`, `profile`), gated by `AuthContext.state.isSignedIn` in `(tabs)/_layout.js` (redirects to `/login` if signed out).
- Top-level routes outside the tab group (`edit-profile.js`, `edit-listing.js`, `transaction-detail.js`, `profile-view.js`, `all-listing.js`, `all-reviews.js`, `start.js`) are pushed on top of the tab stack.

**Tab bar is platform-specific**, implemented directly inside `app/(tabs)/_layout.js`:
- iOS uses `expo-router/unstable-native-tabs` (`NativeTabs`) with SF Symbols.
- Android renders `HomeScreen`/`TransactionsScreen`/`ProfileScreen` manually inside a custom `AndroidTabBar` view (no native tab navigator), tracked via local `activeTab` state instead of router-driven navigation.

When changing tab navigation, both branches must be updated in sync — they're independent implementations, not a shared abstraction.

### Auth (`contexts/AuthContext.js`)

OAuth2/OIDC PKCE flow against Keycloak via `expo-auth-session`, not Firebase/Auth0/Supabase:
- `useAuthRequest` + `useAutoDiscovery` against `EXPO_PUBLIC_KEYCLOAK_URL`.
- On successful redirect, exchanges the auth code for tokens manually via `fetch` to `/protocol/openid-connect/token`.
- `getValidAccessToken()` is the accessor other code should call before hitting the API — it checks `isTokenExpired` (`utils/jwt.js`, via `jwt-decode`) and transparently refreshes using the stored `refreshToken` if needed, signing the user out on refresh failure.
- User profile info is fetched separately from the Keycloak `/userinfo` endpoint into `authState.userInfo` (has `.sub` as the user id, used throughout the app to scope queries). Note its fields are Keycloak's snake_case (`given_name`, `email_verified`), unlike the GraphQL schema's camelCase — do not mix the two up.
- `AuthProvider` registers `getValidAccessToken` with `lib/authToken.js`, which is how the Apollo link — living outside React — gets a fresh bearer on every request.

### Theming (`theme/`, `contexts/ThemeContext.js`)

- `ThemeContext` tracks `"light"`/`"dark"` sourced from `Appearance.getColorScheme()` with a live listener; no manual toggle persisted to storage.
- `theme/Colors.js` exports a default object with flat brand/status colors (used unprefixed, e.g. `Colors.primary_color`) plus `Colors.light` / `Colors.dark` sub-objects containing scheme-specific values and a nested `textStyles` map (e.g. `theme.textStyles.titleMedium`) built from `theme/Fonts.js` typography tokens. Components resolve the active palette as `Colors[colorScheme] ?? Colors.light`.
- Status-badge colors (per `TRANSACTION_STATUS`, see below) are defined as flat keys directly on the `Colors` default export (`*_badge_background` / `*_badge_border`), not inside `light`/`dark`.

### i18n (`i18n/`, `contexts/LanguageContext.js`)

- Uses `i18n-js` with `en`/`fr` dictionaries in `i18n/translations/`. Locale is detected from `expo-localization` on first launch, then persisted to `AsyncStorage` (`appLanguage` key) and reused on subsequent launches.
- `LanguageProvider` blocks rendering (`return null`) until `initI18n()` resolves, so consumers can assume `i18n` is ready.
- Access translations via `useLanguage()` → `{ i18n }` → `i18n.t("key")`, not a global import, so components re-render on language change.

### Currency (`contexts/CurrencyContext.js`)

Formats amounts via `Intl.NumberFormat`. Exchange-rate fetching from `exchangerate.host` is present but currently commented out in favor of a hardcoded `rates` fallback — check whether this has been re-enabled before assuming live rates are used.

### Transaction status state machine

`constants/transaction-status.js` defines `TRANSACTION_STATUS`, a single enum shared by both buyer- and seller-side flows (e.g. `WAITING_FOR_RESPONSE_BUYER` vs `WAITING_FOR_RESPONSE_SELLER`, both rendered by the same `WaitingForResponseContent`). `components/TransactionDetailComponents/Content.js` is the single switch statement dispatching status → presentational component (`BrowseListingContent`, `PaymentRequiredContent`, `ConfirmedContent`, etc., all in the same directory). When adding a new transaction status, it must be added to the enum, the `TRANSACTION_STATUS_LABELS` map, and a `case` in `Content.js`.

### Data fetching pattern

Screens use Apollo hooks (`useQuery` / `useMutation` from `@apollo/client/react`) against documents declared in `lib/graphql/`. The backend is not a federated schema but **one schema per service**, each served under its own prefix by the gateway, so every operation must name its destination in its context:

```js
const { data } = useQuery(ACTIVE_TRIPS, { context: withEndpoint("trips") });
```

`withEndpoint` (`lib/apolloClient.js`) accepts `trips`, `transactions`, `reviews`, `users` and `stripe`; an operation sent without one throws rather than hitting an invalid URL. The bearer token is attached by the link, so screens never handle it.

Two things follow from GraphQL that REST did not impose, and are the usual cause of a field coming back `undefined` after a change: a field that is not in the selection is simply absent (see the shared selections in `lib/graphql/fragments.js`), and an input field the schema does not declare is a `ValidationError`, not a silently ignored extra — which is why mutations build their input explicitly (`toTripInput`, `toTransactionUpdateInput`) instead of spreading the whole object.

Server-owned state is never written by the client: prices and totals are computed from the listing, `remainingWeight` follows the listing's total (and is released or reserved by transaction transitions), and `paidAt` / `stripeAmount` are written only by the signed Stripe webhook.

`axios` remains only for calls that do not go to the backend: Keycloak's `/userinfo` and token refresh, and the external flight lookup in `components/FlightInputModal.js`.

### Path aliasing

`@/*` maps to the repo root (configured in `tsconfig.json` and `babel-plugin-module-resolver`), e.g. `import Colors from "@/theme/Colors"`. Use this instead of relative `../../` imports.
