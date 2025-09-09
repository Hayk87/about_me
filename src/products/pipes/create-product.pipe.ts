import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { languagesListData } from '../../utils/languages-list-data';
import {
  floatPositiveNumberRegexp,
  translationsSeed,
} from '../../utils/variables';

@Injectable()
export class CreateProductPipe implements PipeTransform {
  transform(post: any, metadata: ArgumentMetadata) {
    const errors: Record<string, any> = {};
    const plainData: Record<string, any> = {};
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
    if (post.measurement_id === undefined) {
      errors.measurement_id = translationsSeed.required_field.key;
    } else if (
      !Number.isInteger(post.measurement_id) ||
      (Number.isInteger(post.measurement_id) && post.measurement_id <= 0)
    ) {
      errors.measurement_id = translationsSeed.invalid_value.key;
    } else {
      plainData.measurement_id = post.measurement_id;
    }
    if (post.quantity === undefined) {
      errors.quantity = translationsSeed.required_field.key;
    } else if (
      typeof post.quantity !== 'number' ||
      (typeof post.quantity === 'number' &&
        !floatPositiveNumberRegexp.test(post.quantity))
    ) {
      errors.quantity = translationsSeed.invalid_value.key;
    } else {
      plainData.quantity = post.quantity;
    }
    if (post.buy_price === undefined) {
      errors.buy_price = translationsSeed.required_field.key;
    } else if (
      typeof post.buy_price !== 'number' ||
      (typeof post.buy_price === 'number' &&
        !floatPositiveNumberRegexp.test(post.buy_price))
    ) {
      errors.buy_price = translationsSeed.invalid_value.key;
    } else {
      plainData.buy_price = post.buy_price;
    }
    if (post.sell_price === undefined) {
      errors.sell_price = translationsSeed.required_field.key;
    } else if (
      typeof post.sell_price !== 'number' ||
      (typeof post.sell_price === 'number' &&
        !floatPositiveNumberRegexp.test(post.sell_price))
    ) {
      errors.sell_price = translationsSeed.invalid_value.key;
    } else {
      plainData.sell_price = post.sell_price;
    }
    if (Object.keys(errors).length) {
      throw new BadRequestException({ message: errors });
    }
    return plainData;
  }
}
