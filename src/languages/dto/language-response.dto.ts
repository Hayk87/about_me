import { ApiProperty } from '@nestjs/swagger';

export class LanguageResponseDto {
  @ApiProperty({ type: String, description: 'Language url prefix' })
  url_prefix: string;

  @ApiProperty({ type: String, description: 'Language code' })
  code: string;

  @ApiProperty({ type: String, description: 'Language name' })
  name: string;

  @ApiProperty({ type: Boolean, description: 'Language is default or not' })
  is_default: boolean;

  @ApiProperty({ type: String, description: 'Language ordering' })
  order: number;
}
