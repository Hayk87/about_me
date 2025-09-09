import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LanguagesModule } from './languages/languages.module';
import { TranslatesModule } from './translates/translates.module';
import { RightsModule } from './rights/rights.module';
import { SystemUserModule } from './system-user/system-user.module';
import { AuthModule } from './auth/auth.module';
import { StaffsModule } from './staffs/staffs.module';
import { OfferModule } from './offer/offer.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { ProductsModule } from './products/products.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [],
      synchronize: false,
      autoLoadEntities: true,
    }),
    ...(process.env.NODE_ENV === 'production'
      ? [
          ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'frontend', 'build'),
          }),
        ]
      : []),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20,
      },
    ]),
    LanguagesModule,
    TranslatesModule,
    RightsModule,
    StaffsModule,
    SystemUserModule,
    AuthModule,
    OfferModule,
    ProductCategoriesModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
