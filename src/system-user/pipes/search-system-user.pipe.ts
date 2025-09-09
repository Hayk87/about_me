import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { translationsSeed } from '../../utils/variables';

@Injectable()
export class SearchSystemUserPipe implements PipeTransform {
  transform(post: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'query') {
      let { first_name, last_name, email, staff_id, page, limit, all } = post;
      const errors: Record<string, string> = {};

      if (first_name && typeof first_name !== 'string') {
        errors.first_name = translationsSeed.invalid_value.key;
      }
      if (last_name && typeof last_name !== 'string') {
        errors.last_name = translationsSeed.invalid_value.key;
      }
      if (email && typeof email !== 'string') {
        errors.email = translationsSeed.invalid_value.key;
      }

      if (staff_id && (!/^\d+$/.test(staff_id) || staff_id === '0')) {
        errors.staff_id = translationsSeed.invalid_value.key;
      }

      if (!page) {
        errors.page = translationsSeed.required_field.key;
      } else if (typeof page !== 'string') {
        errors.page = translationsSeed.invalid_value.key;
      } else if (!/^\d+$/.test(page) || page === '0') {
        errors.page = translationsSeed.invalid_value.key;
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
      if (first_name && typeof first_name === 'string') {
        first_name = (first_name as string).trim();
      }
      if (last_name && typeof last_name === 'string') {
        last_name = (last_name as string).trim();
      }
      if (email && typeof email === 'string') {
        email = (email as string).trim();
      }
      if (staff_id) {
        staff_id = parseInt(staff_id);
      }
      return { first_name, last_name, email, staff_id, page, limit, all };
    }
    return post;
  }
}
