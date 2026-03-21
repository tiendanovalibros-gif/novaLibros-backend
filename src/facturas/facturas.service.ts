import { Injectable } from '@nestjs/common';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FacturasService {
  constructor(private readonly prisma: PrismaService) {}

  create(createFacturaDto: CreateFacturaDto) {
    return this.prisma.facturaElectronica.create({ data: createFacturaDto as any });
  }

  findAll() {
    return this.prisma.facturaElectronica.findMany();
  }

  findOne(id: string) {
    return this.prisma.facturaElectronica.findUnique({ where: { id } });
  }

  update(id: string, updateFacturaDto: UpdateFacturaDto) {
    return this.prisma.facturaElectronica.update({ where: { id }, data: updateFacturaDto as any });
  }

  remove(id: string) {
    return this.prisma.facturaElectronica.delete({ where: { id } });
  }
}
