import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';

export const SystemUserMetaRights = (...args: string[]) =>
  SetMetadata('system-user-rights', args);

export const SystemUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.systemUser;
  },
);
