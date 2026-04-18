import { Module } from '@nestjs/common';
import { TiendasService } from './tiendas.service';
import { TiendasController } from './tiendas.controller';
import { GeocodingService } from './geocoding.service';

@Module({
  controllers: [TiendasController],
  providers: [TiendasService, GeocodingService],
})
export class TiendasModule {}
