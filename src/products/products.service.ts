import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsEntity } from './products.entity';
import { SystemUserEntity } from '../system-user/system-user.entity';
import { MeasurementsEntity } from '../measurement/measurements.entity';
import { ProductCategoriesEntity } from '../product-categories/product-categories.entity';
import { TransactionImportDetailsEntity } from '../transaction/transaction-import-details.entity';
import { rightsMapper, translationsSeed } from '../utils/variables';
import { CreateProductInterface } from './interface/create-product.interface';
import { checkPermission } from '../utils/functions';

@Injectable()
export class ProductsService {
  private pageSize = 5;
  constructor(
    @InjectRepository(ProductsEntity)
    private productsRepository: Repository<ProductsEntity>,
    @InjectRepository(SystemUserEntity)
    private systemUserRepository: Repository<SystemUserEntity>,
    @InjectRepository(MeasurementsEntity)
    private measurementRepository: Repository<MeasurementsEntity>,
    @InjectRepository(ProductCategoriesEntity)
    private productCategoryRepository: Repository<ProductCategoriesEntity>,
  ) {}

  async createProduct(
    data: CreateProductInterface,
    operator_id: number,
  ): Promise<ProductsEntity> {
    const operator = await this.systemUserRepository.findOne({
      where: { id: operator_id },
    });
    if (!operator) {
      throw new BadRequestException(translationsSeed.user_not_found.key);
    }
    const measurement = await this.measurementRepository.findOne({
      where: { id: data.measurement_id },
    });
    if (!measurement) {
      throw new BadRequestException(translationsSeed.data_not_found.key);
    }
    const category = await this.productCategoryRepository.findOne({
      where: { id: data.category_id },
    });
    if (!category) {
      throw new BadRequestException(translationsSeed.data_not_found.key);
    }
    const product = this.productsRepository.create({
      ...data,
      // operator,
      measurement,
      category,
      is_deleted: false,
    });
    await this.productsRepository.save(product);
    // delete product.operator.password;
    // delete product.operator.secret;
    return product;
  }

  async getProducts(
    searchParams: SearchProductInterface,
  ): Promise<{ list: ProductsEntity[]; count: number }> {
    const limit = searchParams.limit || this.pageSize;
    const offset = (searchParams.page - 1) * limit;
    const qbList = this.productsRepository.createQueryBuilder('products');
    const qbCount = !searchParams.all
      ? this.productsRepository.createQueryBuilder('products')
      : null;
    qbList.leftJoinAndMapOne(
      'products.category',
      ProductCategoriesEntity,
      'category',
      'products.category_id = category.id',
    );
    qbList.leftJoinAndMapOne(
      'products.measurement',
      MeasurementsEntity,
      'measurement',
      'products.measurement_id = measurement.id',
    );
    qbList.leftJoinAndMapOne(
      'products.operator',
      SystemUserEntity,
      'operator',
      'products.created_system_user_id = operator.id',
    );
    if (searchParams.all) {
      qbList.leftJoinAndSelect(
        'products.transaction_imports',
        'product_transaction_imports_details',
      );
    }
    qbList.andWhere('products.is_deleted = :is_deleted', { is_deleted: false });
    qbCount?.andWhere('products.is_deleted = :is_deleted', {
      is_deleted: false,
    });
    if (searchParams.title) {
      qbList.andWhere(`products.title->>'${searchParams.lang}' ilike :title`, {
        title: `%${searchParams.title}%`,
      });
      qbCount?.andWhere(
        `products.title->>'${searchParams.lang}' ilike :title`,
        { title: `%${searchParams.title}%` },
      );
    }
    if (searchParams.category_id) {
      qbList.andWhere('products.category_id = :category_id', {
        category_id: searchParams.category_id,
      });
      qbCount?.andWhere('products.category_id = :category_id', {
        category_id: searchParams.category_id,
      });
    }
    if (searchParams.measurement_id) {
      qbList.andWhere('products.measurement_id = :measurement_id', {
        measurement_id: searchParams.measurement_id,
      });
      qbCount?.andWhere('products.measurement_id = :measurement_id', {
        measurement_id: searchParams.measurement_id,
      });
    }
    if (searchParams.quantity_from) {
      qbList.andWhere('products.quantity >= :quantity_from', {
        quantity_from: searchParams.quantity_from,
      });
      qbCount?.andWhere('products.quantity >= :quantity_from', {
        quantity_from: searchParams.quantity_from,
      });
    }
    if (searchParams.quantity_to) {
      qbList.andWhere('products.quantity <= :quantity_to', {
        quantity_to: searchParams.quantity_to,
      });
      qbCount?.andWhere('products.quantity <= :quantity_to', {
        quantity_to: searchParams.quantity_to,
      });
    }
    if (searchParams.buy_price_from) {
      qbList.andWhere('products.buy_price >= :buy_price_from', {
        buy_price_from: searchParams.buy_price_from,
      });
      qbCount?.andWhere('products.buy_price >= :buy_price_from', {
        buy_price_from: searchParams.buy_price_from,
      });
    }
    if (searchParams.buy_price_to) {
      qbList.andWhere('products.buy_price <= :buy_price_to', {
        buy_price_to: searchParams.buy_price_to,
      });
      qbCount?.andWhere('products.buy_price <= :buy_price_to', {
        buy_price_to: searchParams.buy_price_to,
      });
    }
    if (searchParams.sell_price_from) {
      qbList.andWhere('products.sell_price >= :sell_price_from', {
        sell_price_from: searchParams.sell_price_from,
      });
      qbCount?.andWhere('products.sell_price >= :sell_price_from', {
        sell_price_from: searchParams.sell_price_from,
      });
    }
    if (searchParams.sell_price_to) {
      qbList.andWhere('products.sell_price <= :sell_price_to', {
        sell_price_to: searchParams.sell_price_to,
      });
      qbCount?.andWhere('products.sell_price <= :sell_price_to', {
        sell_price_to: searchParams.sell_price_to,
      });
    }
    qbList.orderBy('products.created_at', 'DESC');
    if (!searchParams.all) {
      qbList.offset(offset);
      qbList.limit(limit);
    }
    // console.log('qbList', qbList.getQuery());
    const [list, count] = await Promise.all([
      qbList.getMany(),
      qbCount?.getCount(),
    ]);
    // console.log('list >>>>>>>>>', list, count);

    return {
      list: list.map((item: any) => {
        item.operator.secret = undefined;
        item.operator.password = undefined;
        return item;
      }),
      count,
    };
  }

