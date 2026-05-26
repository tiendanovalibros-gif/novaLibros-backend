-- Agrega stripeCustomerId a la tabla usuario
ALTER TABLE "usuario" ADD COLUMN "stripe_customer_id" TEXT;
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_stripe_customer_id_key" UNIQUE ("stripe_customer_id");

-- Agrega stripePaymentMethodId a la tabla metodo_pago
ALTER TABLE "metodo_pago" ADD COLUMN "stripe_payment_method_id" TEXT;
