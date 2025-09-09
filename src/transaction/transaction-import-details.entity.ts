import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TransactionImportEntity } from './transaction-import.entity';
import { ProductsEntity } from '../products/products.entity';
import { ProductCategoriesEntity } from '../product-categories/product-categories.entity';
import { MeasurementsEntity } from '../measurement/measurements.entity';

@Entity('transaction-import-details')
export class TransactionImportDetailsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TransactionImportEntity, (tr) => tr.details, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'transaction_id' })
  transaction: TransactionImportEntity;

  @ManyToOne(() => ProductsEntity, (product) => product.transaction_imports)
  @JoinColumn({ name: 'product_id' })
  product: ProductsEntity;

  @ManyToOne(() => ProductCategoriesEntity, (cat) => cat.transaction_imports)
  @JoinColumn({ name: 'product_category_id' })
  product_category: ProductCategoriesEntity;

  @ManyToOne(() => MeasurementsEntity, (m) => m.transaction_imports)
  @JoinColumn({ name: 'measurement_id' })
  measurement: MeasurementsEntity;

  @Column({ type: 'float8' })
  price: number;

  @Column({ type: 'float8' })
  count: number;

  @Column({ type: 'float8' })
  amount: number;
}
