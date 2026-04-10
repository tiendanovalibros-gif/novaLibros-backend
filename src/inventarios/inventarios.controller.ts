import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InventariosService } from './inventarios.service';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
import { AddLibrosPorGeneroDto } from './dto/add-libros-por-genero.dto';
import { UpdateCantidadLibroDto } from './dto/update-cantidad-libro.dto';
import { BloquearLibrosDto } from './dto/bloquear-libros.dto';
import { AuthGuard, RolesGuard, Public, Roles } from '../common';

@ApiTags('inventarios')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('inventarios')
export class InventariosController {
  constructor(private readonly inventariosService: InventariosService) {}

  @Roles('administrador')
  @Post()
  create(@Body() createInventarioDto: CreateInventarioDto) {
    return this.inventariosService.create(createInventarioDto);
  }

  @Roles('administrador')
  @Post('tiendas/:idTienda/generos/:idGenero/agregar')
  addLibrosPorGenero(
    @Param('idTienda') idTienda: string,
    @Param('idGenero') idGenero: string,
    @Body() addLibrosPorGeneroDto: AddLibrosPorGeneroDto,
  ) {
    return this.inventariosService.addLibrosPorGenero(
      +idTienda,
      +idGenero,
      addLibrosPorGeneroDto,
    );
  }

  @Public()
  @Get()
  findAll() {
    return this.inventariosService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventariosService.findOne(+id);
  }

  @Roles('administrador')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInventarioDto: UpdateInventarioDto,
  ) {
    return this.inventariosService.update(+id, updateInventarioDto);
  }

  @Roles('administrador')
  @Patch('tiendas/:idTienda/libros/:idLibro/cantidad')
  updateCantidadLibro(
    @Param('idTienda') idTienda: string,
    @Param('idLibro') idLibro: string,
    @Body() updateCantidadLibroDto: UpdateCantidadLibroDto,
  ) {
    return this.inventariosService.updateCantidadLibro(
      +idTienda,
      idLibro,
      updateCantidadLibroDto,
    );
  }

  @Roles('administrador')
  @Patch('tiendas/:idTienda/libros/:idLibro/agotado')
  marcarLibroAgotado(
    @Param('idTienda') idTienda: string,
    @Param('idLibro') idLibro: string,
  ) {
    return this.inventariosService.marcarLibroAgotado(+idTienda, idLibro);
  }

  @Roles('administrador')
  @Patch('tiendas/:idTienda/libros/:idLibro/bloquear')
  bloquearLibros(
    @Param('idTienda') idTienda: string,
    @Param('idLibro') idLibro: string,
    @Body() bloquearLibrosDto: BloquearLibrosDto,
  ) {
    return this.inventariosService.bloquearLibros(
      +idTienda,
      idLibro,
      bloquearLibrosDto,
    );
  }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventariosService.remove(+id);
  }
}
