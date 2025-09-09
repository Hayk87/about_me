import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionImportEntity } from './transaction-import.entity';
import { Repository, EntityManager } from 'typeorm';
import { TransactionImportDetailsEntity } from './transaction-import-details.entity';
import { SystemUserEntity } from '../system-user/system-user.entity';
import { TransactionImportCreateInterface } from './interface/transaction-import-create.interface';
import { TransactionExportCreateInterface } from './interface/transaction-export-create.interface';
import { ProductsEntity } from '../products/products.entity';
import { translationsSeed } from '../utils/variables';
import { checkPermission } from '../utils/functions';
import { TransactionExportEntity } from './transaction-export.entity';
import { TransactionExportDetailsEntity } from './transaction-export-details.entity';
import { rightsMapperData } from '../utils/rights-mapper-data';
import { TransactionImportSearchInterface } from './interface/transaction-import-search.interface';
import { TransactionExportSearchInterface } from './interface/transaction-export-search.interface';
import { StaffEntity } from '../staffs/staff.entity';

@Injectable()
export class TransactionService {
  private pageSizeForImport = 5;
  private pageSizeForExport = 5;

  constructor(
    @InjectRepository(TransactionImportEntity)
    private transactionImportRepository: Repository<TransactionImportEntity>,
    @InjectRepository(TransactionImportDetailsEntity)
    private transactionImportDetailsRepository: Repository<TransactionImportDetailsEntity>,
    @InjectRepository(TransactionExportEntity)
    private transactionExportRepository: Repository<TransactionExportEntity>,
    @InjectRepository(TransactionExportDetailsEntity)
    private transactionExportDetailsRepository: Repository<TransactionExportDetailsEntity>,
  ) {}

  getTransactionImportRepository() {
    return this.transactionImportRepository;
  }

  getTransactionExportRepository() {
    return this.transactionExportRepository;
  }

  async getImportedTransactions(
    user: SystemUserEntity,
    searchParams: TransactionImportSearchInterface,
  ) {
    const hasPermissionForAll = checkPermission(
      user,
      [rightsMapperData.transactionImportReadAll],
      true,
    );
    const limit = searchParams.limit || this.pageSizeForImport;
    const offset = (searchParams.page - 1) * limit;
    const alias = 'transaction_imports';
    const qbList = this.transactionImportRepository.createQueryBuilder(alias);
    const qbCount = this.transactionImportRepository.createQueryBuilder(alias);
    qbList.leftJoinAndMapOne(
      `${alias}.operator_id`,
      SystemUserEntity,
      'users',
      `${alias}.operator_id = users.id`,
    );
    qbList.leftJoinAndMapOne(
      `users.staff_id`,
      StaffEntity,
      'staff',
      `users.staff_id = staff.id`,
    );
    qbList.select(
      `${alias}.id, ${alias}.created, ${alias}.amount, ${alias}.operator_id, users.first_name as operator_first_name, users.last_name as operator_last_name, users.email as operator_email, staff.id as staff_id, staff.title as staff_title`,
    );
    if (!hasPermissionForAll) {
      qbList.andWhere(`${alias}.operator_id = :operator_id`, {
        operator_id: user.id,
      });
      qbCount.andWhere(`${alias}.operator_id = :operator_id`, {
        operator_id: user.id,
      });
    }
    if (searchParams.created_from) {
      qbList.andWhere(`${alias}.created >= :created_from`, {
        created_from: `${searchParams.created_from} 00:00:00`,
      });
      qbCount.andWhere(`${alias}.created >= :created_from`, {
        created_from: `${searchParams.created_from} 00:00:00`,
      });
    }
    if (searchParams.created_to) {
      qbList.andWhere(`${alias}.created <= :created_to`, {
        created_to: `${searchParams.created_to} 23:59:59`,
      });
      qbCount.andWhere(`${alias}.created <= :created_to`, {
        created_to: `${searchParams.created_to} 23:59:59`,
      });
    }
    if (searchParams.amount_from) {
      qbList.andWhere(`${alias}.amount >= :amount_from`, {
        amount_from: searchParams.amount_from,
      });
      qbCount.andWhere(`${alias}.amount >= :amount_from`, {
        amount_from: searchParams.amount_from,
      });
    }
    if (searchParams.amount_to) {
      qbList.andWhere(`${alias}.amount <= :amount_to`, {
        amount_to: searchParams.amount_to,
      });
      qbCount.andWhere(`${alias}.amount <= :amount_to`, {
        amount_to: searchParams.amount_to,
      });
    }
    if (searchParams.system_user_id) {
      qbList.andWhere(`${alias}.operator_id = :system_user_id`, {
        system_user_id: searchParams.system_user_id,
      });
      qbCount.andWhere(`${alias}.operator_id = :system_user_id`, {
        system_user_id: searchParams.system_user_id,
      });
    }
    qbList.orderBy(`${alias}.created`, 'DESC');
    qbList.offset(offset);
    qbList.limit(limit);
    const [list, count] = await Promise.all([
      qbList.execute(),
      qbCount.getCount(),
    ]);
    return { list, count };
  }

