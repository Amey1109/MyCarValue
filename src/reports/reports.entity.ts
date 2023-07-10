import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  price: number;
}
