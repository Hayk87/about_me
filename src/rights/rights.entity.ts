import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { StaffEntity } from '../staffs/staff.entity';

@Entity('rights')
export class RightsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150, unique: true, nullable: false })
  code: string;

  @Column({ type: 'jsonb', nullable: false })
  title: object;

  @ManyToMany(() => StaffEntity, (staffs) => staffs.rights)
  staffs: StaffEntity[];
}
