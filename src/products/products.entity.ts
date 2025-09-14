import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductCategoriesEntity } from '../product-categories/product-categories.entity';
import { SystemUserEntity } from '../system-user/system-user.entity';

@Entity('products')
export class ProductsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, length: 255, unique: true })
  code: string;

  @Column({ type: 'varchar', nullable: true })
  link?: string;

  @Column({ type: 'jsonb', nullable: false })
  title: object;

  @Column({ type: 'jsonb', nullable: false })
  content: object;

  @Column({ default: false })
  is_deleted?: boolean;

  @Column({ nullable: false, type: 'int4' })
  price: number;

  @ManyToOne(() => ProductCategoriesEntity, (m) => m.products)
  @JoinColumn({ name: 'category_id' })
  category: ProductCategoriesEntity;

  @ManyToOne(() => SystemUserEntity, (m) => m.products)
  @JoinColumn({ name: 'created_system_user_id' })
  operator: SystemUserEntity;

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
}
