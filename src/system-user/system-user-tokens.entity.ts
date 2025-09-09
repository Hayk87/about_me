import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SystemUserEntity } from './system-user.entity';

@Entity('system-user-tokens')
export class SystemUserTokensEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  token: string;

  @Column({
    type: 'timestamptz',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  login_at: Date;

  @Column({ type: 'timestamptz', nullable: false })
  expiration: Date;

  @Column({ type: 'timestamptz', nullable: true })
  logout_at: Date;

  @ManyToOne(() => SystemUserEntity, (user) => user.id)
  @JoinColumn({ name: 'system_user' })
  system_user: SystemUserEntity;
}
