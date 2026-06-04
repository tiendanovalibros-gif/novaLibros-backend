import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AsistenteService } from './asistente.service';
import { ChatAsistenteDto } from './dto/chat-asistente.dto';
import { AuthGuard, RolesGuard, Roles } from '../common';
import type { JwtPayload } from '../utils';

interface AuthRequest extends Request {
  user: JwtPayload;
}

@ApiTags('asistente')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('asistente')
export class AsistenteController {
  constructor(private readonly asistenteService: AsistenteService) {}

  @Roles('cliente')
  @Get('historial')
  obtenerHistorial(@Req() req: AuthRequest) {
    return this.asistenteService.obtenerHistorial(req.user.sub);
  }

  @Roles('cliente')
  @Post('chat')
  chat(@Req() req: AuthRequest, @Body() dto: ChatAsistenteDto) {
    return this.asistenteService.chat(req.user.sub, dto);
  }
}
