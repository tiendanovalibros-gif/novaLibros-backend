import { SetMetadata } from '@nestjs/common';

/**
 * Decorator para marcar rutas como públicas (sin autenticación requerida)
 *
 * @example
 * @Public()
 * @Post('login')
 * login(@Body() loginDto: LoginDto) { ... }
 */
export const Public = () => SetMetadata('isPublic', true);
