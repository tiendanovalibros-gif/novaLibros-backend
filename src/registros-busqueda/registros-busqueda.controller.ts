import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RegistrosBusquedaService } from './registros-busqueda.service';
import { CreateRegistrosBusquedaDto } from './dto/create-registros-busqueda.dto';
import { UpdateRegistrosBusquedaDto } from './dto/update-registros-busqueda.dto';
import { AuthGuard, RolesGuard, Roles } from '../common';
import type { JwtPayload } from '../utils';

interface AuthRequest extends Request {
  user: JwtPayload;
}

class RegistrarBusquedaMeDto {
  @ApiProperty({ example: 'novelas clasicas' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  criterio: string;
}

@ApiTags('registros-busqueda')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('registros-busqueda')
export class RegistrosBusquedaController {
  constructor(private readonly registrosBusquedaService: RegistrosBusquedaService) { }

  @Post()
  create(@Body() createRegistrosBusquedaDto: CreateRegistrosBusquedaDto) {
    return this.registrosBusquedaService.create(createRegistrosBusquedaDto);
  }

  @Roles('cliente')
  @Post('me')
  @ApiOperation({ summary: 'Registrar búsqueda del cliente autenticado' })
  registrarMiBusqueda(@Req() req: AuthRequest, @Body() dto: RegistrarBusquedaMeDto) {
    return this.registrosBusquedaService.createForUser(req.user.sub, dto.criterio);
  }

  @Roles('administrador')
  @Get()
  findAll() {
    return this.registrosBusquedaService.findAll();
  }

  @Roles('administrador')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.registrosBusquedaService.findOne(+id);
  }

  @Roles('administrador')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegistrosBusquedaDto: UpdateRegistrosBusquedaDto) {
    return this.registrosBusquedaService.update(+id, updateRegistrosBusquedaDto);
  }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.registrosBusquedaService.remove(+id);
  }
}
