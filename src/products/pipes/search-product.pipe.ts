import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { languagesListData } from '../../utils/languages-list-data';
import {
  floatPositiveNumberRegexp,
  intPositiveNumberRegexp,
  translationsSeed,
} from '../../utils/variables';

@Injectable()
export class SearchProductPipe implements PipeTransform {
  transform(post: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'query') {
      let {
        lang,
        title,
        category_id,
        code,
        price_from,
        price_to,
        page,
        limit,
        all,
      } = post;
      const errors: Record<string, string> = {};
      if (!lang) {
        throw new BadRequestException(translationsSeed.required_field.key);
      } else if (
        typeof lang !== 'string' ||
        !languagesListData.find((item) => item.code === lang)
      ) {
        throw new BadRequestException(translationsSeed.invalid_value.key);
      }
      if (title && typeof title !== 'string') {
        errors.title = translationsSeed.invalid_value.key;
      }
      if (code && typeof code !== 'string') {
        errors.code = translationsSeed.invalid_value.key;
      }
      if (
        category_id &&
        (!intPositiveNumberRegexp.test(category_id) || category_id === '0')
      ) {
        errors.category_id = translationsSeed.invalid_value.key;
      }
      if (price_from && !floatPositiveNumberRegexp.test(price_from)) {
        errors.price_from = translationsSeed.invalid_value.key;
      }
      if (price_to && !floatPositiveNumberRegexp.test(price_to)) {
        errors.price_to = translationsSeed.invalid_value.key;
      }
      if (!page) {
        errors.page = translationsSeed.required_field.key;
      } else if (typeof page !== 'string') {
        errors.page = translationsSeed.invalid_value.key;
      } else if (!intPositiveNumberRegexp.test(page) || page === '0') {
        errors.page = translationsSeed.invalid_value.key;
      }
      if (limit && (!intPositiveNumberRegexp.test(limit) || limit === '0')) {
        errors.limit = translationsSeed.invalid_value.key;
      }
      if (Object.keys(errors).length) {
        throw new BadRequestException({ message: errors });
      }
      if (category_id) {
        category_id = parseInt(category_id);
      }
      if (price_from) {
        price_from = parseFloat(price_from);
      }
      if (price_to) {
        price_to = parseFloat(price_to);
      }
      page = parseInt(page);
      if (limit) {
        limit = parseInt(limit);
      }
      if (title && typeof title === 'string') {
        title = (title as string).trim();
      }
      return {
        lang,
        title,
        code,
        category_id,
        price_from,
        price_to,
        page,
        limit,
        all,
      };
    }
    return post;
  }
}
