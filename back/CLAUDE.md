# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Spring Boot microservices backend for BagBuddy (see [../front](../front) for the mobile app it serves). Each service is an independent Maven project (Java 17, Spring Boot 3.5.6, own Postgres database) under its own directory: `eurekaserver`, `apigateway`, `tripservice`, `transactionservice`, `reviewservice`, `stripeservice`, `userservice`. Auth is handled by Keycloak (not by any of these services directly).

## Commands

Local dev runs everything through Docker Compose — see [README.md](README.md) for the full setup/testing walkthrough. Quick reference:

```bash
cp .env.example .env                                   # fill in local DB/Keycloak passwords
docker compose -f docker-compose.dev.yml up --build -d # start everything
docker compose -f docker-compose.dev.yml restart <service_name>
docker compose -f docker-compose.dev.yml down -v        # wipe DBs and start fresh
```

Per-service, outside Docker (each service has its own Maven wrapper):
```bash
cd tripservice        # or transactionservice / reviewservice / stripeservice / userservice / apigateway / eurekaserver
./mvnw spring-boot:run
./mvnw test
./mvnw clean package
```
Running a service this way still needs its Postgres DB and `DATABASE_URL`/`PORT` env vars — either keep the rest of the stack up via docker-compose and only rebuild+restart the one service you're iterating on, or export the same env vars docker-compose would (see the service's block in `docker-compose.dev.yml`).

`docker-compose.yml` (no `.dev` suffix) exists alongside `docker-compose.dev.yml` but is not the one used for local dev — check it before assuming it's current if you need it.

## Architecture

### Service layout

Every service follows the same layered package structure: `controller/` (REST endpoints, `@RequestMapping` per resource) → `service/` (business logic) → `repository/` (Spring Data JPA) → `model/` (JPA entities). Controllers are thin; look in `service/` for actual logic.

### Routing: static URLs, not service discovery

`eurekaserver` runs but is effectively inert — its `application.yaml` sets `register-with-eureka: false` and `fetch-registry: false`, and each downstream service's own Eureka client config is commented out (leftover from an earlier Heroku-hosted setup, see the dead `*.herokuapp.com` hostnames in `eurekaserver`/`*service` `application.yml` files). Actual routing goes through `apigateway`'s Spring Cloud Gateway config (`apigateway/src/main/resources/application.yaml`), which maps path prefixes to **literal** service URLs read from env vars:

```
/trips/**        -> ${TRIP_SERVICE_URL}
/transactions/** -> ${TRANSACTION_SERVICE_URL}
/reviews/**      -> ${REVIEW_SERVICE_URL}
/stripe/**       -> ${STRIPE_SERVICE_URL}
```

Those env vars are set on the `api-gateway` container in `docker-compose.dev.yml` to the other containers' docker-compose service names (e.g. `http://trip-service:8082`). There is no `/users/**` route — `userservice` is not wired into the gateway and is disabled by default in `docker-compose.dev.yml`; the front app talks to Keycloak directly for identity (`/userinfo`) instead.

Each service also hardcodes its own `server.port` default to `8082` in `application.yml` regardless of which service it is — this only works in Docker because `docker-compose.dev.yml` overrides it per-container with an explicit `PORT` env var. Don't remove those `PORT` overrides or add a new service without one.

### Data model: front-owned state machine, denormalized user/listing info

`Transaction.sellerStatus` / `buyerStatus` are plain unvalidated `String` columns — the service layer's `update()` just overwrites whatever the caller sends. The actual state machine (allowed statuses, valid transitions) lives entirely in the front app's `TRANSACTION_STATUS` enum (`../front/constants/transaction-status.js`); the backend does not enforce it. Keep the two in sync by hand when adding a status.

`Trip`, `Transaction`, and `Review` all embed snapshots of user info (`@Embeddable UserInfo`: email, name, phone, bio, etc., keyed by Keycloak `sub`) and, for transactions, listing info (`@Embeddable ListingInfo`) directly on the record via `@Embedded`/`@AttributeOverrides`, rather than joining to a users table — there is no shared user table these services read from. `userservice` (currently unused/disabled) is the only service with its own `User` JPA entity.

`Trip.active` is computed automatically in `TripListener` (a JPA `@PrePersist`/`@PreUpdate` entity listener), based on `remainingWeight > 0` and `departureDate` being in the future — don't set it directly, update `remainingWeight`/`departureDate` instead.

### Auth

Keycloak is not called by any of these services in the current routing config — the mobile app authenticates directly against Keycloak (OIDC/PKCE) and calls the gateway with a bearer token, but none of the active services validate it (no Spring Security resource-server config wired in as of now). `userservice/config/KeycloakConfig.java` exists for admin-API access (creating/managing Keycloak users server-side) but that service isn't part of the routed stack.

The local Keycloak realm (`bagbuddy` realm, `bagbuddy-mobile` public client with PKCE, a seeded `testuser`/`Test1234!` account) auto-imports from `keycloak/import/bagbuddy-realm.json` on every `docker compose up` — see [README.md](README.md). That file is the source of truth for local Keycloak config; edit it (or re-export after changing the realm via the admin console) rather than reconfiguring Keycloak by hand each time.

### Payments

`stripeservice` wraps the Stripe Java SDK (`create-payment-intent`, `/stripe/config` for the publishable key). It's commented out in `docker-compose.dev.yml` by default since it needs real Stripe test keys (`STRIPE_SECRET_KEY`/`STRIPE_PUBLISHABLE_KEY` in `.env`) to be useful — uncomment its block once you have them.

### Deployment

Each service has a `Procfile` and `system.properties` (Heroku buildpack config) alongside its `Dockerfile` — this backend has historically been deployed to Heroku (see hardcoded `*.herokuapp.com` hostnames mentioned above), separate from the Docker Compose path used for local dev.
