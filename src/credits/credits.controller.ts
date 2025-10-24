import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateCreditDto } from './dto/create-credit.dto';
import { UpdateCreditDto } from './dto/update-credit.dto';
import { Credit } from './credit.entity';
import { CreditsService } from './credits.service';

@Controller('credits')
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}

  @Post()
  async create(@Body() createCreditDto: CreateCreditDto): Promise<Credit> {
    return await this.creditsService.create(createCreditDto);
  }

  @Get()
  async findAll(): Promise<Credit[]> {
    return await this.creditsService.findAll();
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
