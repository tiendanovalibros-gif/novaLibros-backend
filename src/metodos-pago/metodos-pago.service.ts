import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateMetodosPagoDto } from './dto/create-metodos-pago.dto';
import { UpdateMetodosPagoDto } from './dto/update-metodos-pago.dto';
import { ConfirmarMetodoPagoDto } from './dto/confirmar-metodo-pago.dto';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from '../stripe/stripe.service';
import { TipoTarjeta } from '@prisma/client';

@Injectable()
export class MetodosPagoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
  ) {}

  // ─── Stripe: crear SetupIntent para que el frontend muestre el form de Stripe ───

  async createSetupIntent(
    idUsuario: string,
  ): Promise<{ clientSecret: string }> {
    return this.stripeService.createSetupIntent(idUsuario);
  }

  // ─── Stripe: guardar la tarjeta después de que el frontend confirma el SetupIntent ───

  async confirmarYGuardarTarjeta(
    idUsuario: string,
    dto: ConfirmarMetodoPagoDto,
  ) {
    // Recuperar detalles de la tarjeta desde Stripe
    let cardDetails: { last4: string; brand: string; funding: string };
    try {
      cardDetails = await this.stripeService.getPaymentMethodDetails(
        dto.paymentMethodId,
      );
    } catch {
      throw new BadRequestException(
        'No se pudo verificar la tarjeta con Stripe. Intenta de nuevo.',
      );
    }

    // Construir número enmascarado con los últimos 4 dígitos reales
    const numeroEnmascarado = `****-****-****-${cardDetails.last4}`;

    // Determinar el tipo (usa el del DTO, o deriva del funding de Stripe)
    const tipo: TipoTarjeta = dto.tipo as TipoTarjeta;

    // Guardar en BD
    const metodoPago = await this.prisma.metodoPago.create({
      data: {
        idUsuario,
        tipo,
        numeroEnmascarado,
        titular: dto.titular,
        stripePaymentMethodId: dto.paymentMethodId,
      } as any,
    });

    return metodoPago;
  }

  // ─── Métodos existentes (sin cambios) ───────────────────────────────────────

  create(createMetodosPagoDto: CreateMetodosPagoDto) {
    return this.prisma.metodoPago.create({ data: createMetodosPagoDto as any });
  }

  createForUsuario(idUsuario: string, dto: CreateMetodosPagoDto) {
    const { tipo, numeroEnmascarado, titular } = dto;
    return this.prisma.metodoPago.create({
      data: {
        idUsuario,
        tipo: tipo as TipoTarjeta,
        numeroEnmascarado,
        titular,
      },
    });
  }

  findAll() {
    return this.prisma.metodoPago.findMany();
  }

  findByUsuario(idUsuario: string) {
    return this.prisma.metodoPago.findMany({
      where: { idUsuario },
      orderBy: { id: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.metodoPago.findUnique({ where: { id } });
  }

  update(id: number, updateMetodosPagoDto: UpdateMetodosPagoDto) {
    return this.prisma.metodoPago.update({
      where: { id },
      data: updateMetodosPagoDto as any,
    });
  }

  async removeIfOwner(id: number, idUsuario: string) {
    const metodo = await this.prisma.metodoPago.findUnique({ where: { id } });
    if (!metodo || metodo.idUsuario !== idUsuario) {
      throw new ForbiddenException(
        'No tienes permiso para eliminar este metodo de pago',
      );
    }
    return this.prisma.metodoPago.delete({ where: { id } });
  }

  remove(id: number) {
    return this.prisma.metodoPago.delete({ where: { id } });
  }
}
