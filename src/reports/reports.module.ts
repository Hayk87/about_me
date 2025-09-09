import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { TransactionModule } from '../transaction/transaction.module';
import { ReportsService } from './reports.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TransactionModule, AuthModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
