import { Injectable } from '@nestjs/common';
import { LanguageInterface } from './interfaces/language.interface';
import { languagesList } from '../utils/variables';

@Injectable()
export class LanguagesService {
  languages: LanguageInterface[] = languagesList;

  getLanguages(): LanguageInterface[] {
    return this.languages;
  }
}
