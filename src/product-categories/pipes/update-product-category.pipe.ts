import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { languagesListData } from '../../utils/languages-list-data';
import { translationsSeed } from '../../utils/variables';

@Injectable()
export class UpdateProductCategoryPipe implements PipeTransform {
  transform(post: any, metadata: ArgumentMetadata) {
    const errors: Record<string, any> = {};
    const plainData: Record<string, any> = {};
    if (!post.code) {
      errors.code = translationsSeed.required_field.key;
    } else if (post.code && typeof post.code !== 'string') {
      errors.code = translationsSeed.invalid_value.key;
    } else {
      plainData.code = post.code;
    }
    if (post.is_public === undefined) {
      plainData.is_public = false;
    } else if (typeof post.is_public !== 'boolean') {
      errors.is_public = translationsSeed.invalid_value.key;
    } else {
      plainData.is_public = post.is_public;
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
    return plainData;
  }
}
