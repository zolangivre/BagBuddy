# BagBuddy

BagBuddy est une application mobile collaborative qui met en relation des voyageurs ayant de la place libre dans leurs bagages avec des utilisateurs souhaitant envoyer ou ramener des produits d'un autre pays.
Le principe est simple : chaque utilisateur peut, selon le moment, proposer des kilos disponibles (comme un vendeur) ou réserver des kilos (comme un acheteur), à la manière de BlaBlaCar, Leboncoin ou Vinted.

## Structure du repo

- [`front/`](front) — application mobile (Expo Router / React Native)
- [`back/`](back) — microservices backend (Spring Boot) + Keycloak, via Docker Compose

## Tester l'application en local

Deux terminaux, dans cet ordre :

**1. Backend** — voir [back/README.md](back/README.md) pour le détail
```bash
cd back
cp .env.example .env   # remplir avec des mots de passe locaux au choix
docker compose -f docker-compose.dev.yml up --build -d
```

**2. App mobile** — voir [front/README.md](front/README.md) pour le détail
```bash
cd front
npm install
cp .env.example .env   # fonctionne tel quel contre le backend local
npx expo start
```
Puis `i` pour ouvrir le simulateur iOS (recommandé).

**3. Se connecter** avec le compte de test créé automatiquement :
- identifiant : `testuser`
- mot de passe : `Test1234!`

C'est tout — pas de configuration manuelle de Keycloak ni de base de données nécessaire.
