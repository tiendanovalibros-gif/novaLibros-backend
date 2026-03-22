import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FacturasService } from './facturas.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { AuthGuard, RolesGuard, Roles } from '../common';

@ApiTags('facturas')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('facturas')
export class FacturasController {
  constructor(private readonly facturasService: FacturasService) {}

  @Post()
  create(@Body() createFacturaDto: CreateFacturaDto) {
    return this.facturasService.create(createFacturaDto);
  }

  @Roles('administrador')
  @Get()
  findAll() {
    return this.facturasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.facturasService.findOne(id);
  }

  @Roles('administrador')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFacturaDto: UpdateFacturaDto) {
    return this.facturasService.update(id, updateFacturaDto);
  }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.facturasService.remove(id);
  }
}
