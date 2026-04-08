# Étape 1 : Build
FROM node:20-alpine AS build
WORKDIR /app

# Copier uniquement les fichiers nécessaires pour installer les dépendances
COPY package*.json ./
RUN npm ci

# Copier le reste du code
COPY . .

# Construire l'application Next.js
RUN npm run build

# Étape 2 : Runtime minimal
FROM node:20-alpine AS runtime
WORKDIR /app

# Copier uniquement le build et les fichiers nécessaires
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

# Exposer le port
EXPOSE 3000

# Lancer Next.js en mode production
CMD ["npm", "run", "start"]
