import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateTiendaDto } from './dto/create-tienda.dto';
import { UpdateTiendaDto } from './dto/update-tienda.dto';
import { PrismaService } from '../prisma/prisma.service';
import { GeocodingService } from './geocoding.service';
import { ValidateTiendaDireccionDto } from './dto/validate-tienda-direccion.dto';
import { UpdateTiendaUbicacionDto } from './dto/update-tienda-ubicacion.dto';

type TiendaConCiudad = Prisma.TiendaGetPayload<{
  include: { ciudad: true };
}>;

@Injectable()
export class TiendasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly geocodingService: GeocodingService,
  ) {}

  async create(createTiendaDto: CreateTiendaDto) {
    const input = this.normalizeCreateData(createTiendaDto);

    const geocodingResult = await this.geocodingService.validateAddressInCity(
      input.direccion,
      input.ciudad,
    );

    const ciudad = await this.findOrCreateCity(input.ciudad);

    const coords = this.resolveCoords(input, geocodingResult);

    const data = {
      nombre: input.nombre,
      direccion: input.direccion,
      direccionNormalizada: geocodingResult.direccionNormalizada,
      latitud: coords.latitud,
      longitud: coords.longitud,
      idCiudad: ciudad.id,
    };

    const existingTienda = await this.findByNombreAndDireccion(
      data.nombre,
      data.direccion,
      ciudad.id,
    );

    if (existingTienda) {
      throw new ConflictException(
        'Ya existe una tienda con el mismo nombre y dirección',
      );
    }

    const tienda = await this.prisma.tienda.create({
      data,
      include: { ciudad: true },
    });

    return this.toTiendaResponse(tienda);
  }

  async validateAddress(validateDto: ValidateTiendaDireccionDto) {
    const normalizedDto = this.normalizeValidateAddressData(validateDto);

    return this.geocodingService.validateAddressInCity(
      normalizedDto.direccion,
      normalizedDto.ciudad,
    );
  }

  async findAll() {
    const tiendas = await this.prisma.tienda.findMany({
      orderBy: { id: 'asc' },
      include: { ciudad: true },
    });

    return tiendas.map((tienda) => this.toTiendaResponse(tienda));
  }

  async findOne(id: number) {
    this.validateTiendaId(id);

    const tienda = await this.prisma.tienda.findUnique({
      where: { id },
      include: { ciudad: true },
    });

    if (!tienda) {
      throw new NotFoundException(`Tienda con id ${id} no encontrada`);
    }

    return this.toTiendaResponse(tienda);
  }

  async update(id: number, updateTiendaDto: UpdateTiendaDto) {
    this.validateTiendaId(id);

    await this.findOne(id);
    const input = this.normalizeUpdateData(updateTiendaDto);

    const geocodingResult = await this.geocodingService.validateAddressInCity(
      input.direccion,
      input.ciudad,
    );

    const ciudad = await this.findOrCreateCity(input.ciudad);

    const coords = this.resolveCoords(input, geocodingResult);

    const data = {
      nombre: input.nombre,
      direccion: input.direccion,
      direccionNormalizada: geocodingResult.direccionNormalizada,
      latitud: coords.latitud,
      longitud: coords.longitud,
      idCiudad: ciudad.id,
    };

    const existingTienda = await this.findByNombreAndDireccion(
      data.nombre,
      data.direccion,
      ciudad.id,
      id,
    );

    if (existingTienda) {
      throw new ConflictException(
        'Ya existe otra tienda con el mismo nombre y dirección',
      );
    }

    const tienda = await this.prisma.tienda.update({
      where: { id },
      data,
      include: { ciudad: true },
    });

    return this.toTiendaResponse(tienda);
  }

  async updateUbicacion(id: number, dto: UpdateTiendaUbicacionDto) {
    this.validateTiendaId(id);
    await this.findOne(id);

    const tienda = await this.prisma.tienda.update({
      where: { id },
      data: {
        latitud: dto.latitud,
        longitud: dto.longitud,
      },
      include: { ciudad: true },
    });

    return this.toTiendaResponse(tienda);
  }

  async remove(id: number) {
    this.validateTiendaId(id);
    await this.findOne(id);

    try {
      const tienda = await this.prisma.tienda.delete({
        where: { id },
        include: { ciudad: true },
      });

      return this.toTiendaResponse(tienda);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private resolveCoords(
    input: CreateTiendaDto,
    geocoding: { latitud: number; longitud: number },
  ) {
    if (input.latitud !== undefined && input.longitud !== undefined) {
      return { latitud: input.latitud, longitud: input.longitud };
    }
    return { latitud: geocoding.latitud, longitud: geocoding.longitud };
  }

  private normalizeCreateData(data: CreateTiendaDto): CreateTiendaDto {
    return {
      ...data,
      nombre: data.nombre.trim(),
      direccion: this.normalizeDireccion(data.direccion),
      ciudad: this.normalizeCiudad(data.ciudad),
    };
  }

  private normalizeUpdateData(data: UpdateTiendaDto): UpdateTiendaDto {
    return {
      ...data,
      nombre: data.nombre.trim(),
      direccion: this.normalizeDireccion(data.direccion),
      ciudad: this.normalizeCiudad(data.ciudad),
    };
  }

  private normalizeValidateAddressData(
    data: ValidateTiendaDireccionDto,
  ): ValidateTiendaDireccionDto {
    return {
      ...data,
      direccion: this.normalizeDireccion(data.direccion),
      ciudad: this.normalizeCiudad(data.ciudad),
    };
  }

  private normalizeDireccion(direccion: string): string {
    return direccion
      .trim()
      .replace(/\b(?:n(?:u|ú)?m(?:ero)?|no\.?|n°|nº)\b/gi, '#')
      .replace(/\s*#\s*/g, ' # ')
      .replace(/\s*-\s*/g, '-')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private normalizeCiudad(ciudad: string): string {
    return ciudad.trim().replace(/\s+/g, ' ');
  }

  private validateTiendaId(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException(
        'El id de la tienda debe ser un entero positivo',
      );
    }
  }

  private async findByNombreAndDireccion(
    nombre: string,
    direccion: string,
    idCiudad: number,
    excludeId?: number,
  ) {
    return this.prisma.tienda.findFirst({
      where: {
        nombre: { equals: nombre, mode: 'insensitive' },
        direccion: { equals: direccion, mode: 'insensitive' },
        idCiudad,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
  }

  private async findOrCreateCity(ciudad: string) {
    const nombre = this.normalizeCiudad(ciudad);

    const existing = await this.prisma.ciudad.findFirst({
      where: { nombre: { equals: nombre, mode: 'insensitive' } },
    });

    if (existing) {
      return existing;
    }

    try {
      return await this.prisma.ciudad.create({ data: { nombre } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const concurrentCity = await this.prisma.ciudad.findFirst({
          where: { nombre: { equals: nombre, mode: 'insensitive' } },
        });

        if (concurrentCity) {
          return concurrentCity;
        }
      }

      throw error;
    }
  }

  private toTiendaResponse(tienda: TiendaConCiudad) {
    return {
      id: tienda.id,
      nombre: tienda.nombre,
      direccion: tienda.direccion,
      direccionNormalizada: tienda.direccionNormalizada ?? tienda.direccion,
      ciudad: tienda.ciudad?.nombre ?? null,
      latitud: Number(tienda.latitud),
      longitud: Number(tienda.longitud),
    };
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        throw new ConflictException(
          'No se puede eliminar la tienda porque tiene registros relacionados',
        );
      }
    }

    throw error;
  }
}
