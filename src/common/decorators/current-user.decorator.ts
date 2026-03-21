import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { JwtPayload } from '../../utils';

/**
 * Decorator para obtener el usuario actual desde el request
 *
 * @example
 * @Get('profile')
 * getProfile(@CurrentUser() user: JwtPayload) {
 *   return { userId: user.sub, correo: user.correo };
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: JwtPayload = request.user;

    // Si se especifica una propiedad, devolver solo esa propiedad
    return data ? user?.[data] : user;
  },
);
