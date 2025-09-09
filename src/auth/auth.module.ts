import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SystemUserEntity } from '../system-user/system-user.entity';
import { SystemUserTokensEntity } from '../system-user/system-user-tokens.entity';
import { SystemUserModule } from '../system-user/system-user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SystemUserEntity, SystemUserTokensEntity]),
    forwardRef(() => SystemUserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
