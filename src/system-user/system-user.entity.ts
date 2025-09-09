import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { StaffEntity } from '../staffs/staff.entity';
// import { ProductsEntity } from '../products/products.entity';
// import { TransactionImportEntity } from '../transaction/transaction-import.entity';
// import { TransactionExportEntity } from '../transaction/transaction-export.entity';

@Entity('system-user')
export class SystemUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  first_name: string;

  @Column({ length: 255, nullable: false })
  last_name: string;

  @Column({ length: 255, unique: true, nullable: false })
  email: string;

  @Column({ length: 500, nullable: false })
  password: string;

  @Column({ length: 64, nullable: false })
  secret: string;

  @Column({ default: false, nullable: false })
  is_root: boolean;

  @Column({ default: false, nullable: false })
  is_blocked: boolean;

  @Column({ default: false, nullable: false })
  is_deleted: boolean;

  @Column({ type: 'jsonb', nullable: true })
  authenticator: any;

  @Column({ default: false, nullable: false })
  authenticator_enabled: boolean;

  @Column({
    type: 'timestamptz',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    type: 'timestamptz',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @ManyToOne(() => StaffEntity, (staff) => staff.system_user)
  @JoinColumn({ name: 'staff_id' })
  staff: StaffEntity;

  // @OneToMany(() => ProductsEntity, (product) => product.operator)
  // order_products: ProductsEntity[];

  // @OneToMany(() => TransactionImportEntity, (item) => item.operator)
  // transaction_imports: TransactionImportEntity[];

  // @OneToMany(() => TransactionExportEntity, (item) => item.operator)
  // transaction_exports: TransactionExportEntity[];
}
