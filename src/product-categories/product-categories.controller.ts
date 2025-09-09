import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  Body,
  BadRequestException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiHeader, ApiOkResponse } from '@nestjs/swagger';
import { ProductCategoriesService } from './product-categories.service';
import { SystemUserMetaRights } from '../system-user/system-user.decorator';
import { rightsMapper, translationsSeed } from '../utils/variables';
import { AuthGuard } from '../auth/auth.guard';
import { SystemUserGuard } from '../system-user/system-user.guard';
import { CreateUpdateProductCategoryDto } from './dto/create-update-product-category.dto';
import { ProductCategoriesEntity } from './product-categories.entity';
import { SearchProductCategoryDto } from './dto/search-product-category.dto';
import { ProductCategoriesResponseDto } from './dto/product-categories-response.dto';
import * as pipes from './pipes';

@ApiTags('Categories of product')
@ApiHeader({
  name: 'X-Auth-Token',
  description: 'Need auth token',
  required: true,
})
@Controller('product-categories')
export class ProductCategoriesController {
  constructor(private productCategoryService: ProductCategoriesService) {}

  @SystemUserMetaRights(
    rightsMapper.productCategoriesRead,
    rightsMapper.productRead,
    rightsMapper.transactionImportCreate,
    rightsMapper.transactionExportCreate,
  )
  @UseGuards(AuthGuard, SystemUserGuard)
  @ApiOkResponse({ type: ProductCategoriesResponseDto, isArray: false })
  @Get()
  getProductCategories(
    @Query(pipes.SearchProductCategoryPipe) search: SearchProductCategoryDto,
  ): Promise<ProductCategoriesResponseDto> {
    return this.productCategoryService.getAll(search);
  }

  @SystemUserMetaRights(rightsMapper.productCategoriesCreate)
  @UseGuards(AuthGuard, SystemUserGuard)
  @Post()
  createProductCategories(
    @Body(pipes.CreateProductCategoryPipe) data: CreateUpdateProductCategoryDto,
  ): Promise<ProductCategoriesEntity> {
    return this.productCategoryService.createProductCategory(data);
  }

  @SystemUserMetaRights(rightsMapper.productCategoriesReadDetails)
  @UseGuards(AuthGuard, SystemUserGuard)
  @Get(':id')
  getByIdProductCategory(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new BadRequestException(translationsSeed.invalid_value.key);
        },
      }),
    )
    id: number,
  ): Promise<ProductCategoriesEntity> {
    return this.productCategoryService.findProductCategoryById(id);
  }

  @SystemUserMetaRights(rightsMapper.productCategoriesUpdate)
  @UseGuards(AuthGuard, SystemUserGuard)
  @Put(':id')
  updateProductCategory(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new BadRequestException(translationsSeed.invalid_value.key);
        },
      }),
    )
    id: number,
    @Body(pipes.UpdateProductCategoryPipe) data: CreateUpdateProductCategoryDto,
  ): Promise<ProductCategoriesEntity> {
    return this.productCategoryService.updateProductCategory(id, data);
  }

  @SystemUserMetaRights(rightsMapper.productCategoriesDelete)
  @UseGuards(AuthGuard, SystemUserGuard)
  @Delete(':id')
  deleteProductCategory(
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
    return this.productCategoryService.deleteProductCategory(id);
  }
}
