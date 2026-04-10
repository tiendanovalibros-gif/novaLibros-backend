# Usamos un mirror publico de Node para evitar timeouts de Docker Hub en algunas redes.
ARG NODE_BASE_IMAGE=public.ecr.aws/docker/library/node:22-alpine
FROM ${NODE_BASE_IMAGE}

# Creamos y nos movemos al directorio de la app dentro del contenedor
WORKDIR /usr/src/app

# Copiamos primero package.json y package-lock.json para aprovechar la caché de Docker
COPY package*.json ./
COPY prisma ./prisma/

# Instalamos las dependencias

RUN npm install --legacy-peer-deps

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

