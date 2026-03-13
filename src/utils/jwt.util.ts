import * as jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';

export interface JwtPayload {
  sub: string;       // user id
  correo: string;    // email
  rol: string;       // role
}

const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno');
  }
  return secret;
};

/**
 * Genera un token JWT con el payload proporcionado.
 * @param payload - Datos del usuario a incluir en el token
 * @param expiresIn - Tiempo de expiración (por defecto '1h')
 * @returns Token JWT firmado
 */
export function signToken(payload: JwtPayload, expiresIn: StringValue | number = '1h'): string {
  const options: jwt.SignOptions = { expiresIn };
  return jwt.sign(payload, getSecret(), options);
}

/**
 * Verifica y decodifica un token JWT.
 * @param token - Token JWT a verificar
 * @returns Payload decodificado
 * @throws Error si el token es inválido o ha expirado
 */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, getSecret()) as JwtPayload;
}

/**
 * Decodifica un token JWT sin verificar la firma.
 * Útil para depuración, NO para autenticación.
 */
export function decodeToken(token: string): JwtPayload | null {
  return jwt.decode(token) as JwtPayload | null;
}
