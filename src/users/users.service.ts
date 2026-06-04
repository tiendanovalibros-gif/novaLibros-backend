import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword, comparePassword, signToken } from '../utils';
import { EmailService } from '../email/email.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async createAdmin(createUserDto: CreateUserDto) {
    return this.createWithRole(createUserDto, 'administrador');
  }

  async create(createUserDto: CreateUserDto) {
    return this.createWithRole(createUserDto, 'cliente');
  }

  private async createWithRole(createUserDto: CreateUserDto, rol: string) {
    const { correo, nombre, preferencias, ...rest } = createUserDto as any;
    const existingUser = await this.prisma.usuario.findUnique({
      where: { correo },
    });

    if (existingUser) {
      throw new ConflictException('Ya existe un usuario con ese correo');
    }

    const hashedPassword = await hashPassword(rest.contrasenaHash);

    const newUser = await this.prisma.usuario.create({
      data: {
        ...rest,
        correo,
        nombre,
        rol,
        fechaNacimiento: new Date(rest.fechaNacimiento),
        contrasenaHash: hashedPassword,
      } as any,
    });

    if (Array.isArray(preferencias) && preferencias.length > 0) {
      await this.persistPreferencias(newUser.id, preferencias);
    }

    this.emailService
      .sendWelcomeEmail(newUser.nombre, newUser.correo)
      .catch((error) => {
        console.error('Error enviando correo de bienvenida:', error);
      });

    return newUser;
  }

  async getPreferencias(userId: string): Promise<{ id: number; nombre: string }[]> {
    const rows = await this.prisma.usuarioPreferencia.findMany({
      where: { idUsuario: userId },
      include: { preferenciaLiteraria: true },
    });
    return rows.map((r) => ({
      id: r.preferenciaLiteraria.id,
      nombre: r.preferenciaLiteraria.nombre,
    }));
  }

  async syncPreferencias(userId: string, nombres: string[]): Promise<{ id: number; nombre: string }[]> {
    await this.persistPreferencias(userId, nombres);
    return this.getPreferencias(userId);
  }

  private async persistPreferencias(userId: string, nombres: string[]): Promise<void> {
    const unique = [...new Set(nombres.map((n) => n.trim()).filter(Boolean))];

    const prefs = await Promise.all(
      unique.map((nombre) =>
        this.prisma.preferenciaLiteraria.upsert({
          where: { nombre },
          update: {},
          create: { nombre },
        }),
      ),
    );

    const idsPref = prefs.map((p) => p.id);

    await this.prisma.$transaction([
      this.prisma.usuarioPreferencia.deleteMany({ where: { idUsuario: userId } }),
      ...idsPref.map((idPreferenciaLiteraria) =>
        this.prisma.usuarioPreferencia.create({
          data: { idUsuario: userId, idPreferenciaLiteraria },
        }),
      ),
    ]);
  }

  async login(correo: string, contrasena: string) {
    // Buscar usuario por correo
    const usuario = await this.prisma.usuario.findUnique({
      where: { correo },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuario no autorizado');
    }

    // Verificar contraseña
    const isPasswordValid = await comparePassword(
      contrasena,
      usuario.contrasenaHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña inválidas');
    }

    // Generar token JWT
    const token = signToken({
      sub: usuario.id,
      correo: usuario.correo,
      rol: usuario.rol,
    });

    return {
      access_token: token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    };
  }

  findAll() {
    return this.prisma.usuario.findMany();
  }

  async findOne(id: string) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return usuario;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    if (updateUserDto.correo && updateUserDto.correo !== usuario.correo) {
      const existingUser = await this.prisma.usuario.findUnique({
        where: { correo: updateUserDto.correo },
      });
      if (existingUser) {
        throw new ConflictException('Ya existe un usuario con ese correo');
      }
    }

    return await this.prisma.usuario.update({
      where: { id },
      data: updateUserDto as any,
    });
  }

  remove(id: string) {
    return this.prisma.usuario.delete({ where: { id } });
  }

  async forgotPassword(correo: string): Promise<void> {
    const usuario = await this.prisma.usuario.findUnique({ where: { correo } });

    if (!usuario) return;

    await this.prisma.passwordResetToken.deleteMany({
      where: { idUsuario: usuario.id },
    });

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.prisma.passwordResetToken.create({
      data: {
        idUsuario: usuario.id,
        token,
        expiresAt,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/recover-password/reset-password?token=${token}`;

    await this.emailService
      .sendResetPasswordEmail(usuario.nombre, usuario.correo, resetUrl)
      .catch((error) => {
        console.error('Error enviando correo de recuperación:', error);
      });
  }

  async resetPassword(token: string, nuevaContrasena: string): Promise<void> {
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token },
      include: { usuario: true },
    });

    if (!resetToken) {
      throw new NotFoundException('Token inválido');
    }

    if (resetToken.used) {
      throw new UnauthorizedException('Este token ya fue utilizado');
    }

    if (new Date() > resetToken.expiresAt) {
      throw new UnauthorizedException('El token ha expirado');
    }

    const hashedPassword = await hashPassword(nuevaContrasena);

    await this.prisma.usuario.update({
      where: { id: resetToken.idUsuario },
      data: { contrasenaHash: hashedPassword },
    });

    await this.prisma.passwordResetToken.update({
      where: { token },
      data: { used: true },
    });
  }

  async changePassword(
    userId: string,
    contrasenaActual: string,
    nuevaContrasena: string,
  ): Promise<void> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: userId },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${userId} no encontrado`);
    }

    if (!contrasenaActual?.trim() || !nuevaContrasena?.trim()) {
      throw new BadRequestException('Contrasena requerida');
    }

    const isPasswordValid = await comparePassword(
      contrasenaActual,
      usuario.contrasenaHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Contrasena actual invalida');
    }

    const isSamePassword = await comparePassword(
      nuevaContrasena,
      usuario.contrasenaHash,
    );

    if (isSamePassword) {
      throw new BadRequestException(
        'La nueva contrasena debe ser diferente a la actual',
      );
    }

    const hashedPassword = await hashPassword(nuevaContrasena);

    await this.prisma.usuario.update({
      where: { id: userId },
      data: { contrasenaHash: hashedPassword },
    });
  }
}