  async getImportedTransactionByID(
    id: number,
    user: SystemUserEntity,
  ): Promise<TransactionImportEntity> {
    const hasPermissionForAll = checkPermission(
      user,
      [rightsMapperData.transactionImportReadAll],
      true,
    );
    const where: { id: number; operator?: { id: number } } = { id };
    if (!hasPermissionForAll) {
      where.operator = { id: user.id };
    }
    const selected = await this.transactionImportRepository.findOne({
      where,
      relations: {
        // operator: {
        //   staff: true,
        // },
        details: {
          product: true,
          product_category: true,
          measurement: true,
        },
      },
    });
    if (!selected) {
      throw new NotFoundException(translationsSeed.data_not_found.key);
    }
    // delete selected.operator?.password;
    // delete selected.operator?.secret;
    return selected;
  }

  async importTransaction(
    data: TransactionImportCreateInterface,
    user: SystemUserEntity,
  ) {
    await this.transactionImportRepository.manager.transaction(
      async (manager: EntityManager) => {
        const details: TransactionImportDetailsEntity[] = [];
        const amounts: number[] = [];
        for await (const product_details of data.details) {
          const product: ProductsEntity = await manager.findOne<ProductsEntity>(
            ProductsEntity,
            {
              where: { id: product_details.product_id },
              relations: { category: true, measurement: true },
            },
          );
          if (!product) {
            throw new BadRequestException(translationsSeed.data_not_found.key);
          }
          const detailsItem = new TransactionImportDetailsEntity();
          detailsItem.product = product;
          detailsItem.product_category = product.category;
          detailsItem.measurement = product.measurement;
          detailsItem.price = product.buy_price;
          detailsItem.count = product_details.count;
          detailsItem.amount = product.buy_price * product_details.count;
          await manager.save(detailsItem);
          details.push(detailsItem);
          amounts.push(detailsItem.amount);
          product.quantity += product_details.count;
          await manager.save(product);
        }
        const tr = new TransactionImportEntity();
        // tr.operator = user;
        tr.created = new Date();
        tr.amount = amounts.reduce((t, i) => t + i, 0);
        tr.details = details;
        await manager.save(tr);
      },
    );
  }

  async deleteTransactionImport(id: number, user: SystemUserEntity) {
    return await this.transactionImportRepository.manager.transaction(
      async (manager: EntityManager) => {
        const hasPermissionForAll = checkPermission(
          user,
          [rightsMapperData.transactionImportReadAll],
          true,
        );
        const where: { id: number; operator?: { id: number } } = { id };
        if (!hasPermissionForAll) {
          where.operator = { id: user.id };
        }
        const tr = await manager.findOne<TransactionImportEntity>(
          TransactionImportEntity,
          { where, relations: { details: true } },
        );
        if (!tr) {
          throw new BadRequestException(translationsSeed.data_not_found.key);
        }
        const details = await manager.find<TransactionImportDetailsEntity>(
          TransactionImportDetailsEntity,
          { where: { transaction: tr }, relations: { product: true } },
        );
        for await (const item of details) {
          if (!item.product) {
            throw new BadRequestException(translationsSeed.data_not_found.key);
          }
          const product = await manager.findOne<ProductsEntity>(
            ProductsEntity,
            { where: { id: item.product.id } },
          );
          product.quantity -= item.count;
          product.quantity = parseFloat(product.quantity.toFixed(4));
          if (product.quantity < 0) {
            throw new BadRequestException(
              translationsSeed.not_enough_count.key,
            );
          }
          await manager.save(product);
        }
        await manager.delete(TransactionImportEntity, tr.id);
      },
    );
  }

