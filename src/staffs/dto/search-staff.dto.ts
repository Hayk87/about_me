import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchStaffDto {
  @ApiProperty({ type: String, description: 'Language code' })
  lang: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Select all, if exists it will get all: { list: [] }',
  })
  all?: string;

  @ApiPropertyOptional({ type: String, description: 'Title value' })
  title?: string;

  @ApiProperty({ type: String, description: 'Page' })
  page: number;

  @ApiPropertyOptional({ type: String, description: 'Limit' })
  limit?: number;
}
