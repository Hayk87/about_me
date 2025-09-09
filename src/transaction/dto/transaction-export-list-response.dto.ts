import { ApiProperty } from '@nestjs/swagger';

export class TransactionExportListResponseDto {
  @ApiProperty({ type: Object, description: 'list', isArray: true })
  list: object[];

  @ApiProperty({ type: Number, description: 'Total of list' })
  count: number;
}
