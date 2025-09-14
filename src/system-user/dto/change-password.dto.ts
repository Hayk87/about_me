import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ type: String, description: 'System user current password' })
  current_password: string;

  @ApiProperty({ type: String, description: 'System user new password' })
  new_password: string;

  @ApiProperty({ type: String, description: 'System user repeated password' })
  repeat_password: string;
}
