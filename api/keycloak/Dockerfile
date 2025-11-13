
FROM quay.io/keycloak/keycloak:latest 

# Admin Keycloak 
ENV KC_BOOTSTRAP_ADMIN_USERNAME=admin 
ENV KC_BOOTSTRAP_ADMIN_PASSWORD=password

# HTTP & ports 
ENV KC_HTTP_ENABLED=false 
ENV KC_HTTP_PORT=8081
ENV KC_HOSTNAME_STRICT=false 
ENV KC_HOSTNAME_STRICT_HTTPS=false 
ENV KC_PROXY=edge 
ENV KC_HTTPS_REQUIRED=none

# Database configuration (PostgreSQL) 
ENV KC_DB=postgres 
ENV KC_DB_USERNAME=postgres
ENV KC_DB_PASSWORD=htakf5qhgi6lrslv
ENV KC_DB_URL_HOST=bagbuddy-keycloakdb-whfvsd
ENV KC_DB_URL_PORT=5432 
ENV KC_DB_URL_DATABASE=postgres 

# postgresql://postgres:3w1sdjbc7gj9d6kl@plantsit-db-causqe:5432/postgres

# Expose le port 8090 
EXPOSE 8081

# Commande pour démarrer Keycloak 
CMD ["start"] 
