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
        measurement_id,
        quantity_from,
        quantity_to,
        buy_price_from,
        buy_price_to,
        sell_price_from,
        sell_price_to,
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
      if (
        category_id &&
        (!intPositiveNumberRegexp.test(category_id) || category_id === '0')
      ) {
        errors.category_id = translationsSeed.invalid_value.key;
      }
      if (
        measurement_id &&
        (!intPositiveNumberRegexp.test(measurement_id) ||
          measurement_id === '0')
      ) {
        errors.measurement_id = translationsSeed.invalid_value.key;
      }
      if (quantity_from && !floatPositiveNumberRegexp.test(quantity_from)) {
        errors.quantity_from = translationsSeed.invalid_value.key;
      }
      if (quantity_to && !floatPositiveNumberRegexp.test(quantity_to)) {
        errors.quantity_to = translationsSeed.invalid_value.key;
      }
      if (buy_price_from && !floatPositiveNumberRegexp.test(buy_price_from)) {
        errors.buy_price_from = translationsSeed.invalid_value.key;
      }
      if (buy_price_to && !floatPositiveNumberRegexp.test(buy_price_to)) {
        errors.buy_price_to = translationsSeed.invalid_value.key;
      }
      if (sell_price_from && !floatPositiveNumberRegexp.test(sell_price_from)) {
        errors.sell_price_from = translationsSeed.invalid_value.key;
      }
      if (sell_price_to && !floatPositiveNumberRegexp.test(sell_price_to)) {
        errors.sell_price_to = translationsSeed.invalid_value.key;
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
      if (measurement_id) {
        measurement_id = parseInt(measurement_id);
      }
      if (quantity_from) {
        quantity_from = parseFloat(quantity_from);
      }
      if (quantity_to) {
        quantity_to = parseFloat(quantity_to);
      }
      if (buy_price_from) {
        buy_price_from = parseFloat(buy_price_from);
      }
      if (buy_price_to) {
        buy_price_to = parseFloat(buy_price_to);
      }
      if (sell_price_from) {
        sell_price_from = parseFloat(sell_price_from);
      }
      if (sell_price_to) {
        sell_price_to = parseFloat(sell_price_to);
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
        category_id,
        measurement_id,
        quantity_from,
        quantity_to,
        buy_price_from,
        buy_price_to,
        sell_price_from,
        sell_price_to,
        page,
        limit,
        all,
      };
    }
    return post;
  }
}
