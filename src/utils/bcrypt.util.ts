import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Hashea una contraseña en texto plano.
 * @param plainPassword - Contraseña en texto plano
 * @returns Contraseña hasheada
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * Compara una contraseña en texto plano con un hash almacenado.
 * @param plainPassword - Contraseña en texto plano
 * @param hashedPassword - Hash almacenado en la base de datos
 * @returns true si coinciden, false si no
 */
export async function comparePassword(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
