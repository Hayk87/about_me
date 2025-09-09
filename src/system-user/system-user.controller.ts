import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  UseGuards,
  BadRequestException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SystemUserService } from './system-user.service';
import { UserResponseDto } from './dto/user-response.dto';
import { UserCreateDto } from './dto/user-create.dto';
import { SystemUserEntity } from './system-user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { SystemUserGuard } from './system-user.guard';
import { SystemUser, SystemUserMetaRights } from './system-user.decorator';
import { rightsMapper, translationsSeed } from '../utils/variables';
import { UserUpdateDto } from './dto/user-update.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SearchSystemUserDto } from './dto/search-system-user.dto';
import * as pipes from './pipes';
import { AuthenticatorEnableDto } from './dto/AuthenticatorEnable.dto';

@ApiTags('System users')
@Controller('system-user')
export class SystemUserController {
  constructor(private systemUserService: SystemUserService) {}

  // set ROOT system user
  @ApiOkResponse({
    type: UserResponseDto,
    isArray: false,
  })
  @Get('set-root')
  setRoot() {
    return this.systemUserService.setIsRootUser();
  }

  // System user List
  @ApiHeader({
    name: 'X-Auth-Token',
    description: 'Need auth token',
    required: true,
  })
  @ApiOkResponse({
    type: UserResponseDto,
    isArray: true,
  })
  @SystemUserMetaRights(
    rightsMapper.systemUserRead,
    rightsMapper.transactionImportRead,
    rightsMapper.transactionExportRead,
    rightsMapper.reportsPage,
  )
  @UseGuards(AuthGuard, SystemUserGuard)
  @Get()
  getAllSystemUsers(
    @Query(pipes.SearchSystemUserPipe) search: SearchSystemUserDto,
  ): Promise<{ list: SystemUserEntity[]; count: number }> {
    return this.systemUserService.getUsers(search);
  }

  // Create system user
  @ApiHeader({
    name: 'X-Auth-Token',
    description: 'Need auth token',
    required: true,
  })
  @SystemUserMetaRights(rightsMapper.systemUserCreate)
  @UseGuards(AuthGuard, SystemUserGuard)
  @Post()
  async createNewSystemUser(
    @Body(pipes.CreateSystemUserPipe) body: UserCreateDto,
  ): Promise<SystemUserEntity> {
    return await this.systemUserService.createUser(body);
  }

  // change system user password
  @ApiHeader({
    name: 'X-Auth-Token',
    description: 'Need auth token',
    required: true,
  })
  @UseGuards(AuthGuard)
  @Put('change-password')
  changePasswordSystemUser(
    @Body(pipes.ChangePasswordSystemUserPipe) data: ChangePasswordDto,
    @SystemUser() systemUser: SystemUserEntity,
  ): Promise<void> {
    return this.systemUserService.changePassword(
      data.current_password,
      data.new_password,
      systemUser.id,
    );
  }

  // change system user password
  @ApiHeader({
    name: 'X-Auth-Token',
    description: 'Need auth token',
    required: true,
  })
  @UseGuards(AuthGuard)
  @Post('generate-authenticator')
  generateAuthenticatorObjectSystemUser(
    @SystemUser() systemUser: SystemUserEntity,
    @Body() body: AuthenticatorEnableDto,
  ): Promise<{ image: string; code: string }> {
    return this.systemUserService.generateAuthenticator(
      systemUser.id,
      !!body.enable,
    );
  }

  // Update system user
  @ApiHeader({
    name: 'X-Auth-Token',
    description: 'Need auth token',
    required: true,
  })
  @SystemUserMetaRights(rightsMapper.systemUserReadDetails)
  @UseGuards(AuthGuard, SystemUserGuard)
  @Get(':id')
  getSystemUserById(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new BadRequestException(translationsSeed.invalid_value.key);
        },
      }),
    )
    id: number,
  ) {
    return this.systemUserService.findById(id);
  }

  // Update system user
  @ApiHeader({
    name: 'X-Auth-Token',
    description: 'Need auth token',
    required: true,
  })
  @SystemUserMetaRights(rightsMapper.systemUserUpdate)
  @UseGuards(AuthGuard, SystemUserGuard)
  @Put(':id')
  updateExistsSystemUser(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new BadRequestException(translationsSeed.invalid_value.key);
        },
      }),
    )
    id: number,
    @Body(pipes.UpdateSystemUserPipe) body: UserUpdateDto,
  ): Promise<SystemUserEntity> {
    return this.systemUserService.updateSystemUser(id, body);
  }

  // Block system user
  @ApiHeader({
    name: 'X-Auth-Token',
    description: 'Need auth token',
    required: true,
  })
  @SystemUserMetaRights(rightsMapper.systemUserBlock)
  @UseGuards(AuthGuard, SystemUserGuard)
  @Put(':id/block')
  blockUnblockSystemUser(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new BadRequestException(translationsSeed.invalid_value.key);
        },
      }),
    )
    id: number,
  ): Promise<SystemUserEntity> {
    return this.systemUserService.blockSystemUser(id);
  }

  // Delete system user
  @ApiHeader({
    name: 'X-Auth-Token',
    description: 'Need auth token',
    required: true,
  })
  @SystemUserMetaRights(rightsMapper.systemUserDelete)
  @UseGuards(AuthGuard, SystemUserGuard)
  @Delete(':id')
  deleteSystemUser(
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
    return this.systemUserService.deleteSystemUser(id);
  }
}
