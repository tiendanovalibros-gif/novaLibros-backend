import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto, RegisterResponseDto } from './dto/response.dto';
import {
  AuthGuard,
  RolesGuard,
  Public,
  Roles,
  CurrentUser,
  UuidPipe,
} from '../common';
import type { JwtPayload } from '../utils';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Registrar un  nuevo usuario' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    type: RegisterResponseDto,
  })
  @ApiResponse({ status: 409, description: 'El correo ya está registrado' })
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('register-admin')
  @Roles('root')
  @ApiOperation({ summary: 'Registrar un nuevo administrador (Solo root)' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Administrador creado exitosamente',
    type: RegisterResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 409, description: 'El correo ya está registrado' })
  registerAdmin(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createAdmin(createUserDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso, retorna JWT token',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  login(@Body() loginDto: LoginDto) {
    return this.usersService.login(loginDto.correo, loginDto.contrasena);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Solicitar restablecimiento de contraseña' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Correo enviado si el usuario existe',
  })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.usersService.forgotPassword(dto.correo);
    return {
      message: 'Si el correo existe, recibirás un enlace de recuperación',
    };
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restablecer contraseña con token' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Contraseña actualizada exitosamente',
  })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.usersService.resetPassword(dto.token, dto.nuevaContrasena);
    return { message: 'Contraseña actualizada exitosamente' };
  }

  @Patch('change-password')
  @ApiOperation({ summary: 'Cambiar contraseña del usuario autenticado' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Contraseña actualizada exitosamente',
  })
  @ApiResponse({ status: 401, description: 'Contraseña actual inválida' })
  async changePassword(
    @CurrentUser() user: JwtPayload,
    @Body() dto: ChangePasswordDto,
  ) {
    await this.usersService.changePassword(
      user.sub,
      dto.contrasenaActual,
      dto.nuevaContrasena,
    );
    return { message: 'Contraseña actualizada exitosamente' };
  }

  @Get('profile')
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil del usuario' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  getProfile(@CurrentUser() user: JwtPayload) {
    return this.usersService.findOne(user.sub);
  }

  @Roles('root', 'administrador')
  @Get()
  @ApiOperation({
    summary: 'Obtener todos los usuarios (Solo root/administrador)',
  })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(
    @Param('id', UuidPipe) id: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    if (
      currentUser.rol !== 'root' &&
      currentUser.rol !== 'administrador' &&
      currentUser.sub !== id
    ) {
      throw new HttpException(
        'No autorizado para ver este usuario',
        HttpStatus.FORBIDDEN,
      );
    }
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  update(
    @Param('id', UuidPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    if (
      currentUser.rol !== 'root' &&
      currentUser.rol !== 'administrador' &&
      currentUser.sub !== id
    ) {
      throw new HttpException(
        'No autorizado para actualizar este usuario',
        HttpStatus.FORBIDDEN,
      );
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Roles('root', 'administrador')
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario (Solo root/administrador)' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  remove(@Param('id', UuidPipe) id: string) {
    return this.usersService.remove(id);
  }
}
