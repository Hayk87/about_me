import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { FilesService } from './files.service';
import { FilesEntity } from "./files.entity";
import { FilesController } from './files.controller';
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([FilesEntity]),
    AuthModule,
  ],
  providers: [FilesService],
  exports: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
