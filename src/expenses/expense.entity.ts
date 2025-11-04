import { Credit } from 'src/credits/credit.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  value: number;

  @Column()
  date: Date;

  @Column()
  description: string;

  @Column()
  creditId: string;

  @ManyToOne('Credit', 'expenses')
  credit: Credit;
}
