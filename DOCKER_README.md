# Documentación y Uso de Docker 🐳

Hemos "dockerizado" la aplicación para solucionar problemas de versiones locales de NodeJS (requerido >=20.19) y librerías nativas o conflictos de caché con Prisma 7.

## Requisitos previos

Asegúrate de tener instalados en tu computadora actual:
- [Docker Engine o Docker Desktop](https://docs.docker.com/get-docker/)
- El demonio/servicio de Docker encendido y corriendo en segundo plano.

---

## Iniciar el Entorno de Desarrollo (Hot Reload 🔥)

Para programar en tu computadora con este backend NestJS, usa este comando en la raíz del proyecto para crear los contenedores e iniciar tu servidor de desarrollo con autorefresco:

```bash
docker compose up -d
```

> **Explicación:**
> - `-d` significa "detached", liberará la terminal en lugar de bloquearla.
> - El contenedor leerá automáticamente tu archivo `.env` por lo que tus credenciales privadas siempre estarán seguras y aplicadas.
> - Descargará una imagen de Linux aislada, instalará Todo con Node 22 generará Prisma y lanzará `npm run start:dev`.  

### Ver los logs de tu código

Si deseas ver la consola de NestJS (errores, consultas Prisma o `console.log()`):

```bash
docker compose logs -f
```

### Trabajar en el Código (TypeScript)

Gracias a la configuración de "Volumnes", puedes seguir editando `.ts` desde tu VS Code como te plazca. NestJS dentro del contenedor observará tus cambios fuera de él y el servidor se reiniciará automáticamente. No necesitas apagar el contenedor para probar tu nuevo código.

---

## Comandos Especiales

### Apagar el entorno local
```bash
docker compose down
```

### Reconstruir la imagen 
Si agregas nuevas dependencias en tu `package.json` (`npm install libreria`), deberás informar a Docker que su caché está obsoleta apagándolo y volviéndole a pedir que compile la imagen:

```bash
docker compose down
docker compose up --build -d
```

### Usar comandos Prisma (ej: migraciones de DB)
Si necesitas correr un comando de Prisma de manera local (como crear una nueva tabla), la mejor forma de hacerlo es enviando el comando directamente al contenedor de base de datos que ya tiene acceso y las versiones de paquetes correctas:

```bash
docker compose exec api npx prisma migrate dev --name <nombre_migracion>
```

```bash
docker compose exec api npx prisma generate
```

---

## 🚀 Despliegue en Railway

El despliegue con Railway ahora será muchísimo más robusto porque se basará en nuestro propio `Dockerfile` maestro y no en corazonadas de Nixpacks. 

Para configurar Railway ahora (si usas su opción de Docker):

1. En el panel de Railway de este backend, ve a *Settings* -> **Deploy**.
2. En la sección de Builders, asegúrate de que esté configurado como `Dockerfile`.
3. Ya no dependeremos de `railway.toml` para trucarlo con NodeJS, lo hemos superado.
4. Recuerda mantener tus variables `DATABASE_URL` y variables secretas en la sección `Variables`.
