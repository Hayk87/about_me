import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RightsService } from './rights.service';
import { ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RightsResponseDto } from './dto/rights-response.dto';
import { SystemUserMetaRights } from '../system-user/system-user.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { SystemUserGuard } from '../system-user/system-user.guard';
import { rightsMapper } from '../utils/variables';

@ApiTags('Rights')
@Controller('rights')
export class RightsController {
  constructor(private rightsService: RightsService) {}

  @Get('seed')
  createRight() {
    return this.rightsService.seedRights();
  }

  @ApiHeader({
    name: 'X-Auth-Token',
    description: 'Need auth token',
    required: true,
  })
  @ApiOkResponse({
    type: RightsResponseDto,
    isArray: true,
  })
  @SystemUserMetaRights(rightsMapper.rightsRead)
  @UseGuards(AuthGuard, SystemUserGuard)
  @Get()
  getList() {
    return this.rightsService.getRights();
  }
}
