import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ type: Object, description: 'Title value, ex. { hy: "text" }' })
  title: Record<string, string>;

  @ApiProperty({ type: Number, description: 'Category ID' })
  category_id: number;

  @ApiProperty({ type: Number, description: 'Measurement ID' })
  measurement_id: number;

  @ApiPropertyOptional({ type: Number, description: 'Quantity ID' })
  quantity: number;

  @ApiProperty({ type: Number, description: 'Buy price, float type' })
  buy_price: number;

  @ApiProperty({ type: Number, description: 'Sell price, float type' })
  sell_price: number;
}
