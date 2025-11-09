import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty({ type: String, description: 'Code value' })
  code: string;

  @ApiPropertyOptional({ type: String, description: 'Link value' })
  link?: string;

  @ApiProperty({ type: Object, description: 'Title value, ex. { hy: "text" }' })
  title: Record<string, string>;

  @ApiPropertyOptional({ type: Object, description: 'Short content value, ex. { hy: "text" }' })
  short_content: Record<string, string>;

  @ApiProperty({ type: Object, description: 'Content value, ex. { hy: "text" }' })
  content: Record<string, string>;

  @ApiProperty({ type: Number, description: 'Category ID' })
  category_id: number;

  @ApiProperty({ type: Boolean, description: 'If true it will be visible on website' })
  is_public: boolean;

  @ApiProperty({ type: Number, description: 'Ordering applications by asc on website' })
  order: number;

  @ApiProperty({ type: Number, description: 'Price, float type' })
  price: number;

  @ApiProperty({ type: Object, description: 'removedFiles, ex. ["fileId"]' })
  removedFiles: string[]
}