  async deleteTransactionImportDetails(
    trId: number,
    id: number,
    user: SystemUserEntity,
  ) {
    return await this.transactionImportRepository.manager.transaction(
      async (manager: EntityManager) => {
        const hasPermissionForAll = checkPermission(
          user,
          [rightsMapperData.transactionImportReadAll],
          true,
        );
        const where: { id: number; operator?: { id: number } } = { id: trId };
        if (!hasPermissionForAll) {
          where.operator = { id: user.id };
        }
        const transaction = await manager.findOne<TransactionImportEntity>(
          TransactionImportEntity,
          { where, relations: { details: true } },
        );
        if (!transaction) {
          throw new BadRequestException(translationsSeed.data_not_found.key);
        }
        const details = await manager.find<TransactionImportDetailsEntity>(
          TransactionImportDetailsEntity,
          { where: { transaction }, relations: { product: true } },
        );
        const detail = details.find((item) => item.id === id);
        if (!detail?.product) {
          throw new BadRequestException(translationsSeed.data_not_found.key);
        }
        const product = await manager.findOne<ProductsEntity>(ProductsEntity, {
          where: { id: detail.product.id },
        });
        product.quantity -= detail.count;
        product.quantity = parseFloat(product.quantity.toFixed(4));
        if (product.quantity < 0) {
          throw new BadRequestException(translationsSeed.not_enough_count.key);
        }
        await manager.save(product);
        if (details.length === 1) {
          await manager.delete(TransactionImportEntity, trId);
        } else {
          transaction.amount -= detail.amount;
          await manager.delete(TransactionImportDetailsEntity, id);
          await manager.save(transaction);
        }
      },
    );
  }

  async getExportedTransactions(
    user: SystemUserEntity,
    searchParams: TransactionExportSearchInterface,
  ) {
    const hasPermissionForAll = checkPermission(
      user,
      [rightsMapperData.transactionExportReadAll],
      true,
    );
    const limit = searchParams.limit || this.pageSizeForExport;
    const offset = (searchParams.page - 1) * limit;
    const alias = 'transaction_exports';
    const qbList = this.transactionExportRepository.createQueryBuilder(alias);
    const qbCount = this.transactionExportRepository.createQueryBuilder(alias);
    qbList.leftJoinAndMapOne(
      `${alias}.operator_id`,
      SystemUserEntity,
      'users',
      `${alias}.operator_id = users.id`,
    );
    qbList.leftJoinAndMapOne(
      `users.staff_id`,
      StaffEntity,
      'staff',
      `users.staff_id = staff.id`,
    );
    qbList.select(
      `${alias}.id, ${alias}.created, ${alias}.amount, ${alias}.operator_id, users.first_name as operator_first_name, users.last_name as operator_last_name, users.email as operator_email, staff.id as staff_id, staff.title as staff_title`,
    );
    if (!hasPermissionForAll) {
      qbList.andWhere(`${alias}.operator_id = :operator_id`, {
        operator_id: user.id,
      });
      qbCount.andWhere(`${alias}.operator_id = :operator_id`, {
        operator_id: user.id,
      });
    }
    if (searchParams.created_from) {
      qbList.andWhere(`${alias}.created >= :created_from`, {
        created_from: `${searchParams.created_from} 00:00:00`,
      });
      qbCount.andWhere(`${alias}.created >= :created_from`, {
        created_from: `${searchParams.created_from} 00:00:00`,
      });
    }
    if (searchParams.created_to) {
      qbList.andWhere(`${alias}.created <= :created_to`, {
        created_to: `${searchParams.created_to} 23:59:59`,
      });
      qbCount.andWhere(`${alias}.created <= :created_to`, {
        created_to: `${searchParams.created_to} 23:59:59`,
      });
    }
    if (searchParams.amount_from) {
      qbList.andWhere(`${alias}.amount >= :amount_from`, {
        amount_from: searchParams.amount_from,
      });
      qbCount.andWhere(`${alias}.amount >= :amount_from`, {
        amount_from: searchParams.amount_from,
      });
    }
    if (searchParams.amount_to) {
      qbList.andWhere(`${alias}.amount <= :amount_to`, {
        amount_to: searchParams.amount_to,
      });
      qbCount.andWhere(`${alias}.amount <= :amount_to`, {
        amount_to: searchParams.amount_to,
      });
    }
    if (searchParams.system_user_id) {
      qbList.andWhere(`${alias}.operator_id = :system_user_id`, {
        system_user_id: searchParams.system_user_id,
      });
      qbCount.andWhere(`${alias}.operator_id = :system_user_id`, {
        system_user_id: searchParams.system_user_id,
      });
    }
    qbList.orderBy(`${alias}.created`, 'DESC');
    qbList.offset(offset);
    qbList.limit(limit);
    const [list, count] = await Promise.all([
      qbList.execute(),
      qbCount.getCount(),
    ]);
    return { list, count };
  }

  async getExportedTransactionByID(
    id: number,
    user: SystemUserEntity,
  ): Promise<TransactionExportEntity> {
    const hasPermissionForAll = checkPermission(
      user,
      [rightsMapperData.transactionExportReadAll],
      true,
    );
    const where: { id: number; operator?: { id: number } } = { id };
    if (!hasPermissionForAll) {
      where.operator = { id: user.id };
    }
    const selected = await this.transactionExportRepository.findOne({
      where,
      relations: {
        // operator: {
        //   staff: true,
        // },
        details: {
          product: true,
          product_category: true,
          measurement: true,
        },
      },
    });
    if (!selected) {
      throw new NotFoundException(translationsSeed.data_not_found.key);
    }
    // delete selected.operator?.password;
    // delete selected.operator?.secret;
    return selected;
  }

