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
import { ProductCategoriesEntity } from '../product-categories/product-categories.entity';
import { rightsMapper, translationsSeed } from '../utils/variables';
import { CreateProductInterface } from './interface/create-product.interface';
import { checkPermission } from '../utils/functions';

@Injectable()
export class ProductsService {
  private pageSize = 5;
  constructor(
    @InjectRepository(ProductsEntity) private productsRepository: Repository<ProductsEntity>,
    @InjectRepository(SystemUserEntity) private systemUserRepository: Repository<SystemUserEntity>,
    @InjectRepository(ProductCategoriesEntity) private productCategoryRepository: Repository<ProductCategoriesEntity>,
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
    const category = await this.productCategoryRepository.findOne({
      where: { id: data.category_id },
    });
    if (!category) {
      throw new BadRequestException(translationsSeed.data_not_found.key);
    }
    const product = this.productsRepository.create({
      code: data.code,
      link: data.link || null,
      title: data.title,
      content: data.content,
      price: data.price,
      operator,
      category,
      is_deleted: false,
    });
    await this.productsRepository.save(product);
    delete product.operator.password;
    delete product.operator.secret;
    return product;
  }

  async getProducts(
    searchParams: SearchProductInterface,
  ): Promise<{ list: any[]; count: number }> {
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
      'products.operator',
      SystemUserEntity,
      'operator',
      'products.created_system_user_id = operator.id',
    );
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
    if (searchParams.code) {
      qbList.andWhere(`products.code ilike :code`, {
        code: `%${searchParams.code}%`,
      });
      qbCount?.andWhere(
        `products.code ilike :code`,
        { code: `%${searchParams.code}%` },
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
    if (searchParams.price_from) {
      qbList.andWhere('products.price >= :price_from', {
        price_from: searchParams.price_from,
      });
      qbCount?.andWhere('products.price >= :price_from', {
        price_from: searchParams.price_from,
      });
    }
    if (searchParams.price_to) {
      qbList.andWhere('products.price <= :price_to', {
        price_to: searchParams.price_to,
      });
      qbCount?.andWhere('products.price <= :price_to', {
        price_to: searchParams.price_to,
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

    return { list, count };
  }

  async getProductById(
    id: number,
    withRelations: boolean = true,
  ): Promise<ProductsEntity> {
    const product = await this.productsRepository.findOne({
      where: { is_deleted: false, id },
      relations: {
        category: withRelations,
        operator: withRelations,
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
  ): Promise<ProductsEntity> {
    const product = await this.getProductById(id, true);
    if (product.category.id !== data.category_id) {
      const category = await this.productCategoryRepository.findOne({
        where: { id: data.category_id },
      });
      if (!category) {
        throw new BadRequestException(translationsSeed.data_not_found.key);
      }
      product.category = category;
    }
    product.title = data.title;
    product.price = data.price;
    product.code = data.code;
    product.link = data.link || null;
    return await this.productsRepository.save(product);
  }

  async deleteProduct(id: number): Promise<void> {
    const product = await this.getProductById(id, false);
    product.is_deleted = true;
    await this.productsRepository.save(product);
  }
}
