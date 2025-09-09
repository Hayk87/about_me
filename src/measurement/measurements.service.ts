import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeasurementsEntity } from './measurements.entity';
import { translationsSeed } from '../utils/variables';
import { CreateUpdateMeasurementDto } from './dto/create-update-translate.dto';
import { SearchMeasurementInterface } from './interface/search-measurement.interface';

@Injectable()
export class MeasurementsService {
  private pageSize = 5;
  constructor(
    @InjectRepository(MeasurementsEntity)
    private measurementRepository: Repository<MeasurementsEntity>,
  ) {}

  async getAll(searchParams: SearchMeasurementInterface) {
    const limit = searchParams.limit || this.pageSize;
    const offset = (searchParams.page - 1) * limit;
    const alias = 'measurement';
    const qbList = this.measurementRepository
      .createQueryBuilder(alias)
      .andWhere(`${alias}.is_deleted=:is_deleted`, { is_deleted: false });
    const qbCount = !searchParams.all
      ? this.measurementRepository
          .createQueryBuilder(alias)
          .andWhere(`${alias}.is_deleted=:is_deleted`, { is_deleted: false })
      : null;
    if (searchParams.title && searchParams.lang) {
      qbList.andWhere(`${alias}.title->>'${searchParams.lang}' ilike :title`, {
        title: `%${searchParams.title}%`,
      });
      qbCount?.andWhere(
        `${alias}.title->>'${searchParams.lang}' ilike :title`,
        { title: `%${searchParams.title}%` },
      );
    }
    qbList.orderBy(`${alias}.id`, 'DESC');
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

  async createMeasurement(
    data: CreateUpdateMeasurementDto,
  ): Promise<MeasurementsEntity> {
    let item = this.measurementRepository.create({ title: data.title });
    item = await this.measurementRepository.save(item);
    return item;
  }

  async findMeasurement(id: number): Promise<MeasurementsEntity> {
    const exists = await this.measurementRepository.findOne({
      where: { id, is_deleted: false },
    });
    if (!exists) {
      throw new NotFoundException(translationsSeed.data_not_found.key);
    }
    return exists;
  }

  async updateMeasurement(
    id: number,
    data: CreateUpdateMeasurementDto,
  ): Promise<MeasurementsEntity> {
    const item = await this.findMeasurement(id);
    item.title = data.title;
    await this.measurementRepository.save(item);
    return item;
  }

  async deleteMeasurement(id: number): Promise<void> {
    const item = await this.findMeasurement(id);
    item.is_deleted = true;
    await this.measurementRepository.save(item);
  }
}
