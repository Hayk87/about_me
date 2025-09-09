import {
  Controller,
  Post,
  UseGuards,
  Body,
  UsePipes,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../auth/auth.guard';
import { SystemUserGuard } from '../system-user/system-user.guard';
import { SystemUserMetaRights } from '../system-user/system-user.decorator';
import { rightsMapper } from '../utils/variables';
import { SearchByDetailsDto } from './dto/search-by-details.dto';
import { TotalReportDto } from './dto/total-report.dto';
import * as pipes from './pipes';

@ApiTags('Reports')
@ApiHeader({
  name: 'X-Auth-Token',
  description: 'Need auth token',
  required: true,
})
@UseGuards(AuthGuard, SystemUserGuard)
@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @Post('details')
  @HttpCode(HttpStatus.OK)
  @UsePipes(pipes.SearchByDetailsPipe)
  @SystemUserMetaRights(rightsMapper.reportsPage)
  getDetailsReport(@Body() post: SearchByDetailsDto, @Res() res: Response) {
    this.reportService.getReportDetails(post, res);
  }

  @Post('total')
  @HttpCode(HttpStatus.OK)
  @UsePipes(pipes.TotalReportPipe)
  @SystemUserMetaRights(rightsMapper.reportsPage)
  getTotalReport(@Body() post: TotalReportDto, @Res() res: Response) {
    return this.reportService.getTotalReport(post, res);
  }
}
