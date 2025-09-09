import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import {
  authenticatorTokenRegexp,
  emailRegexp,
  passwordRegexp,
} from '../../utils/variables';
import { translationsSeed } from '../../utils/variables';

@Injectable()
export class AuthLoginPipe implements PipeTransform {
  transform(post: any, metadata: ArgumentMetadata) {
    const { email, password, authenticator_token } = post;
    const errors: Record<string, string> = {};
    const plainData: Record<string, string> = {};
    if (!email) {
      errors.email = translationsSeed.required_field.key;
    } else if (typeof email !== 'string') {
      errors.email = translationsSeed.invalid_value.key;
    } else if (!(email as string).match(emailRegexp)) {
      errors.email = translationsSeed.invalid_email_address.key;
    }

    if (!password) {
      errors.password = translationsSeed.required_field.key;
    } else if (typeof password !== 'string') {
      errors.password = translationsSeed.invalid_value.key;
    } else if (!(password as string).match(passwordRegexp)) {
      errors.password = translationsSeed.password_invalid_format.key;
    }

    if (
      authenticator_token &&
      !authenticator_token.match(authenticatorTokenRegexp)
    ) {
      errors.authenticator_token = translationsSeed.invalid_value.key;
    }

    if (Object.keys(errors).length) {
      throw new BadRequestException({ message: errors });
    }
    plainData.email = post.email;
    plainData.password = post.password;
    plainData.authenticator_token = post.authenticator_token;
    return plainData;
  }
}
