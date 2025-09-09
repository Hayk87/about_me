import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RightsEntity } from './rights.entity';
import { rightsList } from '../utils/variables';

@Injectable()
export class RightsService {
  constructor(
    @InjectRepository(RightsEntity)
    private rightsRepository: Repository<RightsEntity>,
  ) {}

  getRights(): Promise<RightsEntity[]> {
    return this.rightsRepository.find({ order: { id: 'ASC' } });
  }

  async seedRights() {
    for await (const right of rightsList) {
      const exists = await this.rightsRepository.findOne({
        where: { code: right.code },
      });
      if (exists) {
        exists.title = right.title;
        await this.rightsRepository.save(exists);
      } else {
        const newRight = this.rightsRepository.create(right);
        await this.rightsRepository.save(newRight);
      }
    }
  }
}
