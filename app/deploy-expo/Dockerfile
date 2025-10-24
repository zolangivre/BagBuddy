# Base Node
FROM node:20

# Crée le dossier de travail
WORKDIR /app

# Copie package.json et package-lock.json
COPY package*.json ./

# Installe les dépendances
RUN npm ci

# Copie le reste du code
COPY . .

# Expose le port du serveur Metro
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Lance Expo en mode développement
CMD ["npx", "expo", "start", "--tunnel", "--non-interactive"]
