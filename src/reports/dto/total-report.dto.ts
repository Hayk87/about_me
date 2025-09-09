import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TotalReportDto {
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

  @ApiPropertyOptional({
    type: Number,
    description: 'Operator IDs',
    isArray: true,
  })
  operator_ids?: number[];

  @ApiPropertyOptional({
    type: Object,
    description: 'Translations',
    isArray: false,
  })
  trs?: object;
}
