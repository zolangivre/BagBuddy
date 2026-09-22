# BagBuddy — application mobile

BagBuddy est une application mobile collaborative qui met en relation des voyageurs ayant de la place libre dans leurs bagages avec des utilisateurs souhaitant envoyer ou ramener des produits d'un autre pays.
Le principe est simple : chaque utilisateur peut, selon le moment, proposer des kilos disponibles (comme un vendeur) ou réserver des kilos (comme un acheteur).
L'application favorise la confiance, la transparence et la simplicité des échanges entre particuliers, à la manière de BlaBlaCar, Leboncoin ou Vinted.

Ce repo contient **uniquement l'application mobile** (Expo Router / React Native).
Le backend (microservices Spring Boot + Keycloak) vit dans un repo séparé :
[zolangivre/bagbuddy-back](https://github.com/zolangivre/bagbuddy-back).

## Prérequis

- [Node.js](https://nodejs.org/) et npm
- [Xcode](https://developer.apple.com/xcode/) avec un simulateur iOS (recommandé, iOS 26+) — ou Android Studio pour un émulateur Android
- Le backend lancé en local (voir ci-dessous) pour que le login et les données fonctionnent

## Lancer le backend

Dans un dossier voisin, une seule fois :

```bash
git clone git@github.com:zolangivre/bagbuddy-back.git
cd bagbuddy-back
cp .env.example .env   # remplir avec des mots de passe locaux au choix
docker compose -f docker-compose.dev.yml up --build -d
```

Voir le README de `bagbuddy-back` pour le détail.

## Setup de l'app

```bash
npm install
cp .env.example .env
```

Les valeurs par défaut de `.env.example` pointent directement vers le backend
local — si celui-ci tourne, aucune modification n'est nécessaire.

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

Une fois le backend démarré, les comptes de test sont créés automatiquement par
Keycloak. Tous ont le mot de passe **`Test1234!`** :

- `testuser` — compte vierge, pour tester le parcours d'un nouvel inscrit
- `camille.martin@bagbuddy.local`, `lea.fontaine@bagbuddy.local`, etc. — comptes
  pré-remplis avec annonces, réservations et avis (liste complète dans le README
  de `bagbuddy-back`)

## Autres commandes

```bash
npm run lint        # eslint
npx tsc --noEmit     # vérification des types
npx expo export --platform ios      # build de production (utilisé en CI)
npx expo export --platform android
```

Voir [CLAUDE.md](CLAUDE.md) pour le détail de l'architecture.
