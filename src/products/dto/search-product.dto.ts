import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchProductDto {
  @ApiProperty({ type: String, description: 'Language code' })
  lang: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Select all, if exists it will get all: { list: [] }',
  })
  all?: string;

  @ApiProperty({ type: String, description: 'Page' })
  page: number;

  @ApiPropertyOptional({ type: String, description: 'Limit' })
  limit?: number;

  @ApiPropertyOptional({ type: String, description: 'Title value' })
  title?: string;

  @ApiPropertyOptional({ type: String, description: 'Category ID' })
  category_id?: number;

  @ApiPropertyOptional({ type: String, description: 'Price From' })
  price_from?: number;

  @ApiPropertyOptional({ type: String, description: 'Price To' })
  price_to?: number;
}
