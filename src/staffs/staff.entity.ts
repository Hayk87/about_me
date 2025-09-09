import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { RightsEntity } from '../rights/rights.entity';
import { SystemUserEntity } from '../system-user/system-user.entity';

@Entity('staffs')
export class StaffEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb', nullable: false })
  title: object;

  @ManyToMany(() => RightsEntity, (rights) => rights.staffs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'staffs_rights',
    joinColumn: {
      name: 'staff_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'right_id',
      referencedColumnName: 'id',
    },
  })
  rights: RightsEntity[];

  @OneToMany(() => SystemUserEntity, (user) => user.staff)
  system_user: SystemUserEntity[];
}
