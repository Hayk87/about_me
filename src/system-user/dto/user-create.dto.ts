import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserCreateDto {
  @ApiProperty({ type: String, description: 'System user first name' })
  first_name: string;

  @ApiProperty({ type: String, description: 'System user last name' })
  last_name: string;

  @ApiProperty({ type: String, description: 'System user E-mail' })
  email: string;

  @ApiProperty({ type: String, description: 'System user password' })
  password: string;

  @ApiPropertyOptional({ type: Number, description: 'Staff ID' })
  staff_id?: number;
}
