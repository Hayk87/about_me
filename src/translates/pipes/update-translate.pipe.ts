import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { translationsSeed } from '../../utils/variables';
import { languagesListData } from '../../utils/languages-list-data';

@Injectable()
export class UpdateTranslatePipe implements PipeTransform {
  transform(post: any) {
    const errors: Record<string, any> = {};
    const plainData: Record<string, any> = {};
    plainData.key = post.key;
    if (!post.key) {
      errors.key = translationsSeed.required_field.key;
    } else if (typeof post.key !== 'string') {
      errors.key = translationsSeed.invalid_value.key;
    }
    for (const lang of languagesListData) {
      plainData.value = {
        ...plainData.value,
        [lang.code]: post.value?.[lang.code],
      };
      if (!post.value?.[lang.code]) {
        errors.value = {
          ...errors.value,
          [lang.code]: translationsSeed.required_field.key,
        };
      } else if (typeof post.value?.[lang.code] !== 'string') {
        errors.value = {
          ...errors.value,
          [lang.code]: translationsSeed.invalid_value.key,
        };
      }
    }
    if (Object.keys(errors).length) {
      throw new BadRequestException({ message: errors });
    }
    return plainData;
  }
}
