import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchOfferDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Select all, if exists it will get all: { list: [] }',
  })
  all?: string;

  @ApiPropertyOptional({ type: String, description: 'Name' })
  name?: string;

  @ApiPropertyOptional({ type: String, description: 'E-mail' })
  email?: string;

  @ApiProperty({ type: Number, description: 'Page' })
  page: number;

  @ApiPropertyOptional({ type: String, description: 'Limit' })
  limit?: number;
}
