import { ApiProperty } from '@nestjs/swagger';

export class TransactionImportDetails {
  @ApiProperty({ type: Number, description: 'Product ID' })
  product_id: number;

  @ApiProperty({ type: Number, description: 'Count of product' })
  count: number;
}

export class TransactionImportCreateDto {
  @ApiProperty({ type: TransactionImportDetails, isArray: true })
  details: TransactionImportDetails[];
}
