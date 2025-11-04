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
import { CreateCreditDto } from './dto/create-credit.dto';
import { UpdateCreditDto } from './dto/update-credit.dto';
import { Credit } from './credit.entity';
import { CreditsService } from './credits.service';

@ApiTags('credits')
@Controller('credits')
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}

  @Post()
  async create(@Body() createCreditDto: CreateCreditDto): Promise<Credit> {
    return await this.creditsService.create(createCreditDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all credits' })
  @ApiQuery({
    name: 'showExpenses',
    required: false,
    type: Boolean,
    description: 'Filter credits by showExpenses field',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all credits or filtered by showExpenses.',
    type: [Credit],
  })
  async findAll(
    @Query('showExpenses') showExpenses?: string,
  ): Promise<Credit[]> {
    if (showExpenses !== undefined) {
      const showExpensesBool = showExpenses === 'true';
      return await this.creditsService.findByExpensives(showExpensesBool);
    }
    return await this.creditsService.findAll();
  }

  @Get('with-expenses-enabled')
  @ApiOperation({ summary: 'Get credits that have expenses module enabled' })
  @ApiResponse({
    status: 200,
    description: 'Return credits with showExpenses = true.',
    type: [Credit],
  })
  async findCreditsWithExpensives(): Promise<Credit[]> {
    return await this.creditsService.findCreditsWithExpensives();
  }

  @Get('without-expenses-enabled')
  @ApiOperation({ summary: 'Get credits that have expenses module disabled' })
  @ApiResponse({
    status: 200,
    description: 'Return credits with showExpenses = false.',
    type: [Credit],
  })
  async findCreditsWithoutExpensives(): Promise<Credit[]> {
    return await this.creditsService.findCreditsWithoutExpensives();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Credit> {
    return await this.creditsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCreditDto: UpdateCreditDto,
  ): Promise<Credit> {
    return this.creditsService.update(id, updateCreditDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.creditsService.remove(id);
  }
}
