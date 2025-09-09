import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchTranslateDto {
  @ApiProperty({ type: String, description: 'Language code' })
  lang: string;

  @ApiPropertyOptional({ type: String, description: 'Search by key or value' })
  search?: string;

  @ApiProperty({ type: String, description: 'Page' })
  page: number;

  @ApiPropertyOptional({ type: String, description: 'Limit' })
  limit?: number;
}
