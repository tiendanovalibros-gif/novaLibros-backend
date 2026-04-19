import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CarritosService } from './carritos.service';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { UpdateCarritoDto } from './dto/update-carrito.dto';
import { AddItemCarritoDto } from './dto/add-item-carrito.dto';
import { UpdateItemCantidadDto } from './dto/update-item-cantidad.dto';
import { AuthGuard, RolesGuard, Roles, CurrentUser } from '../common';
import type { JwtPayload } from '../utils';

@ApiTags('carritos')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('carritos')
export class CarritosController {
  constructor(private readonly carritosService: CarritosService) {}

  @Get('me')
  findMine(@CurrentUser() currentUser: JwtPayload) {
    return this.carritosService.findMine(currentUser);
  }

  @Roles('cliente')
  @Post('me/items')
  addItemToMine(
    @Body() addItemCarritoDto: AddItemCarritoDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.carritosService.addItemToMine(currentUser, addItemCarritoDto);
  }

  @Roles('cliente')
  @Patch('me/items/:idDetalle')
  updateItemQuantityFromMine(
    @Param('idDetalle', ParseIntPipe) idDetalle: number,
    @Body() dto: UpdateItemCantidadDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.carritosService.updateItemQuantityFromMine(
      currentUser,
      idDetalle,
      dto.cantidad,
    );
  }

  @Roles('cliente')
  @Delete('me/items/:idDetalle')
  removeItemFromMine(
    @Param('idDetalle', ParseIntPipe) idDetalle: number,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.carritosService.removeItemFromMine(currentUser, idDetalle);
  }

  @Post()
  create(@Body() createCarritoDto: CreateCarritoDto) {
    return this.carritosService.create(createCarritoDto);
  }

  @Roles('administrador')
  @Get()
  findAll() {
    return this.carritosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carritosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCarritoDto: UpdateCarritoDto) {
    return this.carritosService.update(+id, updateCarritoDto);
  }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carritosService.remove(+id);
  }
}
