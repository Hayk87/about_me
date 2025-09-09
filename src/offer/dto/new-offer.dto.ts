import { ApiProperty } from '@nestjs/swagger';

export class NewOfferDto {
  @ApiProperty({
    type: String,
    description: 'User name',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'User E-mail',
  })
  email: string;

  @ApiProperty({
    type: String,
    description: 'Content',
  })
  content: string;
}
