import { ApiProperty } from '@nestjs/swagger';

export class CreateUpdateProductCategoryDto {
  @ApiProperty({
    type: Object,
    description: 'Measurement value, ex. { hy: "text" }',
  })
  title: Record<string, string>;
}
