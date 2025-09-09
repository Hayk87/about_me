import { Module } from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { StaffsController } from './staffs.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffEntity } from './staff.entity';
import { RightsEntity } from '../rights/rights.entity';
import { SystemUserEntity } from '../system-user/system-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StaffEntity, RightsEntity, SystemUserEntity]),
    AuthModule,
  ],
  controllers: [StaffsController],
  providers: [StaffsService],
})
export class StaffsModule {}
