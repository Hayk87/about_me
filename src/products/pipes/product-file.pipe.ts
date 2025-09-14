import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { translationsSeed } from "../../utils/variables";

@Injectable()
export class ProductFilePipe implements PipeTransform {
  allowedTypes = ['image/jpeg', 'image/png'];

  transform(files: any, metadata: ArgumentMetadata) {
    const errors: Record<string, any> = {};
    for (const file of (files || [])) {
      if (!this.allowedTypes.includes(file.mimetype)) {
        errors.files = translationsSeed.invalid_type_value.key;
      } else if (file.size > 10 * 1024 * 1024) { // 10 MB
        errors.files = translationsSeed.invalid_file_size.key;
      }
    }
    if (Object.keys(errors).length) {
      throw new BadRequestException({ message: errors });
    }
    return files;
  }
}
