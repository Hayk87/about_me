import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { translationsSeed } from '../../utils/variables';

const resultTypes = ['result', 'xls', 'xlsx', 'csv'];
const reportTypes = ['imports', 'exports', 'both'];
const dateFormat = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/;

@Injectable()
export class TotalReportPipe implements PipeTransform {
  transform(post: any, metadata: ArgumentMetadata) {
    const errors: any = {};
    if (!resultTypes.includes(post.resultType)) {
      errors.resultType = translationsSeed.invalid_value.key;
    }
    if (!reportTypes.includes(post.reportType)) {
      errors.reportType = translationsSeed.invalid_value.key;
    }
    if (post.created_start && !dateFormat.test(post.created_start)) {
      errors.created_start = translationsSeed.invalid_value.key;
    }
    if (post.created_end && !dateFormat.test(post.created_end)) {
      errors.created_end = translationsSeed.invalid_value.key;
    }
    if (post.operator_ids && !Array.isArray(post.operator_ids)) {
      errors.operator_ids = translationsSeed.invalid_value.key;
    } else if (
      post.operator_ids &&
      post.operator_ids.some((item) => typeof item !== 'number')
    ) {
      errors.operator_ids = translationsSeed.invalid_value.key;
    }
    if (Object.keys(errors).length) {
      throw new BadRequestException({ message: errors });
    }
    return post;
  }
}
