import { Injectable, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StripeService {
  // InstanceType<typeof Stripe> evita el conflicto de namespace
  private readonly stripe: InstanceType<typeof Stripe>;

  constructor(private readonly prisma: PrismaService) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error(
        'STRIPE_SECRET_KEY no está definido en las variables de entorno',
      );
    }
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2026-04-22.dahlia', // versión que tiene instalada tu paquete
    });
  }

  async getOrCreateStripeCustomer(idUsuario: string): Promise<string> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: idUsuario },
      select: {
        id: true,
        correo: true,
        nombre: true,
        apellido: true,
        stripeCustomerId: true,
      },
    });

    if (!usuario) {
      throw new BadRequestException('Usuario no encontrado');
    }

    if ((usuario as any).stripeCustomerId) {
      return (usuario as any).stripeCustomerId as string;
    }

    const customer = await this.stripe.customers.create({
      email: usuario.correo,
      name: `${usuario.nombre} ${usuario.apellido}`,
      metadata: { idUsuario },
    });

    await this.prisma.usuario.update({
      where: { id: idUsuario },
      data: { stripeCustomerId: customer.id } as any,
    });

    return customer.id;
  }

  async createSetupIntent(
    idUsuario: string,
  ): Promise<{ clientSecret: string }> {
    const customerId = await this.getOrCreateStripeCustomer(idUsuario);

    const setupIntent = await this.stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
    });

    return { clientSecret: setupIntent.client_secret! };
  }

  async getPaymentMethodDetails(
    paymentMethodId: string,
  ): Promise<{ last4: string; brand: string; funding: string }> {
    const pm = await this.stripe.paymentMethods.retrieve(paymentMethodId);

    if (!pm.card) {
      throw new BadRequestException('El método de pago no es una tarjeta');
    }

    return {
      last4: pm.card.last4,
      brand: pm.card.brand,
      funding: pm.card.funding,
    };
  }

  async chargePaymentMethod(params: {
    amount: number;
    customerId: string;
    paymentMethodId: string;
    description: string;
    idUsuario: string;
  }): Promise<{ id: string; status: string }> {
    // COP no es zero-decimal → multiplicar por 100
    const amountInCentavos = Math.round(params.amount * 100);

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amountInCentavos,
      currency: 'cop',
      customer: params.customerId,
      payment_method: params.paymentMethodId,
      off_session: true,
      confirm: true,
      description: params.description,
      metadata: { idUsuario: params.idUsuario },
    });

    if (paymentIntent.status !== 'succeeded') {
      throw new BadRequestException(
        `El pago no fue aprobado. Estado: ${paymentIntent.status}`,
      );
    }

    return { id: paymentIntent.id, status: paymentIntent.status };
  }
}
