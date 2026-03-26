import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
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
    const { correo, nombre } = createUserDto;
    // Verificar si ya existe un usuario con ese correo
    const existingUser = await this.prisma.usuario.findUnique({
      where: { correo: createUserDto.correo },
    });

    if (existingUser) {
      throw new ConflictException('Ya existe un usuario con ese correo');
    }

    // Hashear la contraseña antes de guardarla
    const hashedPassword = await hashPassword(createUserDto.contrasenaHash);

    const newUser = await this.prisma.usuario.create({
      data: {
        ...createUserDto,
        rol,
        fechaNacimiento: new Date(createUserDto.fechaNacimiento),
        contrasenaHash: hashedPassword,
      } as any,
    });

    this.emailService
      .sendWelcomeEmail(newUser.nombre, newUser.correo)
      .catch((error) => {
        console.error('Error enviando correo de bienvenida:', error);
      });

    return newUser;
  }

  async login(correo: string, contrasena: string) {
    // Buscar usuario por correo
    const usuario = await this.prisma.usuario.findUnique({
      where: { correo },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await comparePassword(
      contrasena,
      usuario.contrasenaHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
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

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.usuario.update({
      where: { id },
      data: updateUserDto as any,
    });
  }

  remove(id: string) {
    return this.prisma.usuario.delete({ where: { id } });
  }
}
