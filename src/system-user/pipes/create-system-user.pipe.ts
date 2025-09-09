import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { emailRegexp, passwordRegexp } from '../../utils/variables';
import { translationsSeed } from '../../utils/variables';

@Injectable()
export class CreateSystemUserPipe implements PipeTransform {
  transform(post: any, metadata: ArgumentMetadata) {
    let { first_name, last_name, email, password, staff_id } = post;
    const errors: Record<string, string> = {};
    const plainData: Record<string, string> = {};
    if (!first_name) {
      errors.first_name = translationsSeed.required_field.key;
    } else if (typeof first_name !== 'string') {
      errors.first_name = translationsSeed.invalid_value.key;
    } else {
      first_name = (first_name as string).trim();
      if (!first_name) {
        errors.first_name = translationsSeed.required_field.key;
      }
    }
    if (!last_name) {
      errors.last_name = translationsSeed.required_field.key;
    } else if (typeof last_name !== 'string') {
      errors.last_name = translationsSeed.invalid_value.key;
    } else {
      last_name = (last_name as string).trim();
      if (!last_name) {
        errors.last_name = translationsSeed.required_field.key;
      }
    }
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

    if (staff_id && (typeof staff_id !== 'number' || !(staff_id > 0))) {
      errors.staff_id = translationsSeed.invalid_value.key;
    }
    if (Object.keys(errors).length) {
      throw new BadRequestException({ message: errors });
    }
    plainData.first_name = post.first_name;
    plainData.last_name = post.last_name;
    plainData.email = post.email;
    plainData.password = post.password;
    if (staff_id) {
      plainData.staff_id = staff_id;
    }
    return plainData;
  }
}
