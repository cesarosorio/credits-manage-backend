import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './expense.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expensesRepository: Repository<Expense>,
  ) {}

  async create(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    const expense = new Expense();
    expense.value = createExpenseDto.value;
    expense.date = createExpenseDto.date;
    expense.description = createExpenseDto.description;
    expense.creditId = createExpenseDto.creditId;

    // Save the expense
    return await this.expensesRepository.save(expense);
  }

  async findAll(): Promise<Expense[]> {
    return this.expensesRepository.find({
      order: { date: 'DESC' },
    });
  }

  async findByCreditId(creditId: string): Promise<Expense[]> {
    return this.expensesRepository.find({
      where: { creditId: creditId },
      relations: ['credit'],
      order: { date: 'DESC' },
    });
  }

  findOne(id: string): Promise<Expense> {
    return this.expensesRepository.findOneBy({ id });
  }

  async update(
    id: string,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    const expense = await this.expensesRepository.findOneBy({ id });
    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    // Update only provided fields
    if (updateExpenseDto.value !== undefined) {
      expense.value = updateExpenseDto.value;
    }
    if (updateExpenseDto.date !== undefined) {
      expense.date = updateExpenseDto.date;
    }
    if (updateExpenseDto.description !== undefined) {
      expense.description = updateExpenseDto.description;
    }
    if (updateExpenseDto.creditId !== undefined) {
      expense.creditId = updateExpenseDto.creditId;
    }

    return this.expensesRepository.save(expense);
  }

  async remove(id: string): Promise<void> {
    // First check if expense exists
    const expense = await this.expensesRepository.findOneBy({ id });
    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    // Delete the expense from database
    await this.expensesRepository.delete(id);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Expense[]> {
    return this.expensesRepository
      .createQueryBuilder('expense')
      .where('expense.date >= :startDate', { startDate })
      .andWhere('expense.date <= :endDate', { endDate })
      .orderBy('expense.date', 'DESC')
      .getMany();
  }

  async getTotalExpenses(): Promise<number> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.expensesRepository
      .createQueryBuilder('expense')
      .select('SUM(expense.value)', 'total')
      .getRawOne();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return Number(result?.total) || 0;
  }

  async getTotalExpensesByMonth(year: number, month: number): Promise<number> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.expensesRepository
      .createQueryBuilder('expense')
      .select('SUM(expense.value)', 'total')
      .where('expense.date >= :startDate', { startDate })
      .andWhere('expense.date <= :endDate', { endDate })
      .getRawOne();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return Number(result?.total) || 0;
  }

  async getTotalExpensesByCredit(creditId: string): Promise<number> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.expensesRepository
      .createQueryBuilder('expense')
      .select('SUM(expense.value)', 'total')
      .where('expense.creditId = :creditId', { creditId })
      .getRawOne();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return Number(result?.total) || 0;
  }
}
