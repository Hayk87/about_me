import {
  BadRequestException,
  Controller, DefaultValuePipe,
  Get,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Query,
  UseGuards
} from "@nestjs/common";
import { FilesService } from "./files.service";
import { ApiHeader, ApiTags } from "@nestjs/swagger";
import { rightsMapper, translationsSeed } from "../utils/variables";
import { SystemUserMetaRights } from "../system-user/system-user.decorator";
import { AuthGuard } from "../auth/auth.guard";
import { SystemUserGuard } from "../system-user/system-user.guard";

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {
  }

  @ApiHeader({
    name: 'X-Auth-Token',
    description: 'Need auth token',
    required: true,
  })
  // @SystemUserMetaRights(rightsMapper.fileReadDetails)
  // @UseGuards(AuthGuard, SystemUserGuard)
  @Get('details/:id')
  getFileDetails(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () => {
          throw new BadRequestException(translationsSeed.invalid_value.key);
        },
      })
    ) id: string,
    @Query(
      'disposition',
      new DefaultValuePipe(false),
      new ParseBoolPipe({
        exceptionFactory: () => {
          throw new BadRequestException(translationsSeed.invalid_value.key);
        }
      })
    ) disposition?: boolean
  ) {
    return this.filesService.streamFile(id, disposition);
  }
}
