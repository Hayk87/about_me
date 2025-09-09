import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RightsController } from './rights.controller';
import { RightsService } from './rights.service';
import { RightsEntity } from './rights.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([RightsEntity]), AuthModule],
  controllers: [RightsController],
  providers: [RightsService],
})
export class RightsModule {}
