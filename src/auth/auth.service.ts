import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, IsNull } from 'typeorm';
import { SystemUserEntity } from '../system-user/system-user.entity';
import { createHashHmac, randomString } from '../utils/functions';
import { SystemUserTokensEntity } from '../system-user/system-user-tokens.entity';
import { translationsSeed } from '../utils/variables';
import { SpeakeasyService } from '../speakeasy/speakeasy.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(SystemUserEntity)
    private systemUserRepository: Repository<SystemUserEntity>,
    @InjectRepository(SystemUserTokensEntity)
    private systemUserTokenRepository: Repository<SystemUserTokensEntity>,
    private speakeasyService: SpeakeasyService,
  ) {}

  setLoginDurationDate() {
    return new Date(
      Date.now() +
        (parseInt(process.env.LOGIN_DURATION_MINUTE) || 60) * 60 * 1000,
    );
  }

  async signIn(
    email: string,
    password: string,
    authenticator_token?: string,
  ): Promise<
    { token: string; system_user: SystemUserEntity } | { verifyBy2FA: boolean }
  > {
    const systemUser = await this.systemUserRepository.findOne({
      where: { email },
    });
    if (!systemUser) {
      throw new BadRequestException(translationsSeed.wrong_email_password.key);
    }
    const passwordHash = createHashHmac(password, systemUser.secret);
    if (passwordHash !== systemUser.password) {
      throw new BadRequestException(translationsSeed.wrong_email_password.key);
    }
    if (systemUser.authenticator_enabled) {
      if (!authenticator_token) {
        return { verifyBy2FA: true };
      } else {
        const isVerified = this.speakeasyService.verify2FA(
          systemUser.authenticator.base32,
          authenticator_token,
        );
        if (!isVerified) {
          throw new BadRequestException({
            message: {
              authenticator_token: translationsSeed.invalid_value.key,
            },
          });
        }
      }
    }
    const token =
      systemUser.id.toString() + Date.now().toString() + randomString(100);
    const genToken = this.systemUserTokenRepository.create({
      token,
      system_user: systemUser,
      expiration: this.setLoginDurationDate(),
    });
    await this.systemUserTokenRepository.save(genToken);
    const tokenObject = await this.getSystemUserByToken(token);
    const { password: _p, secret: _s, ...rest } = tokenObject.system_user;
    return { token, system_user: rest };
  }

  async logout(token: string) {
    if (!token) {
      throw new BadRequestException(translationsSeed.empty_auth_token.key);
    }
    const existsToken = await this.systemUserTokenRepository.findOne({
      where: { token, logout_at: IsNull(), expiration: MoreThan(new Date()) },
    });
    if (!existsToken) {
      throw new BadRequestException(translationsSeed.invalid_auth_token.key);
    }
    existsToken.logout_at = new Date();
    await this.systemUserTokenRepository.save(existsToken);
    return existsToken;
  }

  async getSystemUserByToken(token: string) {
    const tokenObj: any = await this.systemUserTokenRepository.findOne({
      where: {
        token,
        logout_at: IsNull(),
        expiration: MoreThan(new Date()),
      },
      relations: {
        system_user: {
          staff: {
            rights: true,
          },
        },
      },
    });
    if (tokenObj?.system_user?.staff?.rights) {
      tokenObj.system_user.staff.rights =
        tokenObj?.system_user?.staff?.rights.map((item) => item.code);
    }
    return tokenObj;
  }

  async checkExpirationDate(expiration: Date, token_id: number) {
    const limitMinute =
      parseInt(process.env.LOGIN_EXPIRATION_LONG_DURATION_MINUTE) || 15;
    const duration = expiration.getTime() - new Date().getTime();
    const durationMinute = duration / (60 * 1000);
    if (durationMinute < limitMinute) {
      const userCurrentToken = await this.systemUserTokenRepository.findOne({
        where: { id: token_id },
      });
      userCurrentToken.expiration = this.setLoginDurationDate();
      await this.systemUserTokenRepository.save(userCurrentToken);
    }
  }
}
