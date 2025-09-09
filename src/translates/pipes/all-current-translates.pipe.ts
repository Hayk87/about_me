import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { languagesListData } from '../../utils/languages-list-data';
import { translationsSeed } from '../../utils/variables';

@Injectable()
export class AllCurrentTranslatesPipe implements PipeTransform {
  transform(post: any) {
    if (!post.lang) {
      throw new BadRequestException(translationsSeed.required_field.key);
    } else if (
      typeof post.lang !== 'string' ||
      (typeof post.lang === 'string' &&
        !languagesListData.find((item) => item.code === post.lang))
    ) {
      throw new BadRequestException(translationsSeed.invalid_value.key);
    }
    return post;
  }
}
