# Étape 1 : Build
FROM node:20-slim AS build
WORKDIR /app

# Installer dépendances système utiles (git, openssl, etc.)
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Copier uniquement les fichiers nécessaires pour installer les dépendances
COPY package*.json ./
RUN npm ci

# Copier le reste du code
COPY . .

# Construire l'application Next.js
RUN npm run build --webpack   # ⚠️ force Webpack si tu veux éviter Turbopack

# Étape 2 : Runtime
FROM node:20-slim AS runtime
WORKDIR /app

# Copier uniquement le build et les fichiers nécessaires
COPY --from=build /app/package*.json ./
COPY --from=build /app/.next ./.next
#COPY --from=build /app/public ./public

# Installer uniquement les dépendances de production
RUN npm ci --omit=dev

EXPOSE 3000
CMD ["npm", "run", "start"]
