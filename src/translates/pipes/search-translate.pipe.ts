import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { languagesListData } from '../../utils/languages-list-data';
import { translationsSeed } from '../../utils/variables';

@Injectable()
export class SearchTranslatePipe implements PipeTransform {
  transform(post: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'query') {
      let { search, page, limit } = post;
      const { lang } = post;
      const errors: Record<string, string> = {};
      if (!lang) {
        throw new BadRequestException(translationsSeed.required_field.key);
      } else if (
        typeof lang !== 'string' ||
        !languagesListData.find((item) => item.code === lang)
      ) {
        throw new BadRequestException(translationsSeed.invalid_value.key);
      }
      if (search && typeof search !== 'string') {
        errors.search = translationsSeed.invalid_value.key;
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
      if (search && typeof search === 'string') {
        search = (search as string).trim();
      }
      return { lang, search, page, limit };
    }
    return post;
  }
}
