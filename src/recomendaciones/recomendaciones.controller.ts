import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RecomendacionesService } from './recomendaciones.service';
import { AuthGuard, RolesGuard, Roles } from '../common';
import type { JwtPayload } from '../utils';

interface AuthRequest extends Request {
  user: JwtPayload;
}

@ApiTags('recomendaciones')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('recomendaciones')
export class RecomendacionesController {
  constructor(private readonly recomendacionesService: RecomendacionesService) {}

  @Roles('cliente')
  @Get('me')
  @ApiOperation({ summary: 'Recomendaciones personalizadas del cliente autenticado' })
  getRecomendaciones(@Req() req: AuthRequest) {
    return this.recomendacionesService.getForUser(req.user.sub);
  }
}
