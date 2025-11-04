import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './expense.entity';
import { ExpensesService } from './expenses.service';

@ApiTags('Expenses')
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiResponse({
    status: 201,
    description: 'The expense has been successfully created.',
    type: Expense,
  })
  async create(@Body() createExpenseDto: CreateExpenseDto): Promise<Expense> {
    return await this.expensesService.create(createExpenseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all expenses' })
  @ApiResponse({
    status: 200,
    description: 'Return all expenses.',
    type: [Expense],
  })
  async findAll(): Promise<Expense[]> {
    return await this.expensesService.findAll();
  }

  @Get('credit/:creditId')
  @ApiOperation({ summary: 'Get expenses by credit ID' })
  @ApiResponse({
    status: 200,
    description: 'Return all expenses for the specified credit.',
    type: [Expense],
  })
  async findByCreditId(
    @Param('creditId') creditId: string,
  ): Promise<Expense[]> {
    return await this.expensesService.findByCreditId(creditId);
  }

  @Get('total')
  @ApiOperation({ summary: 'Get total amount of all expenses' })
  @ApiResponse({
    status: 200,
    description: 'Return total amount of all expenses.',
    type: Number,
  })
  async getTotalExpenses(): Promise<{ total: number }> {
    const total = await this.expensesService.getTotalExpenses();
    return { total };
  }

  @Get('total/month')
  @ApiOperation({ summary: 'Get total expenses for a specific month' })
  @ApiQuery({ name: 'year', type: Number })
  @ApiQuery({ name: 'month', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Return total expenses for the specified month.',
    type: Number,
  })
  async getTotalExpensesByMonth(
    @Query('year') year: string,
    @Query('month') month: string,
  ): Promise<{ total: number; year: number; month: number }> {
    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10);
    const total = await this.expensesService.getTotalExpensesByMonth(
      yearNum,
      monthNum,
    );
    return { total, year: yearNum, month: monthNum };
  }

  @Get('total/credit/:creditId')
  @ApiOperation({ summary: 'Get total expenses for a specific credit' })
  @ApiResponse({
    status: 200,
    description: 'Return total expenses for the specified credit.',
    type: Number,
  })
  async getTotalExpensesByCredit(
    @Param('creditId') creditId: string,
  ): Promise<{ total: number; creditId: string }> {
    const total = await this.expensesService.getTotalExpensesByCredit(creditId);
    return { total, creditId };
  }

  @Get('date-range')
  @ApiOperation({ summary: 'Get expenses within a date range' })
  @ApiQuery({ name: 'startDate', type: String })
  @ApiQuery({ name: 'endDate', type: String })
  @ApiResponse({
    status: 200,
    description: 'Return expenses within the specified date range.',
    type: [Expense],
  })
  async findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<Expense[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return await this.expensesService.findByDateRange(start, end);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an expense by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the expense with the specified id.',
    type: Expense,
  })
  async findOne(@Param('id') id: string): Promise<Expense> {
    return await this.expensesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an expense' })
  @ApiResponse({
    status: 200,
    description: 'The expense has been successfully updated.',
    type: Expense,
  })
  async update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    return await this.expensesService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an expense' })
  @ApiResponse({
    status: 200,
    description: 'The expense has been successfully deleted.',
  })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.expensesService.remove(id);
    return { message: 'Expense deleted successfully' };
  }
}
