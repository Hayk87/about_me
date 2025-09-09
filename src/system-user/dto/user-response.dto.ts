import { ApiProperty } from '@nestjs/swagger';
import { Timestamp } from 'typeorm';

export class UserResponseDto {
  @ApiProperty({ type: Number, description: 'Root user ID' })
  id: number;

  @ApiProperty({ type: String, description: 'Root user E-mail' })
  email: string;

  @ApiProperty({ type: String, description: 'Root user first name' })
  first_name: string;

  @ApiProperty({ type: String, description: 'Root user last name' })
  last_name: string;

  @ApiProperty({ type: Boolean, description: 'If true user is ROOT user' })
  is_root: boolean;

  @ApiProperty({ type: Boolean, description: 'If true user is blocked' })
  is_blocked: boolean;

  @ApiProperty({ type: Boolean, description: 'If true user is deleted' })
  is_deleted: boolean;

  @ApiProperty({ type: Timestamp, description: 'User creation date' })
  created_at: Date;

  @ApiProperty({ type: Timestamp, description: 'User last updated date' })
  updated_at: Date;
}
