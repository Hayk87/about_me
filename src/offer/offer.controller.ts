import {
  Controller,
  Post,
  Get,
  Body,
  UseInterceptors,
  UploadedFiles,
  Param,
  ParseIntPipe,
  BadRequestException,
  UseGuards,
  Query
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiHeader, ApiTags } from "@nestjs/swagger";
import { OfferService } from "./offer.service";
import { NewOfferDto } from "./dto/new-offer.dto";
import * as pipes from './pipes';
import { rightsMapper, translationsSeed } from "../utils/variables";
import { SystemUserMetaRights } from "../system-user/system-user.decorator";
import { AuthGuard } from "../auth/auth.guard";
import { SystemUserGuard } from "../system-user/system-user.guard";
import { SearchOfferDto } from "./dto/search-offer.dto";

@ApiTags('Offers')
@Controller('offer')
export class OfferController {
  constructor(private readonly offerService: OfferService) {
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async storeNewOffer(
    @Body(pipes.OfferBodyPipe) body: NewOfferDto,
    @UploadedFiles(pipes.OfferFilePipe) files: Array<Express.Multer.File>,
  ) {
    return await this.offerService.storeOffer(body, files);
  }

  @ApiHeader({
    name: 'X-Auth-Token',
    description: 'Need auth token',
    required: true,
  })
  @SystemUserMetaRights(rightsMapper.offerRead)
  @UseGuards(AuthGuard, SystemUserGuard)
  @Get()
  async getOffers(
    @Query(pipes.SearchOfferPipe) search: SearchOfferDto
  ) {
    return this.offerService.getOffers(search);
  }

  @ApiHeader({
    name: 'X-Auth-Token',
    description: 'Need auth token',
    required: true,
  })
  @SystemUserMetaRights(rightsMapper.offerReadDetails)
  @UseGuards(AuthGuard, SystemUserGuard)
  @Get(':id')
  async getOfferById(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new BadRequestException(translationsSeed.invalid_value.key);
        },
      })
    ) id: number
  ) {
    return this.offerService.getOfferById(id);
  }
}
