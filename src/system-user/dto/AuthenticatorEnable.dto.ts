import { ApiProperty } from '@nestjs/swagger';

export class AuthenticatorEnableDto {
  @ApiProperty()
  enable: boolean;
}
