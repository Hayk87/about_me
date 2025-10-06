import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import {
  translationsSeed,
} from '../../utils/variables';

@Injectable()
export class ByCategoryCodeProductsPipe implements PipeTransform {
  transform(post: any, metadata: ArgumentMetadata) {
    if (!post.match(/^[a-zA-Z0-9-_]+$/)) {
      throw new BadRequestException(translationsSeed.invalid_value.key);
    }
    return post;
  }
}
