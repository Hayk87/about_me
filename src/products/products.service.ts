import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, DataSource } from 'typeorm';
import { ProductsEntity } from './products.entity';
import { SystemUserEntity } from '../system-user/system-user.entity';
import { ProductCategoriesEntity } from '../product-categories/product-categories.entity';
import { rightsMapper, translationsSeed } from '../utils/variables';
import { CreateProductInterface } from './interface/create-product.interface';
import { checkPermission } from '../utils/functions';
import { FilesService } from "../files/files.service";
import { UpdateProductInterface } from "./interface/update-product.interface";

@Injectable()
export class ProductsService {
  private pageSize = 5;
  constructor(
    @InjectRepository(ProductsEntity) private productsRepository: Repository<ProductsEntity>,
    @InjectRepository(SystemUserEntity) private systemUserRepository: Repository<SystemUserEntity>,
    @InjectRepository(ProductCategoriesEntity) private productCategoryRepository: Repository<ProductCategoriesEntity>,
    private readonly filesService: FilesService,
    private dataSource: DataSource,
  ) {}

  async createProduct(
    data: CreateProductInterface,
    files: Array<Express.Multer.File> = [],
    operator_id: number,
  ): Promise<ProductsEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const savedFiles = [];
    try {
      const existsProduct = await queryRunner.manager.getRepository(ProductsEntity).findOne(
        {
          where: {
            is_deleted: false,
            code: data.code
          }
        }
      );
      if (existsProduct) {
        throw new NotFoundException({ message: { code: translationsSeed.unique_field.key } });
      }
      const operator = await queryRunner.manager.getRepository(SystemUserEntity).findOne(
        {
          where: { id: operator_id },
        }
      );
      if (!operator) {
        throw new BadRequestException(translationsSeed.user_not_found.key);
      }
      const category = await queryRunner.manager.getRepository(ProductCategoriesEntity).findOne(
        {
          where: { id: data.category_id },
        }
      );
      if (!category) {
        throw new BadRequestException(translationsSeed.data_not_found.key);
      }
      const product = await queryRunner.manager.getRepository(ProductsEntity).create({
        code: data.code,
        link: data.link || null,
        title: data.title,
        short_content: data.short_content,
        content: data.content,
        price: data.price,
        operator,
        category,
        is_deleted: false,
      });
      const fileNameGeneral = Date.now();
      let i = 0;
      await queryRunner.manager.getRepository(ProductsEntity).save(product);
      for (const file of files) {
        const fileNameParams = file.originalname.split('.');
        const ext = fileNameParams[fileNameParams.length - 1];
        file.originalname = `${fileNameGeneral + i}.${ext}`;
        const savedFile = await this.filesService.storeFile(file, ['products', product.id.toString()], queryRunner.manager);
        savedFiles.push(savedFile);
        i += 1;
      }
      product.files = savedFiles;
      product.mainPhoto = savedFiles[0] || null;
      await queryRunner.manager.getRepository(ProductsEntity).save(product);
      delete product.operator.password;
      delete product.operator.secret;
      await queryRunner.commitTransaction();
      return product;
    } catch (err) {
      for await (const file of savedFiles) {
        await this.filesService.unlinkFile(file);
      }
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
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
        mainPhoto: withRelations,
        files: withRelations,
      },
    });
    if (!product) {
      throw new NotFoundException(translationsSeed.data_not_found.key);
    }
    delete product.operator?.password;
    delete product.operator?.secret;
    return product;
  }

  async getProductsByCategoryCode(
    code: string,
  ): Promise<any> {
    const category = await this.productCategoryRepository.findOne({
      where: { is_deleted: false, code },
      relations: { products: { mainPhoto: true } }
    });
    if (!category) {
      throw new NotFoundException(translationsSeed.data_not_found.key);
    }
    return category;
  }

  async getProductsByCategoryCodeAndProductCode(
    categoryCode: string,
    productCode: string,
  ): Promise<any> {
    const product = await this.productsRepository.findOne({
      where: {
        is_deleted: false,
        code: productCode,
        category: {
          code: categoryCode,
          is_deleted: false
        }
      },
      relations: {
        category: true,
        mainPhoto: true,
        files: true
      }
    });
    if (!product) {
      throw new NotFoundException(translationsSeed.data_not_found.key);
    }
    return product;
  }

  async updateProduct(
    id: number,
    data: UpdateProductInterface,
    files: Array<Express.Multer.File> = [],
  ): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const savedFiles = [];
    try {
      const existsProduct = await queryRunner.manager.getRepository(ProductsEntity).findOne(
        {
          where: {
            is_deleted: false,
            code: data.code,
            id: Not(id)
          }
        }
      );
      if (existsProduct) {
        throw new NotFoundException({ message: { code: translationsSeed.unique_field.key } });
      }
      const category = await queryRunner.manager.getRepository(ProductCategoriesEntity).findOne(
        {
          where: { id: data.category_id, is_deleted: false },
        }
      );
      if (!category) {
        throw new BadRequestException(translationsSeed.data_not_found.key);
      }
      const product = await queryRunner.manager.getRepository(ProductsEntity).findOne(
        {
          where: { id, is_deleted: false },
          relations: {
            files: true,
          },
        }
      );
      product.title = data.title;
      product.short_content = data.short_content;
      product.content = data.content;
      product.price = data.price;
      product.code = data.code;
      product.link = data.link || null;
      product.category = category;
      const existsFiles = product.files.filter(item => !data.removedFiles.includes(item.id));
      const removedFilesData = product.files.filter(item => data.removedFiles.includes(item.id));
      const fileNameGeneral = Date.now();
      let i = 0;
      for (const file of files) {
        const fileNameParams = file.originalname.split('.');
        const ext = fileNameParams[fileNameParams.length - 1];
        file.originalname = `${fileNameGeneral + i}.${ext}`;
        const savedFile = await this.filesService.storeFile(file, ['products', product.id.toString()], queryRunner.manager);
        savedFiles.push(savedFile);
        i += 1;
      }
      product.files = [...existsFiles, ...savedFiles];
      product.mainPhoto = product.files[0] || null;
      await queryRunner.manager.getRepository(ProductsEntity).save(product);
      // remove file from DB before commit, it failed we will not unlink file
      for await (const file of removedFilesData) {
        await this.filesService.removeFile(file, queryRunner.manager);
      }
      await queryRunner.commitTransaction();
      // removable files should remove after transaction successfully commit
      for await (const file of removedFilesData) {
        await this.filesService.unlinkFile(file);
      }
      return product;
    } catch (err) {
      for await (const file of savedFiles) {
        await this.filesService.unlinkFile(file);
      }
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteProduct(id: number): Promise<void> {
    const product = await this.getProductById(id, false);
    product.is_deleted = true;
    await this.productsRepository.save(product);
  }
}
