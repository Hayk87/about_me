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
import { MeasurementsService } from './measurements.service';
import { SystemUserMetaRights } from '../system-user/system-user.decorator';
import { rightsMapper, translationsSeed } from '../utils/variables';
import { AuthGuard } from '../auth/auth.guard';
import { SystemUserGuard } from '../system-user/system-user.guard';
import { CreateUpdateMeasurementDto } from './dto/create-update-translate.dto';
import { MeasurementsEntity } from './measurements.entity';
import { MeasurementsResponseDto } from './dto/measurements-response.dto';
import { SearchMeasurementsDto } from './dto/search-measurements.dto';
import * as pipes from './pipes';

@ApiTags('Measurements')
@Controller('measurement')
export class MeasurementsController {
  constructor(private measurementsService: MeasurementsService) {}

  @ApiHeader({
    name: 'X-Auth-Token',
    description: 'Need auth token',
    required: true,
  })
  @SystemUserMetaRights(rightsMapper.measurementRead, rightsMapper.productRead)
  @UseGuards(AuthGuard, SystemUserGuard)
  @ApiOkResponse({ type: MeasurementsResponseDto, isArray: false })
  @Get()
  getMeasurementsList(
    @Query(pipes.SearchMeasurementPipe) search: SearchMeasurementsDto,
  ): Promise<MeasurementsResponseDto> {
    return this.measurementsService.getAll(search);
  }

  @ApiHeader({
    name: 'X-Auth-Token',
    description: 'Need auth token',
    required: true,
  })
  @SystemUserMetaRights(rightsMapper.measurementCreate)
  @UseGuards(AuthGuard, SystemUserGuard)
  @Post()
  createMeasurement(
    @Body(pipes.CreateMeasurementPipe) data: CreateUpdateMeasurementDto,
  ): Promise<MeasurementsEntity> {
    return this.measurementsService.createMeasurement(data);
  }

  @ApiHeader({
    name: 'X-Auth-Token',
    description: 'Need auth token',
    required: true,
  })
  @SystemUserMetaRights(rightsMapper.measurementReadDetails)
  @UseGuards(AuthGuard, SystemUserGuard)
  @Get(':id')
  getByIdMeasurement(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new BadRequestException(translationsSeed.invalid_value.key);
        },
      }),
    )
    id: number,
  ): Promise<MeasurementsEntity> {
    return this.measurementsService.findMeasurement(id);
  }

  @ApiHeader({
    name: 'X-Auth-Token',
    description: 'Need auth token',
    required: true,
  })
  @SystemUserMetaRights(rightsMapper.measurementUpdate)
  @UseGuards(AuthGuard, SystemUserGuard)
  @Put(':id')
  updateMeasurement(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new BadRequestException(translationsSeed.invalid_value.key);
        },
      }),
    )
    id: number,
    @Body(pipes.UpdateMeasurementPipe) data: CreateUpdateMeasurementDto,
  ): Promise<MeasurementsEntity> {
    return this.measurementsService.updateMeasurement(id, data);
  }

  @ApiHeader({
    name: 'X-Auth-Token',
    description: 'Need auth token',
    required: true,
  })
  @SystemUserMetaRights(rightsMapper.measurementDelete)
  @UseGuards(AuthGuard, SystemUserGuard)
  @Delete(':id')
  deleteMeasurement(
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
    return this.measurementsService.deleteMeasurement(id);
  }
}
