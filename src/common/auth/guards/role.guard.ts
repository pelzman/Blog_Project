import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const requiredRole =
      this.reflector.get<string[]>('roles', context.getHandler()) || [];

    const { user } = context.switchToHttp().getRequest();
    console.log(user, 'user');
    return requiredRole.length === 0 || requiredRole.includes(user.role);
  }
}
