import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { languagesListData } from '../../utils/languages-list-data';
import { translationsSeed } from '../../utils/variables';

@Injectable()
export class CreateStaffPipe implements PipeTransform {
  transform(post: any, metadata: ArgumentMetadata) {
    const errors: Record<string, any> = {};
    const plainData: Record<string, any> = {};
    if (!post.rights) {
      errors.rights = translationsSeed.required_field.key;
    } else if (!Array.isArray(post.rights)) {
      errors.rights = translationsSeed.invalid_value.key;
    } else if (!post.rights.length) {
      errors.rights = translationsSeed.required_field.key;
    } else if (post.rights.some((r) => typeof r !== 'number')) {
      errors.rights = translationsSeed.invalid_value.key;
    }

    for (const lang of languagesListData) {
      if (!post.title?.[lang.code]) {
        errors.title = {
          ...errors.title,
          [lang.code]: translationsSeed.required_field.key,
        };
      } else if (typeof post.title?.[lang.code] !== 'string') {
        errors.title = {
          ...errors.title,
          [lang.code]: translationsSeed.invalid_value.key,
        };
      } else {
        plainData.title = {
          ...plainData.title,
          [lang.code]: post.title?.[lang.code],
        };
      }
    }
    if (Object.keys(errors).length) {
      throw new BadRequestException({ message: errors });
    }
    plainData.rights = post.rights;
    return plainData;
  }
}
