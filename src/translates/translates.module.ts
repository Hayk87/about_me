import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranslatesController } from './translates.controller';
import { TranslatesService } from './translates.service';
import { TranslatesEntity } from './translates.entity';
import { LanguagesModule } from '../languages/languages.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TranslatesEntity]),
    LanguagesModule,
    AuthModule,
  ],
  controllers: [TranslatesController],
  providers: [TranslatesService],
})
export class TranslatesModule {}
