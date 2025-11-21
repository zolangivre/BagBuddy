# Étape 1 : build avec Gradle
FROM gradle:9-jdk17 AS build
WORKDIR /app

COPY . ./src

# Build du projet sans tests
RUN gradle build -x test --no-daemon

# Étape 2 : runtime léger
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copier le jar généré par Gradle depuis l'étape build
COPY --from=build /app/build/libs/*.jar app.jar

# Exposer le port de ton application
EXPOSE 8080

# Commande pour lancer l'application
ENTRYPOINT ["java", "-jar", "app.jar"]
