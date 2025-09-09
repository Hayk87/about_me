import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserUpdateDto {
  @ApiProperty({ type: String, description: 'System user first name' })
  first_name: string;

  @ApiProperty({ type: String, description: 'System user last name' })
  last_name: string;

  @ApiPropertyOptional({
    type: String,
    required: false,
    description: 'System user password',
  })
  password?: string;

  @ApiPropertyOptional({
    type: Number,
    required: false,
    description: 'Staff ID',
  })
  staff_id?: number;
}
