import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ type: String, description: 'System user first name' })
  current_password: string;

  @ApiProperty({ type: String, description: 'System user last name' })
  new_password: string;
}
