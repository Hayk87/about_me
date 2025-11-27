import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategoriesEntity } from './product-categories.entity';
import { translationsSeed } from '../utils/variables';
import { CreateUpdateProductCategoryDto } from './dto/create-update-product-category.dto';
import { SearchProductCategoryInterface } from './interface/search-product-category.interface';

@Injectable()
export class ProductCategoriesService {
  private pageSize = 5;
  constructor(
    @InjectRepository(ProductCategoriesEntity) private productCategoriesRepository: Repository<ProductCategoriesEntity>,
  ) {}

  async getAll(searchParams: SearchProductCategoryInterface) {
    const limit = searchParams.limit || this.pageSize;
    const offset = (searchParams.page - 1) * limit;
    const alias = 'product_category';
    const qbList = this.productCategoriesRepository
      .createQueryBuilder(alias)
      .andWhere(`${alias}.is_deleted=:is_deleted`, { is_deleted: false });
    const qbCount = !searchParams.all
      ? this.productCategoriesRepository
          .createQueryBuilder(alias)
          .andWhere(`${alias}.is_deleted=:is_deleted`, { is_deleted: false })
      : null;
    if (searchParams.title && searchParams.lang) {
      qbList.andWhere(`${alias}.title->>'${searchParams.lang}' ilike :title`, {
        title: `%${searchParams.title}%`,
      });
      qbCount?.andWhere(
        `${alias}.title->>'${searchParams.lang}' ilike :title`,
        { title: `%${searchParams.title}%` },
      );
    }
    if (searchParams.code) {
      qbList.andWhere(`${alias}.code ilike :code`, {
        code: `%${searchParams.code}%`,
      });
      qbCount?.andWhere(
        `${alias}.code ilike :code`,
        { code: `%${searchParams.code}%` },
      );
    }
    qbList.orderBy(`${alias}.id`, 'DESC');
    if (!searchParams.all) {
      qbList.offset(offset);
      qbList.limit(limit);
    }
    const [list, count] = await Promise.all([
      qbList.execute(),
      qbCount?.getCount(),
    ]);
    return { list, count };
  }

  async getAllForWeb() {
    const alias = 'product_category';
    const qbList = this.productCategoriesRepository
      .createQueryBuilder(alias)
      .andWhere(`${alias}.is_deleted=:is_deleted`, { is_deleted: false })
      .andWhere(`${alias}.is_public=:is_public`, { is_public: true });
    qbList.orderBy(`${alias}.id`, 'DESC');
    const list = await qbList.execute();
    return { list };
  }

  async createProductCategory(
    data: CreateUpdateProductCategoryDto,
  ): Promise<ProductCategoriesEntity> {
    let item = this.productCategoriesRepository.create({
      title: data.title,
      code: data.code,
      is_public: data.is_public
    });
    item = await this.productCategoriesRepository.save(item);
    return item;
  }

  async findProductCategoryById(id: number): Promise<ProductCategoriesEntity> {
    const exists = await this.productCategoriesRepository.findOne({
      where: { id, is_deleted: false },
    });
    if (!exists) {
      throw new NotFoundException(translationsSeed.data_not_found.key);
    }
    return exists;
  }

  async updateProductCategory(
    id: number,
    data: CreateUpdateProductCategoryDto,
  ): Promise<ProductCategoriesEntity> {
    const item = await this.findProductCategoryById(id);
    item.title = data.title;
    item.code = data.code;
    item.is_public = data.is_public;
    await this.productCategoriesRepository.save(item);
    return item;
  }

  async deleteProductCategory(id: number): Promise<void> {
    const item = await this.findProductCategoryById(id);
    item.is_deleted = true;
    await this.productCategoriesRepository.save(item);
  }
}