  async exportTransaction(
    data: TransactionExportCreateInterface,
    user: SystemUserEntity,
  ) {
    await this.transactionExportRepository.manager.transaction(
      async (manager: EntityManager) => {
        const details: TransactionExportDetailsEntity[] = [];
        const amounts: number[] = [];
        for await (const product_details of data.details) {
          const product: ProductsEntity = await manager.findOne<ProductsEntity>(
            ProductsEntity,
            {
              where: { id: product_details.product_id },
              relations: { category: true, measurement: true },
            },
          );
          if (!product) {
            throw new BadRequestException(translationsSeed.data_not_found.key);
          }
          const detailsItem = new TransactionExportDetailsEntity();
          detailsItem.product = product;
          detailsItem.product_category = product.category;
          detailsItem.measurement = product.measurement;
          detailsItem.buy_price = product_details.buy_price;
          detailsItem.price = product.sell_price;
          detailsItem.count = product_details.count;
          detailsItem.amount = product.sell_price * product_details.count;
          await manager.save(detailsItem);
          details.push(detailsItem);
          amounts.push(detailsItem.amount);
          product.quantity -= product_details.count;
          product.quantity = parseFloat(product.quantity.toFixed(4));
          if (product.quantity < 0) {
            throw new BadRequestException(
              translationsSeed.not_enough_count.key,
            );
          }
          await manager.save(product);
        }
        const tr = new TransactionExportEntity();
        // tr.operator = user;
        tr.created = new Date();
        tr.amount = amounts.reduce((t, i) => t + i, 0);
        tr.details = details;
        await manager.save(tr);
      },
    );
  }

  async deleteTransactionExport(id: number, user: SystemUserEntity) {
    return await this.transactionExportRepository.manager.transaction(
      async (manager: EntityManager) => {
        const hasPermissionForAll = checkPermission(
          user,
          [rightsMapperData.transactionImportReadAll],
          true,
        );
        const where: { id: number; operator?: { id: number } } = { id };
        if (!hasPermissionForAll) {
          where.operator = { id: user.id };
        }
        const tr = await manager.findOne<TransactionExportEntity>(
          TransactionExportEntity,
          { where, relations: { details: true } },
        );
        if (!tr) {
          throw new BadRequestException(translationsSeed.data_not_found.key);
        }
        const details = await manager.find<TransactionExportDetailsEntity>(
          TransactionExportDetailsEntity,
          { where: { transaction: tr }, relations: { product: true } },
        );
        for await (const item of details) {
          if (!item.product) {
            throw new BadRequestException(translationsSeed.data_not_found.key);
          }
          const product = await manager.findOne<ProductsEntity>(
            ProductsEntity,
            { where: { id: item.product.id } },
          );
          product.quantity += item.count;
          await manager.save(product);
        }
        await manager.delete(TransactionExportEntity, tr.id);
      },
    );
  }

  async deleteTransactionExportDetails(
    trId: number,
    id: number,
    user: SystemUserEntity,
  ) {
    return await this.transactionExportRepository.manager.transaction(
      async (manager: EntityManager) => {
        const hasPermissionForAll = checkPermission(
          user,
          [rightsMapperData.transactionImportReadAll],
          true,
        );
        const where: { id: number; operator?: { id: number } } = { id: trId };
        if (!hasPermissionForAll) {
          where.operator = { id: user.id };
        }
        const transaction = await manager.findOne<TransactionExportEntity>(
          TransactionExportEntity,
          { where, relations: { details: true } },
        );
        if (!transaction) {
          throw new BadRequestException(translationsSeed.data_not_found.key);
        }
        const details = await manager.find<TransactionExportDetailsEntity>(
          TransactionExportDetailsEntity,
          { where: { transaction }, relations: { product: true } },
        );
        const detail = details.find((item) => item.id === id);
        if (!detail?.product) {
          throw new BadRequestException(translationsSeed.data_not_found.key);
        }
        const product = await manager.findOne<ProductsEntity>(ProductsEntity, {
          where: { id: detail.product.id },
        });
        product.quantity += detail.count;
        await manager.save(product);
        if (details.length === 1) {
          await manager.delete(TransactionExportEntity, trId);
        } else {
          transaction.amount -= detail.amount;
          await manager.delete(TransactionExportDetailsEntity, id);
          await manager.save(transaction);
        }
      },
    );
  }
}
