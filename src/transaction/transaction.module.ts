import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionImportEntity } from './transaction-import.entity';
import { TransactionImportDetailsEntity } from './transaction-import-details.entity';
import { AuthModule } from '../auth/auth.module';
import { TransactionExportEntity } from './transaction-export.entity';
import { TransactionExportDetailsEntity } from './transaction-export-details.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      TransactionImportEntity,
      TransactionImportDetailsEntity,
      TransactionExportEntity,
      TransactionExportDetailsEntity,
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
