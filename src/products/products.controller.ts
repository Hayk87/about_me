import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '../auth/auth.guard';
import { SystemUserGuard } from '../system-user/system-user.guard';
import {
  SystemUser,
  SystemUserMetaRights,
} from '../system-user/system-user.decorator';
import { rightsMapper, translationsSeed } from '../utils/variables';
import { ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsEntity } from './products.entity';
import { SearchProductDto } from './dto/search-product.dto';
import { ListResponseDto } from './dto/list-response.dto';
import * as pipes from './pipes';

@ApiTags('Products')
@ApiHeader({
  name: 'X-Auth-Token',
  description: 'Need auth token',
  required: true,
})
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @SystemUserMetaRights(
    rightsMapper.productRead,
  )
  @UseGuards(AuthGuard, SystemUserGuard)
  @ApiOkResponse({ type: ListResponseDto, isArray: true })
  @Get()
  getProductsList(
    @Query(pipes.SearchProductPipe) search: SearchProductDto,
  ): Promise<{ list: ProductsEntity[]; count: number }> {
    return this.productsService.getProducts(search);
  }

  @SystemUserMetaRights(rightsMapper.productCreate)
  @UseGuards(AuthGuard, SystemUserGuard)
  @ApiOkResponse({ type: Object, isArray: false })
  @Post()
  createProductItem(
    @Body(pipes.CreateProductPipe) data: CreateProductDto,
    @SystemUser() user,
  ): Promise<ProductsEntity> {
    return this.productsService.createProduct(data, user.id);
  }

  @SystemUserMetaRights(rightsMapper.productReadDetails)
  @UseGuards(AuthGuard, SystemUserGuard)
  @ApiOkResponse({ type: Object, isArray: false })
  @Get(':id')
  getProductItem(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new BadRequestException(translationsSeed.invalid_value.key);
        },
      }),
    )
    id: number,
  ): Promise<ProductsEntity> {
    return this.productsService.getProductById(id);
  }

  @SystemUserMetaRights(
    rightsMapper.productUpdate,
    rightsMapper.productUpdateOnlyBuyPrice,
    rightsMapper.productUpdateOnlySellPrice,
  )
  @UseGuards(AuthGuard, SystemUserGuard)
  @ApiOkResponse({ type: Object, isArray: false })
  @Put(':id')
  updateProductItem(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new BadRequestException(translationsSeed.invalid_value.key);
        },
      }),
    )
    id: number,
    @Body(pipes.CreateProductPipe) data: CreateProductDto,
    @SystemUser() user,
  ): Promise<ProductsEntity> {
    return this.productsService.updateProduct(id, data, user);
  }

  @SystemUserMetaRights(rightsMapper.productDelete)
  @UseGuards(AuthGuard, SystemUserGuard)
  @Delete(':id')
  deleteProductItem(
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
    return this.productsService.deleteProduct(id);
  }
}
