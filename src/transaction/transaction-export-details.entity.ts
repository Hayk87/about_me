import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductsEntity } from '../products/products.entity';
import { ProductCategoriesEntity } from '../product-categories/product-categories.entity';
import { MeasurementsEntity } from '../measurement/measurements.entity';
import { TransactionExportEntity } from './transaction-export.entity';

@Entity('transaction-export-details')
export class TransactionExportDetailsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TransactionExportEntity, (tr) => tr.details, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'transaction_id' })
  transaction: TransactionExportEntity;

  @ManyToOne(() => ProductsEntity, (product) => product.transaction_exports)
  @JoinColumn({ name: 'product_id' })
  product: ProductsEntity;

  @ManyToOne(() => ProductCategoriesEntity, (cat) => cat.transaction_exports)
  @JoinColumn({ name: 'product_category_id' })
  product_category: ProductCategoriesEntity;

  @ManyToOne(() => MeasurementsEntity, (m) => m.transaction_exports)
  @JoinColumn({ name: 'measurement_id' })
  measurement: MeasurementsEntity;

  @Column({ type: 'float8' })
  buy_price: number;

  @Column({ type: 'float8' })
  price: number;

  @Column({ type: 'float8' })
  count: number;

  @Column({ type: 'float8' })
  amount: number;
}
