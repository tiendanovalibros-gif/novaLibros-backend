# Diagrama de Clases - Arquitectura de novaLibros

Este documento detalla la estructura de clases del backend, incluyendo controladores, servicios y sus relaciones.

## Arquitectura de Módulos (Controladores y Servicios)

El sistema sigue una arquitectura de capas (Controller -> Service -> Prisma/DB). A continuación se muestran los métodos y atributos principales de cada módulo.

```mermaid
classDiagram
  class UsersController {
    +register(createUserDto)
    +registerAdmin(createUserDto)
    +login(loginDto)
    +getProfile(user)
    +findAll()
    +findOne(id)
    +update(id, updateUserDto)
    +remove(id)
  }
  
  class UsersService {
    +create(createUserDto)
    +createAdmin(createUserDto)
    +login(correo, contrasena)
    +findAll()
    +findOne(id)
    +update(id, updateUserDto)
    +remove(id)
  }

  class LibrosController {
    +create(createLibroDto)
    +findAll()
    +findOne(id)
    +update(id, updateLibroDto)
    +remove(id)
  }

  class LibrosService {
    +create(createLibroDto)
    +findAll()
    +findOne(id)
    +update(id, updateLibroDto)
    +remove(id)
  }

  class PedidosController {
    +create(createPedidoDto)
    +findAll()
    +findOne(id)
    +update(id, updatePedidoDto)
    +remove(id)
  }

  class PedidosService {
    +create(createPedidoDto)
    +findAll()
    +findOne(id)
    +update(id, updatePedidoDto)
    +remove(id)
  }

  class AutoresController {
    +create(createAutoreDto)
    +findAll()
    +findOne(id)
    +update(id, updateAutoreDto)
    +remove(id)
  }

  class AutoresService {
    +create(createAutoreDto)
    +findAll()
    +findOne(id)
    +update(id, updateAutoreDto)
    +remove(id)
  }

  class GenerosController {
    +create(createGeneroDto)
    +findAll()
    +findOne(id)
    +update(id, updateGeneroDto)
    +remove(id)
  }

  class GenerosService {
    +create(createGeneroDto)
    +findAll()
    +findOne(id)
    +update(id, updateGeneroDto)
    +remove(id)
  }

  class EmailService {
    +sendWelcomeEmail(nombre, correo)
    +sendEmail(options)
  }

  class PrismaService {
    +onModuleInit()
    +onModuleDestroy()
  }

  UsersController --> UsersService
  UsersService --> PrismaService
  UsersService --> EmailService
  LibrosController --> LibrosService
  LibrosService --> PrismaService
  PedidosController --> PedidosService
  PedidosService --> PrismaService
  AutoresController --> AutoresService
  AutoresService --> PrismaService
  GenerosController --> GenerosService
  GenerosService --> PrismaService
```

> Nota: Se han simplificado los tipos para mayor claridad. Todos los servicios utilizan PrismaService para acceso a datos.

## Modelo de Datos (Dominio)

```mermaid
classDiagram
  class Usuario {
    +String id
    +String email
  }
  class Libro {
    +String id
    +String titulo
  }
  class Pedido {
    +String id
    +DateTime fecha
  }
  class Inventario {
    +Int cantidad
  }
  
  Usuario "1" -- "*" Pedido
  Libro "1" -- "*" Inventario
```
