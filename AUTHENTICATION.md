# 🔐 Sistema de Autenticación y Autorización

Este documento explica cómo funciona el sistema de autenticación JWT y cómo proteger endpoints en el backend.

## 📋 Componentes del Sistema

### 1. **Guards**

#### AuthGuard
Verifica que el usuario esté autenticado mediante un token JWT válido.

```typescript
import { AuthGuard } from '../common';

@UseGuards(AuthGuard)
@Get('protected')
protectedRoute() {
  return 'Solo usuarios autenticados pueden ver esto';
}
```

#### RolesGuard
Verifica que el usuario tenga los roles necesarios para acceder a un endpoint.

```typescript
import { AuthGuard, RolesGuard, Roles } from '../common';

@UseGuards(AuthGuard, RolesGuard)
@Roles('admin', 'vendedor')
@Get('admin-only')
adminRoute() {
  return 'Solo admins y vendedores pueden ver esto';
}
```

### 2. **Decorators**

#### @Public()
Marca un endpoint como público (no requiere autenticación).

```typescript
@Public()
@Post('login')
login(@Body() loginDto: LoginDto) {
  return this.authService.login(loginDto);
}
```

#### @Roles(...roles)
Define qué roles pueden acceder a un endpoint.

```typescript
@Roles('admin')
@Delete(':id')
deleteUser(@Param('id') id: string) {
  return this.usersService.remove(id);
}
```

#### @CurrentUser()
Obtiene el usuario actual desde el token JWT.

```typescript
@Get('profile')
getProfile(@CurrentUser() user: JwtPayload) {
  // user contiene: { sub: userId, correo: email, rol: role }
  return this.usersService.findOne(user.sub);
}

// También puedes obtener propiedades específicas:
@Get('my-email')
getEmail(@CurrentUser('correo') email: string) {
  return { email };
}
```

## 🛡️ Aplicar Guards a un Controller Completo

Puedes aplicar guards a nivel de controller para proteger todas las rutas:

```typescript
@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  // Todas las rutas están protegidas por defecto

  @Public() // Excepto las marcadas como públicas
  @Post('login')
  login() { ... }

  @Get() // Requiere autenticación
  findAll() { ... }

  @Roles('admin') // Requiere autenticación + rol admin
  @Delete(':id')
  remove() { ... }
}
```

## 🔑 Flujo de Autenticación

### 1. **Registro de Usuario**

```typescript
POST /users/register
Content-Type: application/json

{
  "dni": "1234567890",
  "nombre": "Juan",
  "apellido": "Pérez",
  "fechaNacimiento": "1995-06-15",
  "correo": "juan@email.com",
  "contrasenaHash": "MiContraseña123",
  "direccion": "Calle 123",
  "telefono": "3001234567",
  "rol": "cliente",
  "estadoCuenta": true
}
```

### 2. **Login**

```typescript
POST /users/login
Content-Type: application/json

{
  "correo": "juan@email.com",
  "contrasena": "MiContraseña123"
}

// Respuesta:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "uuid-here",
    "nombre": "Juan",
    "apellido": "Pérez",
    "correo": "juan@email.com",
    "rol": "cliente"
  }
}
```

### 3. **Usar el Token en Peticiones**

```typescript
GET /users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🌐 Ejemplo desde el Frontend (Next.js)

```typescript
// 1. Login y guardar token
const login = async (correo: string, contrasena: string) => {
  const res = await fetch('http://localhost:3012/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, contrasena }),
  });

  const data = await res.json();

  // Guardar token en localStorage
  localStorage.setItem('token', data.access_token);
  localStorage.setItem('user', JSON.stringify(data.usuario));

  return data;
};

// 2. Hacer peticiones autenticadas
const getProfile = async () => {
  const token = localStorage.getItem('token');

  const res = await fetch('http://localhost:3012/users/profile', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return res.json();
};

// 3. Verificar si el usuario está autenticado
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// 4. Cerrar sesión
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
```

## 🎯 Ejemplo: Proteger un Controller Completo

```typescript
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard, RolesGuard, Public, Roles, CurrentUser } from '../common';
import type { JwtPayload } from '../utils';

@UseGuards(AuthGuard, RolesGuard)
@Controller('productos')
export class ProductosController {

  @Public()
  @Get() // Listar productos (público)
  findAll() {
    return this.productosService.findAll();
  }

  @Roles('vendedor', 'admin')
  @Post() // Crear producto (solo vendedor/admin)
  create(@Body() dto: CreateProductoDto, @CurrentUser() user: JwtPayload) {
    return this.productosService.create(dto, user.sub);
  }

  @Roles('admin')
  @Delete(':id') // Eliminar producto (solo admin)
  remove(@Param('id') id: string) {
    return this.productosService.remove(id);
  }
}
```

## 🔒 Niveles de Protección

1. **Públic** - No requiere autenticación
   ```typescript
   @Public()
   @Get('public')
   ```

2. **Autenticado** - Requiere token válido
   ```typescript
   @Get('authenticated')
   ```

3. **Con Roles** - Requiere token + rol específico
   ```typescript
   @Roles('admin')
   @Get('admin-only')
   ```

4. **Validación Custom** - Lógica personalizada en el endpoint
   ```typescript
   @Get(':id')
   findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
     // Solo el dueño o admin puede ver
     if (user.rol !== 'admin' && owner.id !== user.sub) {
       throw new ForbiddenException();
     }
     return data;
   }
   ```

## 🚨 Manejo de Errores

- **401 Unauthorized**: Token no proporcionado o inválido
- **403 Forbidden**: Usuario autenticado pero sin permisos suficientes
- **404 Not Found**: Recurso no encontrado

## 💡 Mejores Prácticas

1. ✅ Siempre usa HTTPS en producción
2. ✅ Configura el tiempo de expiración del token apropiadamente
3. ✅ No almacenes información sensible en el token
4. ✅ Usa refresh tokens para sesiones prolongadas
5. ✅ Valida los datos de entrada en los DTOs
6. ✅ Implementa rate limiting para prevenir ataques
7. ✅ No expongas información sensible en los mensajes de error
