import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('translates')
export class TranslatesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true, nullable: false })
  key: string;

  @Column({ type: 'jsonb', nullable: false })
  value: object;
}
