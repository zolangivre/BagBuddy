# BagBuddy-backend

# Setup with docker compose

Run this to launch microservices and databases (in development)
```bash
docker compose -f docker-compose.dev.yml up --build -d
```

If you want to restart the containers after modifications run
```bash
docker compose -f docker-compose.dev.yml restart #microservice_name
```

If you want to delete all the microservices and databases
```bash
docker compose -f docker-compose.dev.yml down -v
```
! don't forget to add microservices to modify docker compose and a Dockerfile when you create ones
! also fill the .env file with credentials (copy `.env.example` to `.env`)

Keycloak (`http://localhost:8000`) auto-imports the `bagbuddy` realm from
`keycloak/import/bagbuddy-realm.json` on startup — client `bagbuddy-mobile`
(used by the front app) and a seeded test user are ready immediately:
- username: `testuser`
- password: `Test1234!`

Admin console: `http://localhost:8000/admin` (`KEYCLOAK_ADMIN` / `KEYCLOAK_ADMIN_PASSWORD` from `.env`)
