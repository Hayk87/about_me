import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginParamsDto {
  @ApiProperty({ type: String, description: 'E-mail address' })
  email: string;

  @ApiProperty({ type: String, description: 'Password' })
  password: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Authenticator token when enabled 2FA',
  })
  authenticator_token?: string;
}
