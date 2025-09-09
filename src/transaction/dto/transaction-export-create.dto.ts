import { ApiProperty } from '@nestjs/swagger';

export class TransactionExportDetails {
  @ApiProperty({ type: Number, description: 'Product ID' })
  product_id: number;

  @ApiProperty({ type: Number, description: 'Count of product' })
  count: number;

  @ApiProperty({ type: Number, description: 'Buy price of product' })
  buy_price: number;
}

export class TransactionExportCreateDto {
  @ApiProperty({ type: TransactionExportDetails, isArray: true })
  details: TransactionExportDetails[];
}
