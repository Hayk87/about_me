import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchSystemUserDto {
  @ApiProperty({ type: String, description: 'Page' })
  page: number;

  @ApiPropertyOptional({
    type: String,
    description: 'Select all, if exists it will get all: { list: [] }',
  })
  all?: string;

  @ApiPropertyOptional({ type: String, description: 'Limit' })
  limit?: number;

  @ApiPropertyOptional({ type: String, description: 'First name' })
  first_name?: string;

  @ApiPropertyOptional({ type: String, description: 'Last name' })
  last_name?: string;

  @ApiPropertyOptional({ type: String, description: 'E-mail' })
  email?: string;

  @ApiPropertyOptional({ type: String, description: 'Staff ID' })
  staff_id?: number;
}
