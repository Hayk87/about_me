import { ApiProperty } from '@nestjs/swagger';

export class AllCurrentTranslatesDto {
  @ApiProperty({ type: String, description: 'Language code' })
  lang: string;
}
