import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LibrosService } from './libros.service';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';
import { SearchLibrosDto } from './dto/search-libros.dto';
import { AuthGuard, RolesGuard, Public, Roles } from '../common';

@ApiTags('libros')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('libros')
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}

  @Roles('administrador')
  @Post()
  create(@Body() createLibroDto: CreateLibroDto) {
    return this.librosService.create(createLibroDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.librosService.findAll();
  }

  @Public()
  @Get('buscar')
  search(@Query() query: SearchLibrosDto) {
    const toNumber = (value?: string) => {
      if (value === undefined || value === null || value === '') {
        return undefined;
      }
      const parsed = Number(value);
      return Number.isNaN(parsed) ? undefined : parsed;
    };

    const generoIds = (query.generos ?? '')
      .split(',')
      .map((item) => Number(item.trim()))
      .filter((item) => Number.isFinite(item));

    return this.librosService.search({
      q: query.q?.trim(),
      idAutor: toNumber(query.idAutor),
      generoIds: generoIds.length ? Array.from(new Set(generoIds)) : undefined,
      anoMin: toNumber(query.anoMin),
      anoMax: toNumber(query.anoMax),
    });
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.librosService.findOne(id);
  }

  @Roles('administrador')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLibroDto: UpdateLibroDto) {
    return this.librosService.update(id, updateLibroDto);
  }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.librosService.remove(id);
  }
}
