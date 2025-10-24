import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCreditDto } from './dto/create-credit.dto';
import { UpdateCreditDto } from './dto/update-credit.dto';
import { Credit } from './credit.entity';
import {
  calculateMonthlyRate,
  calculateFixedPayment,
} from '../lib/loan-calculator';

@Injectable()
export class CreditsService {
  constructor(
    @InjectRepository(Credit)
    private readonly creditsRepository: Repository<Credit>,
  ) {}

  async create(createCreditDto: CreateCreditDto): Promise<Credit> {
    const credit = new Credit();
    credit.description = createCreditDto.description;
    credit.totalLoan = createCreditDto.totalLoan;
    credit.annualInterestRate = createCreditDto.annualInterestRate;
    credit.lifeInsurance = createCreditDto.lifeInsurance;
    credit.expirationDate = createCreditDto.expirationDate;
    credit.termMonths = createCreditDto.termMonths;

    // Calculate the payment amount (minimum payment)
    const monthlyRate = calculateMonthlyRate(credit.annualInterestRate);
    const basePayment = calculateFixedPayment(
      credit.totalLoan,
      monthlyRate,
      credit.termMonths,
    );
    credit.paymentAmount = basePayment + credit.lifeInsurance;

    // Save the credit
    return await this.creditsRepository.save(credit);
  }

  async findAll(): Promise<Credit[]> {
    return this.creditsRepository.find();
  }

  async findOne(id: string): Promise<Credit> {
    const credit = await this.creditsRepository.findOneBy({ id });
    if (!credit) {
      throw new NotFoundException(`Credit with ID ${id} not found`);
    }
    return credit;
  }

  async update(id: string, updateCreditDto: UpdateCreditDto): Promise<Credit> {
    const credit = await this.findOne(id);

    // Update only provided fields
    if (updateCreditDto.description !== undefined) {
      credit.description = updateCreditDto.description;
    }
    if (updateCreditDto.totalLoan !== undefined) {
      credit.totalLoan = updateCreditDto.totalLoan;
    }
    if (updateCreditDto.annualInterestRate !== undefined) {
      credit.annualInterestRate = updateCreditDto.annualInterestRate;
    }
    if (updateCreditDto.lifeInsurance !== undefined) {
      credit.lifeInsurance = updateCreditDto.lifeInsurance;
    }
    if (updateCreditDto.expirationDate !== undefined) {
      credit.expirationDate = updateCreditDto.expirationDate;
    }
    if (updateCreditDto.termMonths !== undefined) {
      credit.termMonths = updateCreditDto.termMonths;
    }

    // Recalculate payment amount if financial fields changed
    if (
      updateCreditDto.totalLoan !== undefined ||
      updateCreditDto.annualInterestRate !== undefined ||
      updateCreditDto.lifeInsurance !== undefined ||
      updateCreditDto.termMonths !== undefined
    ) {
      const monthlyRate = calculateMonthlyRate(credit.annualInterestRate);
      const basePayment = calculateFixedPayment(
        credit.totalLoan,
        monthlyRate,
        credit.termMonths,
      );
      credit.paymentAmount = basePayment + credit.lifeInsurance;
    }

    return await this.creditsRepository.save(credit);
  }

  async remove(id: string): Promise<void> {
    await this.creditsRepository.delete(id);
  }
}
