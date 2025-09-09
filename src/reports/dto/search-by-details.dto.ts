import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchByDetailsDto {
  @ApiProperty({
    type: String,
    description: 'Result type: result | xls | xlsx | csv',
  })
  resultType: 'result' | 'xls' | 'xlsx' | 'csv';

  @ApiProperty({
    type: String,
    description: 'Report type: imports | exports | both',
  })
  reportType: 'imports' | 'exports' | 'both';

  @ApiPropertyOptional({ type: String, description: 'creation date start' })
  created_start?: string;

  @ApiPropertyOptional({ type: String, description: 'creation date end' })
  created_end?: string;

  @ApiPropertyOptional({ type: Number, description: 'amount start' })
  amount_start?: number;

  @ApiPropertyOptional({ type: Number, description: 'amount end' })
  amount_end?: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'Product IDs',
    isArray: true,
  })
  product_ids?: number[];

  @ApiPropertyOptional({
    type: Number,
    description: 'Operator IDs',
    isArray: true,
  })
  operator_ids?: number[];

  @ApiPropertyOptional({
    type: Number,
    description: 'Staff IDs',
    isArray: true,
  })
  staff_ids?: number[];

  @ApiPropertyOptional({
    type: Object,
    description: 'Translations',
    isArray: false,
  })
  trs?: object;

  @ApiPropertyOptional({
    type: String,
    description: 'Language code',
    isArray: false,
  })
  lngCode?: string;
}
