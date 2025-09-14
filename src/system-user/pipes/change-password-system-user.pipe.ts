import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { emailRegexp, passwordRegexp } from '../../utils/variables';
import { translationsSeed } from '../../utils/variables';

@Injectable()
export class ChangePasswordSystemUserPipe implements PipeTransform {
  transform(post: any, metadata: ArgumentMetadata) {
    let { current_password, new_password, repeat_password } = post;
    const errors: Record<string, string> = {};
    const plainData: Record<string, string> = {};

    if (!current_password) {
      errors.current_password = translationsSeed.required_field.key;
    } else if (typeof current_password !== 'string') {
      errors.current_password = translationsSeed.invalid_value.key;
    } else {
      current_password = (current_password as string).trim();
      if (!current_password.match(passwordRegexp)) {
        errors.current_password = translationsSeed.password_invalid_format.key;
      }
    }

    if (!new_password) {
      errors.new_password = translationsSeed.required_field.key;
    } else if (typeof new_password !== 'string') {
      errors.new_password = translationsSeed.invalid_value.key;
    } else {
      new_password = (new_password as string).trim();
      if (!new_password.match(passwordRegexp)) {
        errors.new_password = translationsSeed.password_invalid_format.key;
      }
      if (repeat_password !== new_password) {
        errors.new_password = translationsSeed.not_equal_password.key;
        errors.repeat_password = translationsSeed.not_equal_password.key;
      }
    }

    if (Object.keys(errors).length) {
      throw new BadRequestException({ message: errors });
    }
    plainData.current_password = post.current_password;
    plainData.new_password = post.new_password;
    return plainData;
  }
}
