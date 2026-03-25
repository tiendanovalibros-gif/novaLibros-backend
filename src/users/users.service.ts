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
import { sendEmail } from 'src/emailService';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
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
        fechaNacimiento: new Date(createUserDto.fechaNacimiento),
        contrasenaHash: hashedPassword,
      } as any,
    });

    sendEmail({
      to: newUser.correo,
      subject: '¡Bienvenido a NovaLibros! 📚',
      text: `¡Hola ${newUser.nombre}! Bienvenido a NovaLibros.`,
      html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>📚 NovaLibros</h2>
        <p>Hola ${nombre},</p>
        <p>Tu cuenta fue creada exitosamente.</p>
        <p>Ya puedes iniciar sesión en la plataforma.</p>
      </div>
    `,
    }).catch((error) => {
      console.error('Error enviando correo:', error);
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
