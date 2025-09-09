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

  @ApiPropertyOptional({ type: String, description: 'Measurement ID' })
  measurement_id?: number;

  @ApiPropertyOptional({ type: String, description: 'Quantity From' })
  quantity_from?: number;

  @ApiPropertyOptional({ type: String, description: 'Quantity To' })
  quantity_to?: number;

  @ApiPropertyOptional({ type: String, description: 'Buy price From' })
  buy_price_from?: number;

  @ApiPropertyOptional({ type: String, description: 'Buy price To' })
  buy_price_to?: number;

  @ApiPropertyOptional({ type: String, description: 'Sell price From' })
  sell_price_from?: number;

  @ApiPropertyOptional({ type: String, description: 'Sell price To' })
  sell_price_to?: number;
}
