# BagBuddy — backend

Spring Boot microservices (Eureka, API gateway, trip/transaction/review/stripe
services) plus Keycloak for authentication, all orchestrated with Docker
Compose for local development.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) running

## Setup

```bash
cp .env.example .env
```

Fill in `.env` with any local passwords you like (these only exist inside
your local Postgres/Keycloak containers, never sent anywhere external — see
the comments in `.env.example` for what each value is for).

## Run everything

```bash
docker compose -f docker-compose.dev.yml up --build -d
```

First run downloads/builds every image, so it can take a few minutes. Once
it's up, all of this is ready with no further setup:

| Service            | URL                              |
| ------------------ | --------------------------------- |
| API gateway         | http://localhost:8080             |
| Keycloak            | http://localhost:8000             |
| Keycloak admin console | http://localhost:8000/admin (`KEYCLOAK_ADMIN` / `KEYCLOAK_ADMIN_PASSWORD` from `.env`) |
| Eureka dashboard    | http://localhost:8761             |
| trip-service         | http://localhost:8082             |
| transaction-service  | http://localhost:8083             |
| review-service       | http://localhost:8084             |

Keycloak auto-imports the `bagbuddy` realm from
`keycloak/import/bagbuddy-realm.json` on every startup — the `bagbuddy-mobile`
client (used by the [front app](../front)) and a seeded test account are
ready immediately, no manual Keycloak configuration needed:

- **username:** `testuser`
- **password:** `Test1234!`

`stripe-service` is defined but commented out in `docker-compose.dev.yml` —
it needs real `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` test keys in
`.env` to be useful. Uncomment its block once you have them.

## Everyday commands

Restart one service after code changes:
```bash
docker compose -f docker-compose.dev.yml restart <service_name>
```

Tear everything down (add `-v` to also wipe the databases and start fully fresh):
```bash
docker compose -f docker-compose.dev.yml down -v
```

## Adding a new microservice

Don't forget to add a Dockerfile and a matching service block in
`docker-compose.dev.yml` when you create one.
