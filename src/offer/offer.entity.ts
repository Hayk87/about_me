import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { FilesEntity } from "../files/files.entity";

@Entity('offers')
export class OfferEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @ManyToMany(() => FilesEntity, (files) => files.offers,  {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinTable({
    name: 'offer_files',
    joinColumn: {
      name: 'offer_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'file_id',
      referencedColumnName: 'id',
    },
  })
  files: FilesEntity[];
}
