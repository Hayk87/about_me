import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { OfferEntity } from "../offer/offer.entity";
import { ProductsEntity } from "../products/products.entity";

@Entity('files')
export class FilesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, nullable: false })
  name: string;

  @Column({ length: 255, nullable: false })
  type: string;

  @Column({ length: 2000, nullable: true })
  directory: string;

  @Column({ nullable: true })
  size: number;

  @ManyToMany(() => OfferEntity, (offers) => offers.files, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  offers: OfferEntity[];

  @ManyToMany(() => ProductsEntity, (products) => products.files, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  products: ProductsEntity[];
}
