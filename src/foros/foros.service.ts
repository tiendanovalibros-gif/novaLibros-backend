import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateForoClienteDto } from './dto/create-foro-cliente.dto';
import { CreateMensajeForoDto } from './dto/create-mensaje-foro.dto';
import type { JwtPayload } from '../utils';

const MENSAJES_INCLUDE = {
  remitente: { select: { id: true, nombre: true, apellido: true, rol: true } },
};

const FORO_INCLUDE = {
  usuarioCreador: { select: { id: true, nombre: true, apellido: true } },
  mensajes: {
    include: MENSAJES_INCLUDE,
    orderBy: { fechaHora: 'asc' as const },
  },
};

const FORO_LIST_INCLUDE = {
  usuarioCreador: { select: { id: true, nombre: true, apellido: true } },
  mensajes: {
    orderBy: { fechaHora: 'desc' as const },
    take: 1,
    include: MENSAJES_INCLUDE,
  },
  _count: { select: { mensajes: true } },
};

@Injectable()
export class ForosService {
  constructor(private readonly prisma: PrismaService) {}

  private assertIsStaff(user: JwtPayload) {
    if (user.rol !== 'administrador' && user.rol !== 'root') {
      throw new ForbiddenException('Solo administradores pueden acceder a esta ruta');
    }
  }

  private async assertOwnsForo(foroId: number, userId: string) {
    const foro = await this.prisma.foro.findUnique({ where: { id: foroId } });
    if (!foro) throw new NotFoundException(`Foro ${foroId} no encontrado`);
    if (foro.idUsuarioCreador !== userId) {
      throw new ForbiddenException('No tienes acceso a este foro');
    }
    return foro;
  }

  private async assertCanAccessForo(foroId: number, user: JwtPayload) {
    const foro = await this.prisma.foro.findUnique({ where: { id: foroId } });
    if (!foro) throw new NotFoundException(`Foro ${foroId} no encontrado`);
    const isStaff = user.rol === 'administrador' || user.rol === 'root';
    if (!isStaff && foro.idUsuarioCreador !== user.sub) {
      throw new ForbiddenException('No tienes acceso a este foro');
    }
    return foro;
  }

  /** Cliente: crear foro con mensaje inicial opcional */
  async crearMiForo(user: JwtPayload, dto: CreateForoClienteDto) {
    const now = new Date();
    const foro = await this.prisma.foro.create({
      data: {
        titulo: dto.titulo,
        fechaCreacion: now,
        fechaActualizacion: now,
        idUsuarioCreador: user.sub,
        ...(dto.contenido
          ? {
              mensajes: {
                create: {
                  contenido: dto.contenido,
                  fechaHora: now,
                  idRemitente: user.sub,
                },
              },
            }
          : {}),
      },
      include: FORO_INCLUDE,
    });
    return foro;
  }

  /** Cliente: listar solo sus foros */
  async listarMisForos(userId: string) {
    return this.prisma.foro.findMany({
      where: { idUsuarioCreador: userId },
      include: FORO_LIST_INCLUDE,
      orderBy: { fechaActualizacion: 'desc' },
    });
  }

  /** Cliente: obtener detalle de su foro */
  async obtenerMiForo(foroId: number, userId: string) {
    const foro = await this.prisma.foro.findUnique({
      where: { id: foroId },
      include: FORO_INCLUDE,
    });
    if (!foro) throw new NotFoundException(`Foro ${foroId} no encontrado`);
    if (foro.idUsuarioCreador !== userId) {
      throw new ForbiddenException('No tienes acceso a este foro');
    }
    return foro;
  }

  /** Admin/Root: listar todos los foros */
  async listarTodos(user: JwtPayload) {
    this.assertIsStaff(user);
    return this.prisma.foro.findMany({
      include: FORO_LIST_INCLUDE,
      orderBy: { fechaActualizacion: 'desc' },
    });
  }

  /** Admin/Root: obtener cualquier foro */
  async obtenerForo(foroId: number, user: JwtPayload) {
    this.assertIsStaff(user);
    const foro = await this.prisma.foro.findUnique({
      where: { id: foroId },
      include: FORO_INCLUDE,
    });
    if (!foro) throw new NotFoundException(`Foro ${foroId} no encontrado`);
    return foro;
  }

  /** Cliente (dueño), Admin o Root: enviar mensaje */
  async enviarMensaje(foroId: number, user: JwtPayload, dto: CreateMensajeForoDto) {
    await this.assertCanAccessForo(foroId, user);
    const now = new Date();
    const [mensaje] = await this.prisma.$transaction([
      this.prisma.mensaje.create({
        data: {
          idForo: foroId,
          idRemitente: user.sub,
          contenido: dto.contenido,
          fechaHora: now,
        },
        include: MENSAJES_INCLUDE,
      }),
      this.prisma.foro.update({
        where: { id: foroId },
        data: { fechaActualizacion: now },
      }),
    ]);
    return mensaje;
  }

  /** Obtener solo mensajes de un foro (para polling incremental) */
  async listarMensajes(foroId: number, user: JwtPayload) {
    await this.assertCanAccessForo(foroId, user);
    return this.prisma.mensaje.findMany({
      where: { idForo: foroId },
      include: MENSAJES_INCLUDE,
      orderBy: { fechaHora: 'asc' },
    });
  }
}
