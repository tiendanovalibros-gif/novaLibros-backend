import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateSaldosUsuarioDto } from './dto/create-saldos-usuario.dto';
import { UpdateSaldosUsuarioDto } from './dto/update-saldos-usuario.dto';
import { RecargarSaldoDto } from './dto/recargar-saldo.dto';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from '../stripe/stripe.service';

@Injectable()
export class SaldosUsuarioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
  ) {}

  create(createSaldosUsuarioDto: CreateSaldosUsuarioDto) {
    return this.prisma.saldoUsuario.create({
      data: createSaldosUsuarioDto as any,
    });
  }

  findAll() {
    return this.prisma.saldoUsuario.findMany();
  }

  async findByUsuario(idUsuario: string) {
    const saldo = await this.prisma.saldoUsuario.findFirst({
      where: { idUsuario },
    });
    return saldo ?? { id: null, idUsuario, saldoDisponible: 0 };
  }

  findOne(id: number) {
    return this.prisma.saldoUsuario.findUnique({ where: { id } });
  }

  update(id: number, updateSaldosUsuarioDto: UpdateSaldosUsuarioDto) {
    return this.prisma.saldoUsuario.update({
      where: { id },
      data: updateSaldosUsuarioDto as any,
    });
  }

  /**
   * Recarga el saldo del usuario usando su tarjeta guardada en Stripe.
   *
   * Flujo:
   * 1. Verifica que el método de pago pertenece al usuario
   * 2. Obtiene el stripeCustomerId y stripePaymentMethodId
   * 3. Crea un PaymentIntent en Stripe (off-session, confirm: true)
   * 4. Si Stripe lo aprueba → actualiza saldo en BD y registra movimiento
   */
  async recargar(idUsuario: string, dto: RecargarSaldoDto) {
    if (!dto.monto || dto.monto <= 0) {
      throw new BadRequestException('El monto debe ser mayor a 0');
    }

    // 1. Verificar que el método de pago pertenece al usuario y tiene ID de Stripe
    const metodo = await this.prisma.metodoPago.findFirst({
      where: { id: dto.idMetodoPago, idUsuario },
    });

    if (!metodo) {
      throw new ForbiddenException('Método de pago no válido');
    }

    const stripePaymentMethodId = (metodo as any).stripePaymentMethodId as
      | string
      | null;

    if (!stripePaymentMethodId) {
      throw new BadRequestException(
        'Esta tarjeta no tiene un método de pago de Stripe asociado. ' +
          'Por favor elimínala y agrégala nuevamente.',
      );
    }

    // 2. Obtener o crear el Stripe Customer del usuario
    const stripeCustomerId =
      await this.stripeService.getOrCreateStripeCustomer(idUsuario);

    // 3. Cobrar con Stripe (esto puede lanzar error si la tarjeta es rechazada)
    try {
      await this.stripeService.chargePaymentMethod({
        amount: dto.monto,
        customerId: stripeCustomerId,
        paymentMethodId: stripePaymentMethodId,
        description: `Recarga de saldo NovaLibros — ${dto.monto.toLocaleString('es-CO')} COP`,
        idUsuario,
      });
    } catch (error: any) {
      // Stripe lanza errores tipados; extraemos el mensaje para el usuario
      const stripeMessage: string =
        error?.raw?.message ||
        error?.message ||
        'El pago fue rechazado por la pasarela de pagos';

      throw new BadRequestException(`Pago rechazado: ${stripeMessage}`);
    }

    // 4. Stripe aprobó el cobro → actualizar saldo en BD
    const saldoActual = await this.prisma.saldoUsuario.findFirst({
      where: { idUsuario },
    });

    let saldo;
    if (saldoActual) {
      saldo = await this.prisma.saldoUsuario.update({
        where: { id: saldoActual.id },
        data: { saldoDisponible: { increment: dto.monto } },
      });
    } else {
      saldo = await this.prisma.saldoUsuario.create({
        data: { idUsuario, saldoDisponible: dto.monto },
      });
    }

    // 5. Registrar movimiento de saldo
    await this.prisma.movimientoSaldo.create({
      data: {
        idUsuario,
        tipoMovimiento: 'recarga',
        monto: dto.monto,
        idMetodoPago: dto.idMetodoPago,
      },
    });

    return saldo;
  }

  remove(id: number) {
    return this.prisma.saldoUsuario.delete({ where: { id } });
  }
}
