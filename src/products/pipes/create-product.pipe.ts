import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { languagesListData } from '../../utils/languages-list-data';
import {
  intPositiveNumberRegexp,
  translationsSeed,
} from '../../utils/variables';

@Injectable()
export class CreateProductPipe implements PipeTransform {
  transform(post: any, metadata: ArgumentMetadata) {
    post.category_id = parseInt(post.category_id);
    post.price = parseInt(post.price);
    try {
      post.title = JSON.parse(post.title);
    } catch (e) {}
    try {
      post.short_content = JSON.parse(post.short_content);
    } catch (e) {}
    try {
      post.content = JSON.parse(post.content);
    } catch (e) {}
    const errors: Record<string, any> = {};
    const plainData: Record<string, any> = {};
    if (!post.code) {
      errors.code = translationsSeed.required_field.key;
    } else if (post.code && typeof post.code !== 'string') {
      errors.code = translationsSeed.invalid_value.key;
    } else {
      plainData.code = post.code;
    }
    if (post.link && typeof post.link !== 'string') {
      errors.link = translationsSeed.invalid_value.key;
    } else {
      plainData.link = post.link;
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
      if (post.short_content?.[lang.code]) {
        if (typeof post.short_content?.[lang.code] !== 'string') {
          errors.short_content = {
            ...errors.short_content,
            [lang.code]: translationsSeed.invalid_value.key,
          };
        } else {
          plainData.short_content = {
            ...plainData.short_content,
            [lang.code]: post.short_content?.[lang.code],
          };
        }
      }
      if (typeof post.content?.[lang.code] !== 'string') {
        errors.content = {
          ...errors.content,
          [lang.code]: translationsSeed.invalid_value.key,
        };
      } else {
        plainData.content = {
          ...plainData.content,
          [lang.code]: post.content?.[lang.code],
        };
      }
    }
    if (post.category_id === undefined) {
      errors.category_id = translationsSeed.required_field.key;
    } else if (
      !Number.isInteger(post.category_id) ||
      (Number.isInteger(post.category_id) && post.category_id <= 0)
    ) {
      errors.category_id = translationsSeed.invalid_value.key;
    } else {
      plainData.category_id = post.category_id;
    }
    if (post.price === undefined) {
      errors.price = translationsSeed.required_field.key;
    } else if (
      typeof post.price !== 'number' ||
      (typeof post.price === 'number' && !intPositiveNumberRegexp.test(post.price))
    ) {
      errors.price = translationsSeed.invalid_value.key;
    } else {
      plainData.price = post.price;
    }
    if (post.is_public === undefined) {
      errors.is_public = translationsSeed.required_field.key;
    } else if (post.is_public !== 'true' && post.is_public !== 'false') {
      errors.is_public = translationsSeed.invalid_value.key;
    } else {
      plainData.is_public = JSON.parse(post.is_public);
    }
    if (post.order === undefined) {
      errors.order = translationsSeed.required_field.key;
    } else if (!intPositiveNumberRegexp.test(post.order)) {
      errors.order = translationsSeed.invalid_value.key;
    } else {
      plainData.order = parseInt(post.order);
    }
    if (Object.keys(errors).length) {
      throw new BadRequestException({ message: errors });
    }
    return plainData;
  }
}
