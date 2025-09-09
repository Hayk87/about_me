import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateUpdateStaffDto } from './dto/create-staff.dto';
import { StaffEntity } from './staff.entity';
import { RightsEntity } from '../rights/rights.entity';
import { translationsSeed } from '../utils/variables';
import { SearchStaffInterface } from './interface/search-staff.interface';
import { SystemUserEntity } from '../system-user/system-user.entity';

@Injectable()
export class StaffsService {
  private pageSize = 5;
  constructor(
    @InjectRepository(SystemUserEntity)
    private systemUserEntityRepository: Repository<SystemUserEntity>,
    @InjectRepository(StaffEntity)
    private staffsRepository: Repository<StaffEntity>,
    @InjectRepository(RightsEntity)
    private rightsRepository: Repository<RightsEntity>,
  ) {}

  async create(createUpdateStaffDto: CreateUpdateStaffDto) {
    const rights = await this.rightsRepository.find({
      where: { id: In(createUpdateStaffDto.rights) },
    });
    const newStaff = this.staffsRepository.create({
      title: createUpdateStaffDto.title,
    });
    newStaff.rights = rights;
    return await this.staffsRepository.save(newStaff);
  }

  async findAll(searchParams: SearchStaffInterface) {
    const limit = searchParams.limit || this.pageSize;
    const offset = (searchParams.page - 1) * limit;
    const alias = 'staff';
    const qbList = this.staffsRepository.createQueryBuilder(alias);
    const qbCount = searchParams.all
      ? null
      : this.staffsRepository.createQueryBuilder(alias);
    if (searchParams.title && searchParams.lang) {
      qbList.andWhere(`${alias}.title->>'${searchParams.lang}' ilike :title`, {
        title: `%${searchParams.title}%`,
      });
      qbCount?.andWhere(
        `${alias}.title->>'${searchParams.lang}' ilike :title`,
        { title: `%${searchParams.title}%` },
      );
    }
    if (!searchParams.all) {
      qbList.offset(offset);
      qbList.limit(limit);
    }
    const [list, count] = await Promise.all([
      qbList.execute(),
      qbCount?.getCount(),
    ]);
    return { list, count };
  }

  async findOne(id: number) {
    const staff = await this.staffsRepository.findOne({
      where: { id },
      relations: { rights: true },
    });
    if (!staff) {
      throw new NotFoundException(translationsSeed.staff_not_found.key);
    }
    return staff;
  }

  async update(
    id: number,
    updateStaffDto: CreateUpdateStaffDto,
  ): Promise<StaffEntity> {
    const rights = await this.rightsRepository.find({
      where: { id: In(updateStaffDto.rights) },
    });
    const existsStaff = await this.findOne(id);
    existsStaff.title = updateStaffDto.title;
    existsStaff.rights = rights;
    return await this.staffsRepository.save(existsStaff);
  }

  async remove(id: number): Promise<void> {
    const staff = await this.staffsRepository.findOne({
      where: { id },
      relations: { system_user: true },
    });
    if (staff.system_user?.length) {
      for (const user of staff.system_user) {
        user.staff = null;
        await this.systemUserEntityRepository.save(user);
      }
    }
    await this.staffsRepository.remove(staff);
  }
}
