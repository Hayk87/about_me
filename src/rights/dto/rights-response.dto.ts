import { ApiProperty } from '@nestjs/swagger';

class RightTitle {
  LANG_CODE: string;
}

export class RightsResponseDto {
  @ApiProperty({ type: String, description: 'Right code' })
  code: string;

  @ApiProperty({ type: RightTitle, description: 'Right title, object' })
  title: {
    LANG_CODE: string;
  };
}
