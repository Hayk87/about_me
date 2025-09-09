import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import {
  intPositiveNumberRegexp,
  translationsSeed,
} from '../../utils/variables';

@Injectable()
export class TransactionExportSearchPipe implements PipeTransform {
  transform(post: any, metadata: ArgumentMetadata) {
    const errors: Record<string, string> = {};
    if (!post.page) {
      errors.page = translationsSeed.required_field.key;
    } else if (typeof post.page !== 'string') {
      errors.page = translationsSeed.invalid_value.key;
    } else if (!intPositiveNumberRegexp.test(post.page) || post.page === '0') {
      errors.page = translationsSeed.invalid_value.key;
    }
    if (
      post.limit &&
      (!intPositiveNumberRegexp.test(post.limit) || post.limit === '0')
    ) {
      errors.limit = translationsSeed.invalid_value.key;
    }
    if (Object.keys(errors).length) {
      throw new BadRequestException({ message: errors });
    }
    post.page = parseInt(post.page);
    if (post.limit) {
      post.limit = parseInt(post.limit);
    }
    if (post.amount_from) {
      post.amount_from = parseFloat(post.amount_from);
    }
    if (post.amount_to) {
      post.amount_to = parseFloat(post.amount_to);
    }
    if (post.system_user_id) {
      post.system_user_id = parseFloat(post.system_user_id);
    }
    return post;
  }
}
