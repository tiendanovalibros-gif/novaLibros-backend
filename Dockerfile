# Usamos Node 22 (basado en Alpine que es muy liviano) cumpliendo con los requisitos de Prisma 7 y Nest 11
FROM node:22-alpine

# Creamos y nos movemos al directorio de la app dentro del contenedor
WORKDIR /usr/src/app

# Copiamos primero package.json y package-lock.json para aprovechar la caché de Docker
COPY package*.json ./
COPY prisma ./prisma/

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Generamos el Prisma Client (obligatorio para cada build o deploy)
RUN npx prisma generate

# Compilamos TypeScript a JavaScript
RUN npm run build

# Exponemos el puerto de NestJS (Si no se manda otro por variable de entorno)
EXPOSE 3012

# El comando por defecto cuando el contenedor inicie en producción
CMD ["npm", "run", "start:prod"]
