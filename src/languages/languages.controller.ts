import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LanguagesService } from './languages.service';
import { LanguageInterface } from './interfaces/language.interface';
import { LanguageResponseDto } from './dto/language-response.dto';

@ApiTags('Languages')
@Controller('languages')
export class LanguagesController {
  constructor(private languagesService: LanguagesService) {}

  @ApiOkResponse({
    type: LanguageResponseDto,
    isArray: true,
  })
  @Get()
  getAllLanguages(): LanguageInterface[] {
    return this.languagesService.getLanguages();
  }
}
