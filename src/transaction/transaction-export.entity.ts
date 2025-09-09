import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { SystemUserEntity } from '../system-user/system-user.entity';
import { TransactionExportDetailsEntity } from './transaction-export-details.entity';

@Entity('transaction-exports')
export class TransactionExportEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => SystemUserEntity, (user) => user.transaction_exports)
  // @JoinColumn({ name: 'operator_id' })
  // operator: SystemUserEntity;

  @Column({
    type: 'timestamptz',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created?: Date;

  @Column({ type: 'float8', nullable: false })
  amount: number;

  @OneToMany(() => TransactionExportDetailsEntity, (tr) => tr.transaction)
  details: TransactionExportDetailsEntity[];
}
