import { createHmac } from 'node:crypto';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { translationsSeed } from './variables';

export const createHashHmac = (plainText: string, secret: string) => {
  return createHmac('sha256', secret).update(plainText).digest('hex');
};

export const randomString = (num: number = 8): string => {
  const data =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=';
  let result = '';
  for (let i = 0; i < num; i++) {
    const index = Math.floor(Math.random() * 76);
    result += data[index];
  }
  return result;
};

export const checkPermission = (
  user: any,
  permission: string[],
  returnResult = false,
) => {
  if (user.is_deleted) {
    throw new BadRequestException(translationsSeed.system_user_is_deleted.key);
  }
  if (user.is_blocked) {
    throw new BadRequestException(translationsSeed.system_user_is_blocked.key);
  }
  if (user.is_root) {
    return true;
  }
  const right_codes = user.staff?.rights || [];
  if (!right_codes.some((item) => permission.includes(item))) {
    // console.log('requiredRights', right_codes);
    // console.log('permission', permission);
    // console.log('systemUser', user);
    if (returnResult) return false;
    throw new ForbiddenException(translationsSeed.forbidden_request.key);
  }
  return true;
};
