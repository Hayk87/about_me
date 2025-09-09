import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Delete,
  Param,
  ParseIntPipe,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { TransactionImportCreateDto } from './dto/transaction-import-create.dto';
import { TransactionExportCreateDto } from './dto/transaction-export-create.dto';
import {
  SystemUser,
  SystemUserMetaRights,
} from '../system-user/system-user.decorator';
import { rightsMapper, translationsSeed } from '../utils/variables';
import { AuthGuard } from '../auth/auth.guard';
import { SystemUserGuard } from '../system-user/system-user.guard';
import { SystemUserEntity } from '../system-user/system-user.entity';
import { TransactionImportSearchDto } from './dto/transaction-import-search.dto';
import { TransactionImportListResponseDto } from './dto/transaction-import-list-response.dto';
import { TransactionExportListResponseDto } from './dto/transaction-export-list-response.dto';
import { TransactionExportSearchDto } from './dto/transaction-export-search.dto';
import * as pipes from './pipes';

@ApiTags('Transactions')
@ApiHeader({
  name: 'X-Auth-Token',
  description: 'Need auth token',
  required: true,
})
@UseGuards(AuthGuard, SystemUserGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  // Transaction import list
  @SystemUserMetaRights(rightsMapper.transactionImportRead)
  @ApiOkResponse({ type: TransactionImportListResponseDto, isArray: false })
  @Get('import')
  getImportedTransaction(
    @SystemUser() user: SystemUserEntity,
    @Query(pipes.TransactionImportSearchPipe)
    search: TransactionImportSearchDto,
  ) {
    return this.transactionService.getImportedTransactions(user, search);
  }
  // END: Transaction import list

  // Transaction import view item details
  @SystemUserMetaRights(rightsMapper.transactionImportReadDetails)
  @Get('import/:id')
  getImportedTransactionByID(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new BadRequestException(translationsSeed.invalid_value.key);
        },
      }),
    )
    id: number,
    @SystemUser() user: SystemUserEntity,
  ) {
    return this.transactionService.getImportedTransactionByID(id, user);
  }
  // END: Transaction import view item details

  // Transaction import create
  @SystemUserMetaRights(rightsMapper.transactionImportCreate)
  @Post('import')
  createTransactionImport(
    @Body(pipes.TransactionImportCreatePipe) post: TransactionImportCreateDto,
    @SystemUser() user: SystemUserEntity,
  ) {
    return this.transactionService.importTransaction(post, user);
  }
  // END: Transaction import create

  // Transaction import delete one
  @SystemUserMetaRights(rightsMapper.transactionImportDelete)
  @Delete('import/:id')
  deleteTransactionImport(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new BadRequestException(translationsSeed.invalid_value.key);
        },
      }),
    )
    id: number,
    @SystemUser() user: SystemUserEntity,
  ) {
    return this.transactionService.deleteTransactionImport(id, user);
  }
  // END: Transaction import delete one

  // Transaction import delete one details
  @SystemUserMetaRights(rightsMapper.transactionImportDeleteDetails)
  @Delete('import/:trId/details/:id')
  deleteTransactionImportDetails(
    @Param(
      'trId',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new BadRequestException(translationsSeed.invalid_value.key);
        },
      }),
    )
    trID: number,
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new BadRequestException(translationsSeed.invalid_value.key);
        },
      }),
    )
    id: number,
    @SystemUser() user: SystemUserEntity,
  ) {
    return this.transactionService.deleteTransactionImportDetails(
      trID,
      id,
      user,
    );
  }
  // END: Transaction import delete one details

  // Transaction export list
  @SystemUserMetaRights(rightsMapper.transactionExportRead)
  @ApiOkResponse({ type: TransactionExportListResponseDto, isArray: false })
  @Get('export')
  getExportedTransaction(
    @SystemUser() user: SystemUserEntity,
    @Query(pipes.TransactionExportSearchPipe)
    search: TransactionExportSearchDto,
  ) {
    return this.transactionService.getExportedTransactions(user, search);
  }
  // END: Transaction export list

  // Transaction export view item details
  @SystemUserMetaRights(rightsMapper.transactionExportReadDetails)
  @Get('export/:id')
  getExportedTransactionByID(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new BadRequestException(translationsSeed.invalid_value.key);
        },
      }),
    )
    id: number,
    @SystemUser() user: SystemUserEntity,
  ) {
    return this.transactionService.getExportedTransactionByID(id, user);
  }
  // END: Transaction export view item details

  // Transaction export create
  @SystemUserMetaRights(rightsMapper.transactionExportCreate)
  @Post('export')
  createTransactionExport(
    @Body(pipes.TransactionExportCreatePipe) post: TransactionExportCreateDto,
    @SystemUser() user: SystemUserEntity,
  ) {
    return this.transactionService.exportTransaction(post, user);
  }
  // END: Transaction export create

  // Transaction import delete one
  @SystemUserMetaRights(rightsMapper.transactionExportDelete)
  @Delete('export/:id')
  deleteTransactionExport(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new BadRequestException(translationsSeed.invalid_value.key);
        },
      }),
    )
    id: number,
    @SystemUser() user: SystemUserEntity,
  ) {
    return this.transactionService.deleteTransactionExport(id, user);
  }
  // END: Transaction import delete one

  // Transaction export delete one details
  @SystemUserMetaRights(rightsMapper.transactionExportDeleteDetails)
  @Delete('export/:trId/details/:id')
  deleteTransactionExportDetails(
    @Param(
      'trId',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new BadRequestException(translationsSeed.invalid_value.key);
        },
      }),
    )
    trID: number,
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new BadRequestException(translationsSeed.invalid_value.key);
        },
      }),
    )
    id: number,
    @SystemUser() user: SystemUserEntity,
  ) {
    return this.transactionService.deleteTransactionExportDetails(
      trID,
      id,
      user,
    );
  }
  // END: Transaction export delete one details
}
