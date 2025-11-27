import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUpdateProductCategoryDto {
  @ApiProperty({
    type: Object,
    description: 'Product category value, ex. { hy: "text" }',
  })
  title: Record<string, string>;

  @ApiProperty({
    type: String,
    description: 'Code',
  })
  code: string;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Is public',
  })
  is_public: boolean;
}
