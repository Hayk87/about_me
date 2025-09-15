import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsEntity } from './products.entity';
import { ProductCategoriesEntity } from '../product-categories/product-categories.entity';
import { SystemUserEntity } from '../system-user/system-user.entity';
import { AuthModule } from '../auth/auth.module';
import { FilesModule } from "../files/files.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductsEntity,
      ProductCategoriesEntity,
      SystemUserEntity,
    ]),
    AuthModule,
    FilesModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
