// import { FileValidator } from '@nestjs/common';
// import { translationsSeed } from "../../utils/variables";
//
// interface FileValidationOptions {
//   maxSize: number; // in bytes
//   allowedTypes: RegExp | string[]; // e.g. /(jpeg|png)$/ or ['image/jpeg','image/png']
// }
//
// export class OfferFileValidator extends FileValidator<FileValidationOptions> {
//   constructor(options: FileValidationOptions) {
//     super(options);
//   }
//
//   isValid(file?: Express.Multer.File): boolean {
//     if (!file) return false;
//
//     // ✅ Size check
//     if (file.size > this.validationOptions.maxSize) {
//       return false;
//     }
//
//     // ✅ Type check
//     if (this.validationOptions.allowedTypes instanceof RegExp) {
//       return this.validationOptions.allowedTypes.test(file.mimetype);
//     } else if (Array.isArray(this.validationOptions.allowedTypes)) {
//       return this.validationOptions.allowedTypes.includes(file.mimetype);
//     }
//
//     return false;
//   }
//
//   buildErrorMessage(file: Express.Multer.File): string {
//     if (this.validationOptions.maxSize) {
//       return translationsSeed.invalid_value.key;
//     }
//     if (this.validationOptions.allowedTypes) {
//       return translationsSeed.invalid_type_value.key;
//     }
//   }
// }

import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { translationsSeed } from "../../utils/variables";

@Injectable()
export class OfferFilePipe implements PipeTransform {
  allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/vnd.ms-excel'];

  transform(files: any, metadata: ArgumentMetadata) {
    const errors: Record<string, any> = {};
    for (const file of (files || [])) {
      if (!this.allowedTypes.includes(file.mimetype)) {
        errors.files = translationsSeed.invalid_type_value.key;
      } else if (file.size > 10 * 1024 * 1024) { // 10 MB
        errors.files = translationsSeed.invalid_file_size.key;
      }
    }
    if (Object.keys(errors).length) {
      throw new BadRequestException({ message: errors });
    }
    return files;
  }
}
