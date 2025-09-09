import { ApiProperty } from '@nestjs/swagger';

export class CreateUpdateStaffDto {
  @ApiProperty({ type: Object, description: 'Title value, ex. { hy: "text" }' })
  title: Record<string, string>;

  @ApiProperty({ type: Number, description: 'rights IDs', isArray: true })
  rights: number[];
}
