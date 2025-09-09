import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { translationsSeed } from '../../utils/variables';

@Injectable()
export class SearchOfferPipe implements PipeTransform {
  transform(post: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'query') {
      let { page, limit, all, name, email } = post;
      const errors: Record<string, string> = {};
      if (!page) {
        errors.page = translationsSeed.required_field.key;
      } else if (typeof page !== 'string') {
        errors.page = translationsSeed.invalid_value.key;
      } else if (!/^\d+$/.test(page) || page === '0') {
        errors.page = translationsSeed.invalid_value.key;
      }
      if (name && typeof name !== 'string') {
        errors.name = translationsSeed.invalid_value.key;
      }
      if (email && typeof email !== 'string') {
        errors.email = translationsSeed.invalid_value.key;
      }
      if (limit && (!/^\d+$/.test(limit) || limit === '0')) {
        errors.limit = translationsSeed.invalid_value.key;
      }
      if (Object.keys(errors).length) {
        throw new BadRequestException({ message: errors });
      }
      page = parseInt(page);
      if (limit) {
        limit = parseInt(limit);
      }
      return { page, limit, all, name, email };
    }
    return post;
  }
}
