import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProductsEntity } from '../products/products.entity';

@Entity('product-categories')
export class ProductCategoriesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb', nullable: false })
  title: object;

  @Column({ type: 'varchar', nullable: false, length: 255 })
  code: string;

  @Column({ default: false })
  is_public?: boolean;

  @Column({ default: false })
  is_deleted?: boolean;

  @OneToMany(() => ProductsEntity, (product) => product.category)
  products: ProductsEntity[];
}
