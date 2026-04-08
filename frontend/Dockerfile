# Étape 1 : Build
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Étape 2 : Runtime
FROM node:20-alpine AS runtime
WORKDIR /app

# Copier uniquement les fichiers nécessaires
COPY --from=build /app/package*.json ./
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

# Installer uniquement les dépendances de production
RUN npm ci --omit=dev

EXPOSE 3000
CMD ["npm", "run", "start"]
