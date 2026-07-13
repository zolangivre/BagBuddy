# BagBuddy — mobile app

BagBuddy est une application mobile collaborative qui met en relation des voyageurs ayant de la place libre dans leurs bagages avec des utilisateurs souhaitant envoyer ou ramener des produits d'un autre pays.
Le principe est simple : chaque utilisateur peut, selon le moment, proposer des kilos disponibles (comme un vendeur) ou réserver des kilos (comme un acheteur).
L'application favorise la confiance, la transparence et la simplicité des échanges entre particuliers, à la manière de BlaBlaCar, Leboncoin ou Vinted.

Expo Router / React Native app. Voir aussi [../back](../back) pour le backend.

## Prérequis

- [Node.js](https://nodejs.org/) et npm
- [Xcode](https://developer.apple.com/xcode/) avec un simulateur iOS (recommandé, iOS 26+) — ou Android Studio pour un émulateur Android
- Le backend lancé en local ([../back/README.md](../back/README.md)) pour que login et données fonctionnent

## Setup

```bash
npm install
cp .env.example .env
```

Les valeurs par défaut de `.env.example` pointent directement vers le backend
local (`../back`) — si celui-ci tourne, aucune modification n'est nécessaire.

## Lancer l'app

```bash
npx expo start
```

- `i` → ouvrir sur le simulateur iOS (recommandé)
- `a` → ouvrir sur un émulateur Android
- `s` → basculer vers Expo Go
- scanner le QR code pour tester sur son propre appareil (avoir Expo Go installé)

La première fois (ou après un ajout de module natif), utilisez plutôt :
```bash
npm run ios      # ou npm run android
```
qui build et installe un dev client avant de lancer Metro.

## Se connecter

Une fois le backend démarré, connectez-vous avec le compte de test créé
automatiquement par Keycloak :

- **identifiant :** `testuser`
- **mot de passe :** `Test1234!`

## Autres commandes

```bash
npm run lint        # eslint
npx tsc --noEmit     # vérification des types
npx expo export --platform ios      # build de production (utilisé en CI)
npx expo export --platform android
```

Voir [CLAUDE.md](CLAUDE.md) pour le détail de l'architecture.
