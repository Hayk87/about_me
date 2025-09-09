import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { emailRegexp, translationsSeed } from "../../utils/variables";

@Injectable()
export class OfferBodyPipe implements PipeTransform {
  transform(post: any, metadata: ArgumentMetadata) {
    const errors: Record<string, any> = {};
    const plainData: Record<string, any> = {
      name: post.name?.trim?.(),
      email: post.email?.trim?.(),
      content: post.content?.trim?.(),
    };
    if (!plainData.name?.trim?.()) {
      errors.name = translationsSeed.required_field.key;
    } else if (typeof plainData.name !== 'string') {
      errors.name = translationsSeed.invalid_value.key;
    }

    if (!plainData.email?.trim?.()) {
      errors.email = translationsSeed.required_field.key;
    } else if (typeof plainData.email !== 'string') {
      errors.email = translationsSeed.invalid_value.key;
    } else if (!plainData.email.match(emailRegexp)) {
      errors.email = translationsSeed.invalid_email_address.key;
    }

    if (!plainData.content?.trim?.()) {
      errors.content = translationsSeed.required_field.key;
    } else if (typeof plainData.content !== 'string') {
      errors.content = translationsSeed.invalid_value.key;
    }

    if (Object.keys(errors).length) {
      throw new BadRequestException({ message: errors });
    }
    return plainData;
  }
}
