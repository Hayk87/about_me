import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { StaffsService } from './staffs.service';
import { CreateUpdateStaffDto } from './dto/create-staff.dto';
import { SystemUserMetaRights } from '../system-user/system-user.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { SystemUserGuard } from '../system-user/system-user.guard';
import { StaffEntity } from './staff.entity';
import { rightsMapper, translationsSeed } from '../utils/variables';
import { SearchStaffDto } from './dto/search-staff.dto';
import { StaffResponseDto } from './dto/staff-response.dto';
import * as pipes from './pipes';

@ApiTags('Staffs')
@ApiHeader({
  name: 'X-Auth-Token',
  description: 'Need auth token',
  required: true,
})
@Controller('staffs')
export class StaffsController {
  constructor(private readonly staffsService: StaffsService) {}

  @SystemUserMetaRights(rightsMapper.staffCreate)
  @UseGuards(AuthGuard, SystemUserGuard)
  @Post()
  create(@Body(pipes.CreateStaffPipe) postData: CreateUpdateStaffDto) {
    return this.staffsService.create(postData);
  }

  @SystemUserMetaRights(rightsMapper.staffRead, rightsMapper.systemUserRead)
  @UseGuards(AuthGuard, SystemUserGuard)
  @ApiOkResponse({ type: StaffResponseDto, isArray: false })
  @Get()
  findAll(
    @Query(pipes.SearchStaffPipe) search: SearchStaffDto,
  ): Promise<StaffResponseDto> {
    return this.staffsService.findAll(search);
  }

  @SystemUserMetaRights(rightsMapper.staffReadDetails)
  @UseGuards(AuthGuard, SystemUserGuard)
  @Get(':id')
  findOne(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new BadRequestException(translationsSeed.invalid_value.key);
        },
      }),
    )
    id: number,
  ): Promise<StaffEntity> {
    return this.staffsService.findOne(+id);
  }

  @SystemUserMetaRights(rightsMapper.staffUpdate)
  @UseGuards(AuthGuard, SystemUserGuard)
  @Put(':id')
  update(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new BadRequestException(translationsSeed.invalid_value.key);
        },
      }),
    )
    id: string,
    @Body(pipes.UpdateStaffPipe) updateStaffDto: CreateUpdateStaffDto,
  ): Promise<StaffEntity> {
    return this.staffsService.update(+id, updateStaffDto);
  }

  @SystemUserMetaRights(rightsMapper.staffDelete)
  @UseGuards(AuthGuard, SystemUserGuard)
  @Delete(':id')
  remove(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new BadRequestException(translationsSeed.invalid_value.key);
        },
      }),
    )
    id: string,
  ): Promise<void> {
    return this.staffsService.remove(+id);
  }
}
