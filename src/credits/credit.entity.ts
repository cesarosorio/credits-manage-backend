import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ default: false })
  showExpenses: boolean;

  @OneToMany('Payment', 'credit')
  payments: any[];

  @OneToMany('Expense', 'credit')
  expenses: any[];
}
