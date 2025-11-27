import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToOne,
  JoinTable
} from "typeorm";
import { ProductCategoriesEntity } from '../product-categories/product-categories.entity';
import { SystemUserEntity } from '../system-user/system-user.entity';
import { FilesEntity } from "../files/files.entity";

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

  @Column({ type: 'jsonb', nullable: true })
  short_content: object;

  @Column({ type: 'jsonb', nullable: true })
  content: object;

  @Column({ default: false })
  is_public?: boolean;

  @Column({ type: 'int4', default: 0 })
  order?: number;

  @Column({ default: false })
  is_deleted?: boolean;

  @Column({ nullable: true, type: 'int4' })
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

  @OneToOne(() => FilesEntity)
  @JoinColumn({ name: 'main_photo_id' })
  mainPhoto: FilesEntity

  @ManyToMany(() => FilesEntity, (files) => files.products,  {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinTable({
    name: 'product_files',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'file_id',
      referencedColumnName: 'id',
    },
  })
  files: FilesEntity[];
}
