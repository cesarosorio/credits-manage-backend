import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Credit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  description?: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalLoan: number;

  @Column('decimal', { precision: 5, scale: 2 })
  annualInterestRate: number;

  @Column('decimal', { precision: 10, scale: 2 })
  lifeInsurance: number;

  @Column()
  expirationDate: Date;

  @Column()
  termMonths: number;

  @Column('decimal', { precision: 10, scale: 2 })
  paymentAmount: number;
}
