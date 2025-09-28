import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { FilesService } from "../files/files.service";
import { OfferBodyInterface } from "./interfaces/offer-body.interface";
import { OfferEntity } from "./offer.entity";
import { translationsSeed } from "../utils/variables";
import { SearchOfferInterface } from "./interfaces/search-offer.interface";

@Injectable()
export class OfferService {
  private pageSize = 5;
  constructor(
    private readonly filesService: FilesService,
    @InjectRepository(OfferEntity) private offerRepository: Repository<OfferEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async storeOffer(data: OfferBodyInterface, files: Array<Express.Multer.File> = []) {
    return (await this.dataSource.transaction(async (manager) => {
      const subDir = Date.now().toString();
      const savedFiles = [];
      for (const file of files) {
        const savedFile = await this.filesService.storeFile(file, ['offers', data.email, subDir], manager);
        savedFiles.push(savedFile);
      }
      const offer = manager.create(OfferEntity, {
        name: data.name,
        email: data.email,
        content: data.content,
        files: savedFiles,
      });
      return (await manager.save(offer));
    }));
  }

  async getOffers(searchParams: SearchOfferInterface) {
    const limit = searchParams.limit || this.pageSize;
    const offset = (searchParams.page - 1) * limit;
    const alias = 'offer';
    const qbList = this.offerRepository.createQueryBuilder(alias);
    const qbCount = !searchParams.all ? this.offerRepository.createQueryBuilder(alias) : null;
    if (searchParams.name) {
      qbList.andWhere(`${alias}.name ilike :name`, {
        name: `%${searchParams.name}%`,
      });
      qbCount?.andWhere(`${alias}.name ilike :name`, {
        name: `%${searchParams.name}%`,
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

  async getOfferById(id: number) {
    const exists = await this.offerRepository.findOne({ where: { id }, relations: { files: true } });
    if (!exists) {
      throw new NotFoundException(translationsSeed.data_not_found.key);
    }
    return exists;
  }
}
