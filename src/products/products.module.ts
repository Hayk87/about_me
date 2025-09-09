import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsEntity } from './products.entity';
import { ProductCategoriesEntity } from '../product-categories/product-categories.entity';
import { MeasurementsEntity } from '../measurement/measurements.entity';
import { SystemUserEntity } from '../system-user/system-user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductsEntity,
      ProductCategoriesEntity,
      MeasurementsEntity,
      SystemUserEntity,
    ]),
    AuthModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
