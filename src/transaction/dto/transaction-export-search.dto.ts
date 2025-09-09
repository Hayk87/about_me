import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TransactionExportSearchDto {
  @ApiProperty({ type: String, description: 'Page' })
  page: number;

  @ApiPropertyOptional({ type: String, description: 'Limit' })
  limit?: number;

  @ApiPropertyOptional({ type: String, description: 'Amount from' })
  created_from?: string;

  @ApiPropertyOptional({ type: String, description: 'Amount to' })
  created_to?: string;

  @ApiPropertyOptional({ type: String, description: 'Amount from' })
  amount_from?: number;

  @ApiPropertyOptional({ type: String, description: 'Amount to' })
  amount_to?: number;

  @ApiPropertyOptional({ type: String, description: 'Operator ID' })
  system_user_id?: number;
}
