import { ApiProperty } from '@nestjs/swagger';

export class CreateUpdateTranslateDto {
  @ApiProperty({ type: String, description: 'Translation key' })
  key: string;

  @ApiProperty({
    type: Object,
    description: 'Translation value { "hy": "Title hy", "en": "Title en" }',
  })
  value: object;
}
