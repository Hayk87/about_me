import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { checkPermission } from '../utils/functions';

@Injectable()
export class SystemUserGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { systemUser } = request;
    if (!systemUser) {
      throw new BadRequestException();
    }
    const requiredRights = this.reflector.getAllAndOverride<string[]>(
      'system-user-rights',
      [context.getHandler(), context.getClass()],
    );
    return checkPermission(systemUser, requiredRights);
  }
}
