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
  Query, UploadedFiles,
  UseGuards, UseInterceptors
} from "@nestjs/common";
import { ProductsService } from './products.service';
import { AuthGuard } from '../auth/auth.guard';
import { SystemUserGuard } from '../system-user/system-user.guard';
import {
  SystemUser,
  SystemUserMetaRights,
} from '../system-user/system-user.decorator';
import { rightsMapper, translationsSeed } from '../utils/variables';
import { ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from "@nestjs/platform-express";
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsEntity } from './products.entity';
import { SearchProductDto } from './dto/search-product.dto';
import { ListResponseDto } from './dto/list-response.dto';
import { UpdateProductDto } from "./dto/update-product.dto";
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
  @UseInterceptors(FilesInterceptor('files'))
  @Post()
  createProductItem(
    @UploadedFiles(pipes.ProductFilePipe) files: Array<Express.Multer.File>,
    @Body(pipes.CreateProductPipe) data: CreateProductDto,
    @SystemUser() user,
  ): Promise<ProductsEntity> {
    return this.productsService.createProduct(data, files, user.id);
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

  @Get('by-category/:categoryCode')
  getProductsByCategoryCode(
    @Param('categoryCode', pipes.ValidateByCodePipe) categoryCode: string
  ) {
    return this.productsService.getProductsByCategoryCode(categoryCode);
  }

  @Get('by-category/:categoryCode/product/:productCode')
  getProductsByCategoryCodeAndProductCode(
    @Param('categoryCode', pipes.ValidateByCodePipe) categoryCode: string,
    @Param('productCode', pipes.ValidateByCodePipe) productCode: string,
  ) {
    return this.productsService.getProductsByCategoryCodeAndProductCode(categoryCode, productCode);
  }

  @SystemUserMetaRights(
    rightsMapper.productUpdate,
  )
  @UseGuards(AuthGuard, SystemUserGuard)
  @ApiOkResponse({ type: Object, isArray: false })
  @UseInterceptors(FilesInterceptor('files'))
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
    @Body(pipes.UpdateProductPipe) data: UpdateProductDto,
    @UploadedFiles(pipes.ProductFilePipe) files: Array<Express.Multer.File>,
  ): Promise<ProductsEntity> {
    return this.productsService.updateProduct(id, data, files);
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
