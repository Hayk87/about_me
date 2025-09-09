import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { createHashHmac, randomString } from '../utils/functions';
import { SystemUserEntity } from './system-user.entity';
import { rootUser, translationsSeed } from '../utils/variables';
import { UserCreateDto } from './dto/user-create.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { StaffEntity } from '../staffs/staff.entity';
import { SearchSystemUserInterface } from './interface/search-system-user.interface';
import { SpeakeasyService } from '../speakeasy/speakeasy.service';

@Injectable()
export class SystemUserService {
  rootUser = rootUser;
  private pageSize = 5;

  constructor(
    @InjectRepository(SystemUserEntity)
    private systemUserRepository: Repository<SystemUserEntity>,
    @InjectRepository(StaffEntity)
    private staffRepository: Repository<StaffEntity>,
    private speakeasyService: SpeakeasyService,
  ) {}

  async setIsRootUser() {
    const exists = await this.systemUserRepository.findOne({
      where: { email: this.rootUser.email },
    });
    if (exists) {
      return this.returnCreatedRootUserData(exists);
    }
    const user = this.systemUserRepository.create({
      ...this.rootUser,
      is_root: true,
      password: createHashHmac(this.rootUser.password, this.rootUser.secret),
    });
    await this.systemUserRepository.save(user);
    return this.returnCreatedRootUserData(user);
  }