  async getProductById(
    id: number,
    withRelations: boolean = true,
  ): Promise<ProductsEntity> {
    const product = await this.productsRepository.findOne({
      where: { is_deleted: false, id },
      relations: {
        measurement: withRelations,
        category: withRelations,
        // operator: withRelations,
      },
    });
    if (!product) {
      throw new NotFoundException(translationsSeed.data_not_found.key);
    }
    // delete product.operator?.password;
    // delete product.operator?.secret;
    return product;
  }

  async updateProduct(
    id: number,
    data: CreateProductInterface,
    user: SystemUserEntity,
  ): Promise<ProductsEntity> {
    const product = await this.getProductById(id, true);
    if (product.category.id !== data.category_id) {
      const category = await this.productCategoryRepository.findOne({
        where: { id: data.category_id },
      });
      if (!category) {
        throw new BadRequestException(translationsSeed.data_not_found.key);
      }
      const unavailableForChangeOtherParams = checkPermission(
        user,
        [
          rightsMapper.productUpdateOnlyBuyPrice,
          rightsMapper.productUpdateOnlySellPrice,
        ],
        true,
      );
      if (unavailableForChangeOtherParams && !user.is_root) {
        throw new ForbiddenException(translationsSeed.forbidden_request.key);
      }
      product.category = category;
    }
    if (product.measurement.id !== data.measurement_id) {
      const measurement = await this.measurementRepository.findOne({
        where: { id: data.measurement_id },
      });
      if (!measurement) {
        throw new BadRequestException(translationsSeed.data_not_found.key);
      }
      const unavailableForChangeOtherParams = checkPermission(
        user,
        [
          rightsMapper.productUpdateOnlyBuyPrice,
          rightsMapper.productUpdateOnlySellPrice,
        ],
        true,
      );
      if (unavailableForChangeOtherParams && !user.is_root) {
        throw new ForbiddenException(translationsSeed.forbidden_request.key);
      }
      product.measurement = measurement;
    }
    if (product.quantity !== data.quantity) {
      const unavailableForChangeOtherParams = checkPermission(
        user,
        [
          rightsMapper.productUpdateOnlyBuyPrice,
          rightsMapper.productUpdateOnlySellPrice,
        ],
        true,
      );
      if (unavailableForChangeOtherParams && !user.is_root) {
        throw new ForbiddenException(translationsSeed.forbidden_request.key);
      }
    }
    if (product.buy_price !== data.buy_price) {
      const p1 = checkPermission(
        user,
        [rightsMapper.productUpdateOnlyBuyPrice],
        true,
      );
      const p2 = checkPermission(
        user,
        [rightsMapper.productUpdateOnlySellPrice],
        true,
      );
      if (!p1 && p2 && !user.is_root) {
        throw new ForbiddenException(translationsSeed.forbidden_request.key);
      }
    }
    if (product.sell_price !== data.sell_price) {
      const p1 = checkPermission(
        user,
        [rightsMapper.productUpdateOnlyBuyPrice],
        true,
      );
      const p2 = checkPermission(
        user,
        [rightsMapper.productUpdateOnlySellPrice],
        true,
      );
      if (p1 && !p2 && !user.is_root) {
        throw new ForbiddenException(translationsSeed.forbidden_request.key);
      }
    }
    product.title = data.title;
    product.buy_price = data.buy_price;
    product.sell_price = data.sell_price;
    product.quantity = data.quantity;
    return await this.productsRepository.save(product);
  }

  async deleteProduct(id: number): Promise<void> {
    const product = await this.getProductById(id, false);
    product.is_deleted = true;
    await this.productsRepository.save(product);
  }
}
