import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemUserController } from './system-user.controller';
import { SystemUserService } from './system-user.service';
import { SystemUserEntity } from './system-user.entity';
import { AuthModule } from '../auth/auth.module';
import { StaffEntity } from '../staffs/staff.entity';
import { SpeakeasyService } from '../speakeasy/speakeasy.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SystemUserEntity, StaffEntity]),
    forwardRef(() => AuthModule),
  ],
  controllers: [SystemUserController],
  providers: [SystemUserService, SpeakeasyService],
  exports: [SpeakeasyService],
})
export class SystemUserModule {}
