import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Headers,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiHeader } from '@nestjs/swagger';
import { LoginParamsDto } from './dto/login-params.dto';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthGuard } from './auth.guard';
import { SystemUser } from '../system-user/system-user.decorator';
import { SystemUserEntity } from '../system-user/system-user.entity';
import * as pipes from './pipes';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOkResponse({
    type: LoginResponseDto,
    isArray: false,
  })
  @Post('login')
  login(
    @Body(pipes.AuthLoginPipe) body: LoginParamsDto,
  ): Promise<
    { token: string; system_user: SystemUserEntity } | { verifyBy2FA: boolean }
  > {
    return this.authService.signIn(
      body.email,
      body.password,
      body.authenticator_token,
    );
  }

  @ApiHeader({
    name: 'x-auth-token',
    description: 'Auth Token!',
    required: true,
  })
  @UseGuards(AuthGuard)
  @Get('info')
  getMe(@SystemUser() user) {
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  @ApiHeader({
    name: 'x-auth-token',
    description: 'Token that will be invalid!',
    required: true,
  })
  @Put('logout')
  async logout(@Headers('x-auth-token') token: string): Promise<void> {
    await this.authService.logout(token);
  }
}
