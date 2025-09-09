import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { SystemUserEntity } from '../system-user/system-user.entity';
import { TransactionImportDetailsEntity } from './transaction-import-details.entity';

@Entity('transaction-imports')
export class TransactionImportEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => SystemUserEntity, (user) => user.transaction_imports)
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

  @OneToMany(() => TransactionImportDetailsEntity, (tr) => tr.transaction)
  details: TransactionImportDetailsEntity[];
}
