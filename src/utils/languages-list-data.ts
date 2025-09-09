import { LanguageInterface } from '../languages/interfaces/language.interface';

const default_lang_code: string = 'hy';

export const languagesListData: LanguageInterface[] = [
  {
    url_prefix: 'hy',
    code: 'hy',
    name: 'Հայերեն',
    is_default: default_lang_code === 'hy',
    order: 1,
  },
  {
    url_prefix: 'en',
    code: 'en',
    name: 'English',
    is_default: default_lang_code === 'en',
    order: 2,
  },
];
