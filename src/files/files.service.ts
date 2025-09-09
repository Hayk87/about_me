import { Injectable, NotFoundException, StreamableFile } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import * as fs from "fs";
import * as path from "path";
import { FilesEntity } from "./files.entity";
import { translationsSeed } from "../utils/variables";

interface IFile {
  fieldname: string;
  originalname: string,
  encoding: string,
  mimetype: string,
  buffer: Buffer;
  size: number;
}

interface IUploadedFile {
  fileDirectory: string | null;
  fileName: string;
  fileType: string;
  fileSize: number;
}

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FilesEntity)
    private filesRepository: Repository<FilesEntity>,
  ) {}

  async uploadFile(file: IFile, directory?: string[]): Promise<IUploadedFile> {
    const filePathArgs = [__dirname, '..', '..', 'uploads'];
    let fileSecondaryDirectory = null;
    if (directory?.length) {
      fileSecondaryDirectory = directory.join('/');
      filePathArgs.push(fileSecondaryDirectory);
    }
    const uploadsDirFolder = path.join(...filePathArgs);
    filePathArgs.push(file.originalname);
    const filePath = path.join(...filePathArgs);
    fs.mkdirSync(uploadsDirFolder, { recursive: true });
    fs.writeFileSync(filePath, file.buffer);
    return {
      fileDirectory: fileSecondaryDirectory,
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
    }
  }

  async saveFile(data: IUploadedFile, manager?: EntityManager): Promise<FilesEntity> {
    const repo = manager ? manager.getRepository(FilesEntity) : this.filesRepository;
    const newFile = repo.create({
      name: data.fileName,
      type: data.fileType,
      directory: data.fileDirectory,
      size: data.fileSize,
    });
    return (await repo.save(newFile));
  }

  async storeFile(file: IFile, directory?: string[], manager?: EntityManager): Promise<FilesEntity> {
    const fileData = await this.uploadFile(file, directory);
    return (await this.saveFile(fileData, manager));
  }

  async streamFile(id: string, disposition: boolean) {
    const file = await this.filesRepository.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException(translationsSeed.data_not_found.key);
    }
    const filePathArgs = [__dirname, '..', '..', 'uploads'];
    if (file.directory) {
      filePathArgs.push(file.directory)
    }
    filePathArgs.push(file.name);
    const filePath = path.join(...filePathArgs);
    const fileData: any = fs.createReadStream(filePath);
    const options: any = {
      type: file.type,
      length: file.size,
    }
    if (disposition) {
      options.disposition = `attachment; filename="${file.name}"`;
    }
    return new StreamableFile(fileData, options);
  }
}
