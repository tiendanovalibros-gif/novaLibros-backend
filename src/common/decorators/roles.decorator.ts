import { SetMetadata } from '@nestjs/common';

/**
 * Decorator para especificar qué roles pueden acceder a una ruta
 *
 * @param roles - Lista de roles permitidos
 *
 * @example
 * @Roles('admin', 'vendedor')
 * @Get('sensitive-data')
 * getSensitiveData() { ... }
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
