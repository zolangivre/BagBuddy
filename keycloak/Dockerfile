# Dockerfile pour Heroku
FROM docker.io/keycloak/keycloak:26.4.0

# Définir les variables d'environnement
ENV KC_BOOTSTRAP_ADMIN_USERNAME=admin
ENV KC_BOOTSTRAP_ADMIN_PASSWORD=password
ENV KC_HTTP_ENABLED=true
ENV KC_PROXY=edge
ENV KC_HOSTNAME_STRICT=false
ENV KC_HOSTNAME_STRICT_HTTPS=false

# Exposer le port HTTP
EXPOSE 8080

# Commande pour démarrer Keycloak en mode développement
CMD ["start-dev"]

