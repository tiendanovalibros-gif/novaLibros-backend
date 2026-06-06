import { Module } from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { FacturasController } from './facturas.controller';
import { FacturaPdfService } from './factura-pdf.service';

@Module({
  controllers: [FacturasController],
  providers: [FacturasService, FacturaPdfService],
})
export class FacturasModule {}
