import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  UseGuards,
  Body,
  BadRequestException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiHeader } from '@nestjs/swagger';
import { TranslatesService } from './translates.service';
import { SearchTranslateDto } from './dto/search-translate.dto';
import { TranslateResponseDto } from './dto/translate-response.dto';
import { SystemUserMetaRights } from '../system-user/system-user.decorator';
import { rightsMapper, translationsSeed } from '../utils/variables';
import { AuthGuard } from '../auth/auth.guard';
import { SystemUserGuard } from '../system-user/system-user.guard';
import { CreateUpdateTranslateDto } from './dto/create-update-translate.dto';
import { TranslatesEntity } from './translates.entity';
import { AllCurrentTranslatesDto } from './dto/all-current-translates.dto';
import * as pipes from './pipes';

@ApiTags('Translations')
@Controller('translates')
export class TranslatesController {
  constructor(private translatesService: TranslatesService) {}

  @Get('seed')
  seedTranslations(): Promise<TranslatesEntity[]> {
    return this.translatesService.seedTranslations();
  }

  @Get('current')
  getCurrentTranslations(
    @Query(pipes.AllCurrentTranslatesPipe)
    queryLangDto: AllCurrentTranslatesDto,
  ): Promise<object> {
    return this.translatesService.getAllCurrent(queryLangDto);
  }

  @ApiOkResponse({
    type: TranslateResponseDto,
    isArray: false,
  })
  @ApiHeader({
    name: 'X-Auth-Token',
    description: 'Need auth token',
    required: true,
  })
  @SystemUserMetaRights(rightsMapper.translateRead)
  @UseGuards(AuthGuard, SystemUserGuard)
  @Get()
  getTranslations(
    @Query(pipes.SearchTranslatePipe) queryLangDto: SearchTranslateDto,
  ): Promise<TranslateResponseDto> {
    return this.translatesService.getAll(queryLangDto);
  }

  @ApiHeader({
    name: 'X-Auth-Token',
    description: 'Need auth token',
    required: true,
  })
  @SystemUserMetaRights(rightsMapper.translateCreate)
  @UseGuards(AuthGuard, SystemUserGuard)
  @Post()
  createTranslate(
    @Body(pipes.CreateTranslatePipe) data: CreateUpdateTranslateDto,
  ): Promise<TranslatesEntity> {
    return this.translatesService.createNewTranslation(
      data.key,
      data.value,
      true,
    );
  }

  @ApiHeader({
    name: 'X-Auth-Token',
    description: 'Need auth token',
    required: true,
  })
  @SystemUserMetaRights(rightsMapper.translateReadDetails)
  @UseGuards(AuthGuard, SystemUserGuard)
  @Get(':id')
  getByIdTranslate(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new BadRequestException(translationsSeed.invalid_value.key);
        },
      }),
    )
    id: number,
  ): Promise<TranslatesEntity> {
    return this.translatesService.findTranslation(id);
  }

  @ApiHeader({
    name: 'X-Auth-Token',
    description: 'Need auth token',
    required: true,
  })
  @SystemUserMetaRights(rightsMapper.translateUpdate)
  @UseGuards(AuthGuard, SystemUserGuard)
  @Put(':id')
  updateTranslate(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new BadRequestException(translationsSeed.invalid_value.key);
        },
      }),
    )
    id: number,
    @Body(pipes.UpdateTranslatePipe) data: CreateUpdateTranslateDto,
  ): Promise<TranslatesEntity> {
    return this.translatesService.updateTranslation(id, data.key, data.value);
  }

  @ApiHeader({
    name: 'X-Auth-Token',
    description: 'Need auth token',
    required: true,
  })
  @SystemUserMetaRights(rightsMapper.translateDelete)
  @UseGuards(AuthGuard, SystemUserGuard)
  @Delete(':id')
  deleteTranslate(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new BadRequestException(translationsSeed.invalid_value.key);
        },
      }),
    )
    id: number,
  ): Promise<void> {
    return this.translatesService.deleteTranslation(id);
  }
}
