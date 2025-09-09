import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';
import { FilesModule } from "../files/files.module";
import { OfferEntity } from "./offer.entity";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    FilesModule,
    TypeOrmModule.forFeature([OfferEntity]),
    AuthModule,
  ],
  controllers: [OfferController],
  providers: [OfferService]
})
export class OfferModule {}
