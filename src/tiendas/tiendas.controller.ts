import {
  HttpStatus,
  HttpCode,
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';
import { TiendasService } from './tiendas.service';
import { CreateTiendaDto } from './dto/create-tienda.dto';
import { UpdateTiendaDto } from './dto/update-tienda.dto';
import { ValidateTiendaDireccionDto } from './dto/validate-tienda-direccion.dto';
import { ValidateTiendaDireccionResponseDto } from './dto/validate-tienda-direccion-response.dto';
import { AuthGuard, RolesGuard, Public, Roles } from '../common';
import { Tienda } from './entities/tienda.entity';

@ApiTags('tiendas')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
@Controller('tiendas')
export class TiendasController {
  constructor(private readonly tiendasService: TiendasService) {}

  @Roles('administrador')
  @Post('validar-direccion')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Validar dirección por ciudad (solo administrador)',
    description:
      'Valida que una dirección esté dentro de la ciudad seleccionada y retorna latitud/longitud calculadas automáticamente.',
  })
  @ApiBody({
    type: ValidateTiendaDireccionDto,
    description: 'Dirección y ciudad seleccionada en el formulario',
    examples: {
      ejemploValidacion: {
        summary: 'Validar dirección en ciudad',
        value: {
          direccion: 'Calle 100 # 7-45',
          ciudad: 'Bogotá',
        },
      },
    },
  })
  @ApiOkResponse({
    description:
      'Dirección válida para la ciudad. Incluye coordenadas y dirección normalizada.',
    type: ValidateTiendaDireccionResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'La dirección no existe o no pertenece a la ciudad indicada',
    schema: {
      example: {
        statusCode: HttpStatus.BAD_REQUEST,
        message:
          'No se encontró la dirección para la ciudad indicada. Usa una dirección real con nomenclatura (ej: Calle 100 # 7-45).',
        error: 'Bad Request',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'No se envió token o el token no es válido',
  })
  @ApiForbiddenResponse({
    description: 'El usuario autenticado no tiene rol administrador',
  })
  validateDireccion(@Body() validateDto: ValidateTiendaDireccionDto) {
    return this.tiendasService.validateAddress(validateDto);
  }

  @Roles('administrador')
  @Post()
  @ApiOperation({
    summary: 'Crear una tienda (solo administrador)',
    description:
      'Crea una tienda nueva. El backend valida la dirección en la ciudad seleccionada y calcula latitud/longitud automáticamente.',
  })
  @ApiBody({
    type: CreateTiendaDto,
    description:
      'Datos obligatorios para registrar la tienda (sin latitud y longitud manual)',
    examples: {
      ejemploBasico: {
        summary: 'Crear tienda principal',
        value: {
          nombre: 'Tienda Centro',
          direccion: 'Calle 100 # 7-45',
          ciudad: 'Bogotá',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Tienda creada exitosamente',
    type: Tienda,
  })
  @ApiBadRequestResponse({
    description:
      'Payload inválido o dirección no válida para la ciudad indicada',
    schema: {
      example: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'La dirección no pertenece a la ciudad seleccionada (Bogotá)',
        error: 'Bad Request',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'No se envió token o el token no es válido',
    schema: {
      example: {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Token no proporcionado',
        error: 'Unauthorized',
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'El usuario autenticado no tiene rol administrador',
    schema: {
      example: {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Se requiere uno de los siguientes roles: administrador',
        error: 'Forbidden',
      },
    },
  })
  @ApiConflictResponse({
    description: 'Ya existe una tienda con el mismo nombre y dirección',
    schema: {
      example: {
        statusCode: HttpStatus.CONFLICT,
        message: 'Ya existe una tienda con el mismo nombre y dirección',
        error: 'Conflict',
      },
    },
  })
  create(@Body() createTiendaDto: CreateTiendaDto) {
    return this.tiendasService.create(createTiendaDto);
  }

  @Roles('administrador')
  @Get()
  @ApiOperation({
    summary: 'Listar tiendas (solo administrador)',
    description:
      'Retorna todas las tiendas registradas ordenadas por id ascendente. Requiere rol administrador.',
  })
  @ApiOkResponse({
    description: 'Listado de tiendas',
    type: Tienda,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: 'No se envió token o el token no es válido',
  })
  @ApiForbiddenResponse({
    description: 'El usuario autenticado no tiene rol administrador',
  })
  findAll() {
    return this.tiendasService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Consultar una tienda por id',
    description:
      'Endpoint público para consultar el detalle de una tienda por su identificador.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'Identificador numérico de la tienda',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Detalle de la tienda',
    type: Tienda,
  })
  @ApiBadRequestResponse({
    description: 'El id enviado no es numérico',
    schema: {
      example: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed (numeric string is expected)',
        error: 'Bad Request',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'No existe una tienda con ese id',
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Tienda con id 99 no encontrada',
        error: 'Not Found',
      },
    },
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tiendasService.findOne(id);
  }

  @Roles('administrador')
  @Patch(':id')
  @ApiOperation({
    summary: 'Editar una tienda (solo administrador)',
    description:
      'Actualiza una tienda existente enviando nombre, dirección y ciudad. El backend vuelve a validar que la dirección pertenezca a esa ciudad y recalcula latitud/longitud automáticamente.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'Identificador numérico de la tienda a actualizar',
    example: 1,
  })
  @ApiBody({
    type: UpdateTiendaDto,
    description:
      'Datos completos para edición de tienda. Deben enviarse nombre, dirección y ciudad.',
    examples: {
      actualizacionCompleta: {
        summary: 'Actualizar tienda con revalidación de dirección por ciudad',
        value: {
          nombre: 'Tienda Norte',
          direccion: 'Calle 23 # 13-45',
          ciudad: 'Pereira',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Tienda actualizada correctamente',
    type: Tienda,
  })
  @ApiBadRequestResponse({
    description: 'Payload inválido o id inválido',
    schema: {
      example: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'La dirección no pertenece a la ciudad seleccionada (Pereira)',
        error: 'Bad Request',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'No se envió token o el token no es válido',
  })
  @ApiForbiddenResponse({
    description: 'El usuario autenticado no tiene rol administrador',
  })
  @ApiNotFoundResponse({
    description: 'No existe una tienda con ese id',
  })
  @ApiConflictResponse({
    description: 'Ya existe otra tienda con el mismo nombre y dirección',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTiendaDto: UpdateTiendaDto,
  ) {
    return this.tiendasService.update(id, updateTiendaDto);
  }

  @Roles('administrador')
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una tienda (solo administrador)',
    description:
      'Elimina una tienda por id. Si tiene relaciones activas (por ejemplo inventarios/pedidos), retorna conflicto.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'Identificador numérico de la tienda a eliminar',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Tienda eliminada correctamente',
    type: Tienda,
  })
  @ApiBadRequestResponse({
    description: 'El id enviado no es válido',
  })
  @ApiUnauthorizedResponse({
    description: 'No se envió token o el token no es válido',
  })
  @ApiForbiddenResponse({
    description: 'El usuario autenticado no tiene rol administrador',
  })
  @ApiNotFoundResponse({
    description: 'No existe una tienda con ese id',
  })
  @ApiConflictResponse({
    description: 'No se puede eliminar la tienda por registros relacionados',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tiendasService.remove(id);
  }
}
