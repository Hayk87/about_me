import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { translationsSeed } from '../../utils/variables';

@Injectable()
export class TransactionExportCreatePipe implements PipeTransform {
  transform(value: any) {
    if (!Array.isArray(value.details)) {
      throw new BadRequestException(translationsSeed.required_field.key);
    }
    if (value.details.length === 0) {
      throw new BadRequestException(translationsSeed.required_field.key);
    }
    const errors: any = { details: [] };
    for (const item of value.details) {
      const errorItem: any = {};
      if (item.product_id === undefined) {
        errorItem.product_id = translationsSeed.required_field.key;
      } else if (
        typeof item.product_id !== 'number' ||
        (typeof item.product_id === 'number' && item.product_id <= 0)
      ) {
        errorItem.product_id = translationsSeed.invalid_value.key;
      }
      if (item.count === undefined) {
        errorItem.count = translationsSeed.required_field.key;
      } else if (
        typeof item.count !== 'number' ||
        (typeof item.count === 'number' && item.count <= 0)
      ) {
        errorItem.count = translationsSeed.invalid_value.key;
      }
      if (item.buy_price === undefined) {
        errorItem.buy_price = translationsSeed.required_field.key;
      } else if (
        typeof item.buy_price !== 'number' ||
        (typeof item.buy_price === 'number' && item.count <= 0)
      ) {
        errorItem.buy_price = translationsSeed.invalid_value.key;
      }
      errors.details.push(Object.keys(errorItem).length ? errorItem : null);
    }
    if (errors.details.filter((item) => !!item).length) {
      throw new BadRequestException({ message: errors });
    }
    return value;
  }
}
