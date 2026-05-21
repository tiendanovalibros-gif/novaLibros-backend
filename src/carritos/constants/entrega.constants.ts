import { MetodoEntrega } from '@prisma/client';

export const COSTO_ENVIO: Record<MetodoEntrega, number> = {
  [MetodoEntrega.tienda]: 0,
  [MetodoEntrega.domicilio]: 8000,
  [MetodoEntrega.express]: 18000,
};

export const TIEMPO_ESTIMADO: Record<MetodoEntrega, string> = {
  [MetodoEntrega.tienda]: 'Listo para recoger en 1-2 días hábiles',
  [MetodoEntrega.domicilio]: 'Entrega en 3-5 días hábiles',
  [MetodoEntrega.express]: 'Entrega en 24-48 horas',
};

export const NOMBRE_METODO: Record<MetodoEntrega, string> = {
  [MetodoEntrega.tienda]: 'Recogida en tienda',
  [MetodoEntrega.domicilio]: 'Envío a domicilio',
  [MetodoEntrega.express]: 'Entrega express',
};

export const DESCRIPCION_METODO: Record<MetodoEntrega, string> = {
  [MetodoEntrega.tienda]:
    'Recoge tu pedido en la tienda que elijas. Sin costo de envío.',
  [MetodoEntrega.domicilio]:
    'Envío estándar a la dirección que indiques. Disponible según stock en la red.',
  [MetodoEntrega.express]:
    'Entrega rápida cerca de tiendas con stock completo. Requiere ubicación.',
};

/** Distancia máxima (km) a una tienda que cubre el carrito para ofrecer express */
export const EXPRESS_RADIO_KM = 25;
