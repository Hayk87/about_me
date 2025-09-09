import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { MeasurementsEntity } from '../measurement/measurements.entity';
import { ProductCategoriesEntity } from '../product-categories/product-categories.entity';
import { SystemUserEntity } from '../system-user/system-user.entity';
import { TransactionImportDetailsEntity } from '../transaction/transaction-import-details.entity';
import { TransactionExportDetailsEntity } from '../transaction/transaction-export-details.entity';

@Entity('products')
export class ProductsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb', nullable: false })
  title: object;

  @Column({ default: false })
  is_deleted?: boolean;

  @Column({ nullable: false, type: 'float8' })
  quantity: number;

  @Column({ nullable: false, type: 'float8' })
  buy_price: number;

  @Column({ nullable: false, type: 'float8' })
  sell_price: number;

  @ManyToOne(() => MeasurementsEntity, (m) => m.products)
  @JoinColumn({ name: 'measurement_id' })
  measurement: MeasurementsEntity;

  @ManyToOne(() => ProductCategoriesEntity, (m) => m.products)
  @JoinColumn({ name: 'category_id' })
  category: ProductCategoriesEntity;

  // @ManyToOne(() => SystemUserEntity, (m) => m.order_products)
  // @JoinColumn({ name: 'created_system_user_id' })
  // operator: SystemUserEntity;

  @Column({
    type: 'timestamptz',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToMany(() => TransactionImportDetailsEntity, (item) => item.product)
  transaction_imports: TransactionImportDetailsEntity[];

  @OneToMany(() => TransactionExportDetailsEntity, (item) => item.product)
  transaction_exports: TransactionExportDetailsEntity[];
}