  returnCreatedRootUserData(data: SystemUserEntity) {
    return {
      id: data.id,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      is_root: data.is_root,
      is_blocked: data.is_blocked,
      is_deleted: data.is_deleted,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  async getUsers(searchParams: SearchSystemUserInterface) {
    const limit = searchParams.limit || this.pageSize;
    const offset = (searchParams.page - 1) * limit;
    const alias = 'system_user';
    const qbList = this.systemUserRepository.createQueryBuilder(alias);
    const qbCount = !searchParams.all
      ? this.systemUserRepository.createQueryBuilder(alias)
      : null;
    qbList.leftJoinAndMapOne(
      `${alias}.staff_id`,
      StaffEntity,
      'staff',
      `${alias}.staff_id=staff.id`,
    );
    qbList.andWhere(`${alias}.is_deleted=:is_deleted`, { is_deleted: false });
    qbList.andWhere(`${alias}.is_root=:is_root`, { is_root: false });
    qbCount?.andWhere(`${alias}.is_deleted=:is_deleted`, { is_deleted: false });
    qbCount?.andWhere(`${alias}.is_root=:is_root`, { is_root: false });
    if (searchParams.first_name) {
      qbList.andWhere(`${alias}.first_name ilike :first_name`, {
        first_name: `%${searchParams.first_name}%`,
      });
      qbCount.andWhere(`${alias}.first_name ilike :first_name`, {
        first_name: `%${searchParams.first_name}%`,
      });
    }
    if (searchParams.last_name) {
      qbList.andWhere(`${alias}.last_name ilike :last_name`, {
        last_name: `%${searchParams.last_name}%`,
      });
      qbCount?.andWhere(`${alias}.last_name ilike :last_name`, {
        last_name: `%${searchParams.last_name}%`,
      });
    }
    if (searchParams.email) {
      qbList.andWhere(`${alias}.email ilike :email`, {
        email: `%${searchParams.email}%`,
      });
      qbCount?.andWhere(`${alias}.email ilike :email`, {
        email: `%${searchParams.email}%`,
      });
    }
    if (searchParams.staff_id) {
      qbList.andWhere(`${alias}.staff_id=:staff_id`, {
        staff_id: searchParams.staff_id,
      });
      qbCount?.andWhere(`${alias}.staff_id=:staff_id`, {
        staff_id: searchParams.staff_id,
      });
    }
    qbList.orderBy(`${alias}.id`, 'DESC');
    if (!searchParams.all) {
      qbList.offset(offset);
      qbList.limit(limit);
    }
    let [list, count] = await Promise.all([
      qbList.execute(),
      qbCount?.getCount(),
    ]);
    list = list.map((item) => ({
      ...item,
      system_user_password: undefined,
      system_user_secret: undefined,
    }));
    return { list, count };
  }

  async findById(id: number): Promise<SystemUserEntity> {
    const exists = await this.systemUserRepository.findOne({
      where: { id, is_deleted: Not(true) },
      relations: { staff: true },
    });
    if (!exists) {
      throw new NotFoundException(translationsSeed.user_not_found.key);
    }
    const { password: _p, secret: _s, ...rest } = exists;
    return rest as SystemUserEntity;
  }

  async createUser(data: UserCreateDto): Promise<SystemUserEntity> {
    const existsUser = await this.systemUserRepository.findOne({
      where: { email: data.email },
    });
    if (existsUser) {
      throw new BadRequestException(translationsSeed.email_already_used.key);
    }
    const secret = randomString(64);
    const DATA = {
      ...data,
      is_root: false,
      secret,
      password: createHashHmac(data.password, secret),
    };
    const newUser = this.systemUserRepository.create(DATA);
    if (data.staff_id) {
      const staff = await this.staffRepository.findOne({
        where: { id: data.staff_id },
      });
      newUser.staff = staff;
    }
    return await this.systemUserRepository.save(newUser);
  }

  async updateSystemUser(
    id: number,
    data: UserUpdateDto,
  ): Promise<SystemUserEntity> {
    const exists = await this.findById(id);
    exists.first_name = data.first_name;
    exists.last_name = data.last_name;
    if (data.staff_id) {
      const staff = await this.staffRepository.findOne({
        where: { id: data.staff_id },
      });
      exists.staff = staff;
    } else {
      exists.staff = null;
    }
    if (data.password) {
      const secret = randomString(64);
      exists.secret = secret;
      exists.password = createHashHmac(data.password, secret);
    }
    return await this.systemUserRepository.save(exists);
  }

  async blockSystemUser(id: number): Promise<SystemUserEntity> {
    const exists = await this.findById(id);
    exists.is_blocked = !exists.is_blocked;
    return await this.systemUserRepository.save(exists);
  }

  async deleteSystemUser(id: number): Promise<void> {
    const exists = await this.findById(id);
    exists.is_deleted = true;
    await this.systemUserRepository.save(exists);
  }

  async changePassword(
    oldPassword: string,
    newPassword: string,
    system_user__id: number,
  ): Promise<void> {
    const currentUser = await this.systemUserRepository.findOne({
      where: { id: system_user__id },
    });
    if (currentUser) {
      const oldHashPassword = createHashHmac(oldPassword, currentUser.secret);
      if (currentUser.password !== oldHashPassword) {
        throw new BadRequestException({
          message: {
            current_password: translationsSeed.current_password_invalid.key,
          },
        });
      }
      const secret = randomString(64);
      const newHashPassword = createHashHmac(newPassword, secret);
      currentUser.password = newHashPassword;
      currentUser.secret = secret;
      await this.systemUserRepository.save(currentUser);
    } else {
      throw new BadRequestException(translationsSeed.user_not_found.key);
    }
  }

  async generateAuthenticator(system_user__id: number, enable: boolean) {
    const systemUser = await this.findById(system_user__id);
    if (enable) {
      if (
        systemUser.authenticator_enabled &&
        systemUser.authenticator?.otpauth_url
      ) {
        const image = await this.speakeasyService.generateQrCodeImage(
          systemUser.authenticator?.otpauth_url,
        );
        return {
          image,
          code: systemUser.authenticator.base32,
        };
      }
      const secret = this.speakeasyService.generateSecretObject(
        process.env.AUTHENTICATOR_NAME || 'APP',
      );
      systemUser.authenticator = secret;
      systemUser.authenticator_enabled = true;
      await this.systemUserRepository.save(systemUser);
      const image = await this.speakeasyService.generateQrCodeImage(
        secret.otpauth_url,
      );
      return {
        image,
        code: secret.base32,
      };
    } else {
      systemUser.authenticator = null;
      systemUser.authenticator_enabled = false;
      await this.systemUserRepository.save(systemUser);
      return { image: '', code: '' };
    }
  }
}
