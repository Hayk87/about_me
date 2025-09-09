import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProductsEntity } from '../products/products.entity';
import { TransactionImportDetailsEntity } from '../transaction/transaction-import-details.entity';
import { TransactionExportDetailsEntity } from '../transaction/transaction-export-details.entity';

@Entity('measurements')
export class MeasurementsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb', nullable: false })
  title: object;

  @Column({ default: false })
  is_deleted?: boolean;

  @OneToMany(() => ProductsEntity, (product) => product.measurement)
  products: ProductsEntity[];

  @OneToMany(() => TransactionImportDetailsEntity, (item) => item.product)
  transaction_imports: TransactionImportDetailsEntity[];

  @OneToMany(() => TransactionExportDetailsEntity, (item) => item.product)
  transaction_exports: TransactionExportDetailsEntity[];
}
