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
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { AuthGuard, RolesGuard, Roles, CurrentUser } from '../common';
import type { JwtPayload } from '../utils';

@ApiTags('reservas')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Roles('cliente')
  @Post()
  create(
    @Body() createReservaDto: CreateReservaDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.reservasService.create(createReservaDto, currentUser);
  }

  @Roles('administrador', 'root')
  @Get()
  findAll() {
    return this.reservasService.findAll();
  }

  @Get('me')
  findMine(@CurrentUser() currentUser: JwtPayload) {
    return this.reservasService.findMine(currentUser);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() currentUser: JwtPayload) {
    return this.reservasService.findOne(id, currentUser);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReservaDto: UpdateReservaDto) {
    return this.reservasService.update(id, updateReservaDto);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @CurrentUser() currentUser: JwtPayload) {
    return this.reservasService.cancel(id, currentUser);
  }

  @Roles('cliente')
  @Patch(':id/convert-to-cart')
  convertToCart(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.reservasService.convertToCart(id, currentUser);
  }

  @Roles('administrador', 'root')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservasService.remove(id);
  }
}
