import {
  CanActivate,
  ExecutionContext,
  INestApplication,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { TiendasController } from '../src/tiendas/tiendas.controller';
import { TiendasService } from '../src/tiendas/tiendas.service';
import { AuthGuard, RolesGuard } from '../src/common';

class TestAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization as string | undefined;

    if (!authHeader) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    if (authHeader === 'Bearer admin-token') {
      request.user = {
        sub: 'admin-id',
        correo: 'admin@novalibros.com',
        rol: 'administrador',
      };
      return true;
    }

    if (authHeader === 'Bearer client-token') {
      request.user = {
        sub: 'cliente-id',
        correo: 'cliente@novalibros.com',
        rol: 'cliente',
      };
      return true;
    }

    throw new UnauthorizedException('Token inválido o expirado');
  }
}

describe('TiendasController (e2e)', () => {
  let app: INestApplication;

  const tiendasServiceMock = {
    create: jest.fn(),
    validateAddress: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TiendasController],
      providers: [
        RolesGuard,
        {
          provide: TiendasService,
          useValue: tiendasServiceMock,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useClass(TestAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /tiendas/validar-direccion debe responder 403 para usuario no administrador', async () => {
    await request(app.getHttpServer())
      .post('/tiendas/validar-direccion')
      .set('Authorization', 'Bearer client-token')
      .send({
        direccion: 'Calle 23 # 13-45',
        ciudad: 'Bogotá',
      })
      .expect(403);
  });

  it('POST /tiendas/validar-direccion debe validar para administrador', async () => {
    tiendasServiceMock.validateAddress.mockResolvedValue({
      coincideCiudad: true,
      latitud: 4.711,
      longitud: -74.0721,
      ciudadDetectada: 'Bogotá',
      direccionNormalizada: 'Calle 23 # 13-45, Centenario, Pereira, Risaralda',
      proveedor: 'nominatim',
    });

    await request(app.getHttpServer())
      .post('/tiendas/validar-direccion')
      .set('Authorization', 'Bearer admin-token')
      .send({
        direccion: '  Calle 23 # 13-45  ',
        ciudad: '  Bogotá  ',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.coincideCiudad).toBe(true);
        expect(body.latitud).toBe(4.711);
      });

    expect(tiendasServiceMock.validateAddress).toHaveBeenCalledWith({
      direccion: 'Calle 23 # 13-45',
      ciudad: 'Bogotá',
    });
  });

  it('POST /tiendas debe responder 401 si no hay token', async () => {
    await request(app.getHttpServer())
      .post('/tiendas')
      .send({
        nombre: 'Tienda Centro',
        direccion: 'Calle 23 # 13-45',
        ciudad: 'Bogotá',
      })
      .expect(401);
  });

  it('POST /tiendas debe responder 403 para usuario no administrador', async () => {
    await request(app.getHttpServer())
      .post('/tiendas')
      .set('Authorization', 'Bearer client-token')
      .send({
        nombre: 'Tienda Centro',
        direccion: 'Calle 23 # 13-45',
        ciudad: 'Bogotá',
      })
      .expect(403);
  });

  it('POST /tiendas debe crear tienda para administrador y transformar payload', async () => {
    tiendasServiceMock.create.mockResolvedValue({
      id: 1,
      nombre: 'Tienda Centro',
      direccion: 'Calle 123',
      latitud: 4.711,
      longitud: -74.0721,
    });

    await request(app.getHttpServer())
      .post('/tiendas')
      .set('Authorization', 'Bearer admin-token')
      .send({
        nombre: '  Tienda Centro  ',
        direccion: '  Calle 23 # 13-45  ',
        ciudad: '  Bogotá  ',
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          id: 1,
          nombre: 'Tienda Centro',
          direccion: 'Calle 123',
        });
      });

    expect(tiendasServiceMock.create).toHaveBeenCalledWith({
      nombre: 'Tienda Centro',
      direccion: 'Calle 23 # 13-45',
      ciudad: 'Bogotá',
    });
  });

  it('POST /tiendas debe responder 400 si se envían campos no permitidos', async () => {
    await request(app.getHttpServer())
      .post('/tiendas')
      .set('Authorization', 'Bearer admin-token')
      .send({
        nombre: 'Tienda Centro',
        direccion: 'Calle 23 # 13-45',
        ciudad: 'Bogotá',
        extra: 'campo-no-permitido',
      })
      .expect(400);

    expect(tiendasServiceMock.create).not.toHaveBeenCalled();
  });

  it('PATCH /tiendas/:id debe responder 400 si id no es numérico', async () => {
    await request(app.getHttpServer())
      .patch('/tiendas/abc')
      .set('Authorization', 'Bearer admin-token')
      .send({
        nombre: 'Nueva Tienda',
        direccion: 'Calle 23 # 13-45',
        ciudad: 'Pereira',
      })
      .expect(400);
  });

  it('PATCH /tiendas/:id debe responder 400 si faltan campos obligatorios', async () => {
    await request(app.getHttpServer())
      .patch('/tiendas/1')
      .set('Authorization', 'Bearer admin-token')
      .send({
        nombre: 'Tienda Norte',
        direccion: 'Calle 23 # 13-45',
      })
      .expect(400);

    expect(tiendasServiceMock.update).not.toHaveBeenCalled();
  });

  it('PATCH /tiendas/:id debe responder 400 si la ciudad no cumple validación', async () => {
    await request(app.getHttpServer())
      .patch('/tiendas/1')
      .set('Authorization', 'Bearer admin-token')
      .send({
        nombre: 'Tienda Norte',
        direccion: 'Calle 23 # 13-45',
        ciudad: '',
      })
      .expect(400);

    expect(tiendasServiceMock.update).not.toHaveBeenCalled();
  });

  it('PATCH /tiendas/:id debe actualizar con payload completo para administrador', async () => {
    tiendasServiceMock.update.mockResolvedValue({
      id: 1,
      nombre: 'Tienda Norte',
      direccion: 'Calle 123',
      latitud: 4.711,
      longitud: -74.0721,
    });

    await request(app.getHttpServer())
      .patch('/tiendas/1')
      .set('Authorization', 'Bearer admin-token')
      .send({
        nombre: '  Tienda Norte  ',
        direccion: '  Calle 23 # 13-45  ',
        ciudad: '  Pereira  ',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.nombre).toBe('Tienda Norte');
      });

    expect(tiendasServiceMock.update).toHaveBeenCalledWith(1, {
      nombre: 'Tienda Norte',
      direccion: 'Calle 23 # 13-45',
      ciudad: 'Pereira',
    });
  });

  it('GET /tiendas debe responder 403 para usuario no administrador', async () => {
    await request(app.getHttpServer())
      .get('/tiendas')
      .set('Authorization', 'Bearer client-token')
      .expect(403);
  });

  it('GET /tiendas debe listar tiendas para administrador', async () => {
    tiendasServiceMock.findAll.mockResolvedValue([
      {
        id: 1,
        nombre: 'Tienda Centro',
        direccion: 'Calle 123',
        latitud: 4.711,
        longitud: -74.0721,
      },
    ]);

    await request(app.getHttpServer())
      .get('/tiendas')
      .set('Authorization', 'Bearer admin-token')
      .expect(200)
      .expect(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(body).toHaveLength(1);
        expect(body[0].nombre).toBe('Tienda Centro');
      });

    expect(tiendasServiceMock.findAll).toHaveBeenCalledTimes(1);
  });
});
