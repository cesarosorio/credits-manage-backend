import { Credit } from 'src/credits/credit.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  paymentDate: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  amountPaid: number;

  @Column({ nullable: true })
  comment?: string;

  @Column()
  creditId: string;

  @ManyToOne('Credit', 'payments')
  credit: Credit;
}
