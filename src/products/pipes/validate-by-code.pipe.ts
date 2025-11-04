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
export class ValidateByCodePipe implements PipeTransform {
  transform(code: any, metadata: ArgumentMetadata) {
    if (!code.match(/^[a-zA-Z0-9-_]+$/)) {
      throw new BadRequestException(translationsSeed.invalid_value.key);
    }
    return code;
  }
}
