import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { translationsSeed } from '../utils/variables';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['x-auth-token'];
    if (!token) {
      throw new UnauthorizedException(translationsSeed.empty_auth_token.key);
    }
    const tokenObject = await this.authService.getSystemUserByToken(token);
    if (!tokenObject?.system_user) {
      throw new UnauthorizedException(translationsSeed.invalid_auth_token.key);
    }
    await this.authService.checkExpirationDate(
      tokenObject.expiration,
      tokenObject.id,
    );
    const {
      password: _p,
      secret: _s,
      authenticator: _a,
      ...systemUser
    } = tokenObject?.system_user;
    request.systemUser = systemUser;
    return true;
  }
}
