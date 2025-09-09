import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TranslatesEntity } from './translates.entity';
import { LanguagesService } from '../languages/languages.service';
import { translationsSeed } from '../utils/variables';
import { SearchTranslateInterface } from './interface/search-translate.interface';
import { CurrentTranslateInterface } from './interface/current-translate.interface';

@Injectable()
export class TranslatesService {
  private pageSize = 5;
  constructor(
    @InjectRepository(TranslatesEntity)
    private translatesRepository: Repository<TranslatesEntity>,
    private languagesService: LanguagesService,
  ) {}

  async seedTranslations(): Promise<TranslatesEntity[]> {
    const data = Object.values(translationsSeed);
    const result: TranslatesEntity[] = [];
    for await (const { key, value } of data) {
      const exists = await this.translatesRepository.findOne({
        where: { key },
      });
      if (!exists) {
        const tr = await this.createNewTranslation(key, value);
        result.push(tr);
      }
    }
    return result;
  }

  async getAllCurrent(searchParams: CurrentTranslateInterface) {
    const selection = `key, value->>'${searchParams.lang}' as value`;
    const alias = 'translates';
    const qbList = this.translatesRepository.createQueryBuilder(alias);
    qbList.select(selection);
    const result = await qbList.execute();
    const currentTranslations = result.reduce(
      (obj: any, item: any) => ({ ...obj, [item.key]: item.value }),
      {},
    );
    return currentTranslations;
  }

  async getAll(searchParams: SearchTranslateInterface) {
    const limit = searchParams.limit || this.pageSize;
    const offset = (searchParams.page - 1) * limit;
    const selection = `id, key, value->>'${searchParams.lang}' as value`;
    const alias = 'translates';
    const qbList = this.translatesRepository.createQueryBuilder(alias);
    qbList.select(selection);
    const qbCount = this.translatesRepository.createQueryBuilder(alias);
    if (searchParams.search) {
      qbList.orWhere(`${alias}.key ilike :search`, {
        search: `%${searchParams.search}%`,
      });
      qbList.orWhere(`${alias}.value->>'${searchParams.lang}' ilike :search`, {
        search: `%${searchParams.search}%`,
      });
      qbCount.andWhere(`${alias}.key ilike :search`, {
        search: `%${searchParams.search}%`,
      });
      qbCount.orWhere(`${alias}.value->>'${searchParams.lang}' ilike :search`, {
        search: `%${searchParams.search}%`,
      });
    }
    qbList.orderBy(`${alias}.id`, 'DESC');
    qbList.offset(offset);
    qbList.limit(limit);
    const [list, count] = await Promise.all([
      qbList.execute(),
      qbCount.getCount(),
    ]);
    return { list, count };
  }

  async createNewTranslation(
    key: string,
    value: any,
    with_exception: boolean = false,
  ): Promise<TranslatesEntity> {
    if (with_exception) {
      const exists = await this.translatesRepository.findOne({
        where: { key },
      });
      if (exists) {
        throw new BadRequestException(translationsSeed.translation_exists.key);
      }
    }
    let tr = this.translatesRepository.create({ key, value });
    tr = await this.translatesRepository.save(tr);
    return tr;
  }

  async findTranslation(id: number, key?: string): Promise<TranslatesEntity> {
    const where: any = { id };
    if (key) {
      where.key = key;
    }
    const exists = await this.translatesRepository.findOne({ where });
    if (!exists) {
      throw new NotFoundException(translationsSeed.data_not_found.key);
    }
    return exists;
  }

  async updateTranslation(
    id: number,
    key: string,
    value: any,
  ): Promise<TranslatesEntity> {
    const tr = await this.findTranslation(id, key);
    tr.value = value;
    await this.translatesRepository.save(tr);
    return tr;
  }

  async deleteTranslation(id: number): Promise<void> {
    const tr = await this.findTranslation(id);
    await this.translatesRepository.remove(tr);
  }
}
