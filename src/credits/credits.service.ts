import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';
import { CreateCreditDto } from './dto/create-credit.dto';
import { UpdateCreditDto } from './dto/update-credit.dto';
import { Credit } from './credit.entity';
import { Payment } from '../payments/payment.entity';
import {
  calculateMonthlyRate,
  calculateFixedPayment,
} from '../lib/loan-calculator';

@Injectable()
export class CreditsService {
  constructor(
    @InjectRepository(Credit)
    private readonly creditsRepository: Repository<Credit>,
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
  ) {}

  async create(createCreditDto: CreateCreditDto): Promise<Credit> {
    const credit = new Credit();
    credit.description = createCreditDto.description;
    credit.totalLoan = createCreditDto.totalLoan;
    credit.annualInterestRate = createCreditDto.annualInterestRate;
    credit.lifeInsurance = createCreditDto.lifeInsurance;
    credit.expirationDate = createCreditDto.expirationDate;
    credit.termMonths = createCreditDto.termMonths;
    credit.showExpenses = createCreditDto.showExpenses ?? false;

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
    return (await this.creditsRepository.find()).sort(
      (a, b) => a.expirationDate.getTime() - b.expirationDate.getTime(),
    );
  }

  async findByExpensives(hasExpensives: boolean): Promise<Credit[]> {
    return this.creditsRepository.find({
      where: { showExpenses: hasExpensives },
      order: { expirationDate: 'ASC' },
    });
  }

  async findCreditsWithExpensives(): Promise<Credit[]> {
    return this.findByExpensives(true);
  }

  async findCreditsWithoutExpensives(): Promise<Credit[]> {
    return this.findByExpensives(false);
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

    console.log(`🔄 Updating credit ${id} with data:`, updateCreditDto);

    // Track if financial fields changed for recalculation
    let shouldRecalculate = false;

    // Update only provided fields
    if (updateCreditDto.description !== undefined) {
      credit.description = updateCreditDto.description;
    }
    if (updateCreditDto.totalLoan !== undefined) {
      credit.totalLoan = updateCreditDto.totalLoan;
      shouldRecalculate = true;
    }
    if (updateCreditDto.annualInterestRate !== undefined) {
      credit.annualInterestRate = updateCreditDto.annualInterestRate;
      shouldRecalculate = true;
    }
    if (updateCreditDto.lifeInsurance !== undefined) {
      credit.lifeInsurance = updateCreditDto.lifeInsurance;
      shouldRecalculate = true;
    }
    if (updateCreditDto.expirationDate !== undefined) {
      credit.expirationDate = updateCreditDto.expirationDate;
    }
    if (updateCreditDto.termMonths !== undefined) {
      credit.termMonths = updateCreditDto.termMonths;
      shouldRecalculate = true;
    }
    if (updateCreditDto.showExpenses !== undefined) {
      credit.showExpenses = updateCreditDto.showExpenses;
    }

    // Recalculate payment amount if any financial field changed
    if (shouldRecalculate) {
      console.log(`💰 Recalculating payment amount for credit ${id}`);
      console.log(
        `Values: loan=${credit.totalLoan}, rate=${credit.annualInterestRate}%, term=${credit.termMonths} months, insurance=${credit.lifeInsurance}`,
      );

      const monthlyRate = calculateMonthlyRate(credit.annualInterestRate);
      const basePayment = calculateFixedPayment(
        credit.totalLoan,
        monthlyRate,
        credit.termMonths,
      );
      const oldPaymentAmount = credit.paymentAmount;
      credit.paymentAmount = basePayment + credit.lifeInsurance;

      console.log(
        `📊 Payment amount updated: ${oldPaymentAmount} → ${credit.paymentAmount}`,
      );
    }

    const updatedCredit = await this.creditsRepository.save(credit);
    console.log(`✅ Credit ${id} updated successfully`);

    return updatedCredit;
  }

  async remove(id: string): Promise<void> {
    // First check if credit exists
    const credit = await this.creditsRepository.findOneBy({ id });
    if (!credit) {
      throw new NotFoundException(`Credit with ID ${id} not found`);
    }

    console.log(`🔄 Starting deletion process for credit: ${id}`);

    // Find all payments associated with this credit
    const payments = await this.paymentsRepository.find({
      where: { creditId: id },
    });

    console.log(
      `📋 Found ${payments.length} payments to delete for credit ${id}`,
    );

    // Delete payment images and database records
    for (const payment of payments) {
      // Delete image file if it exists
      const uploadsPath = join(process.cwd(), 'uploads/payments');
      const extensions = ['.jpg', '.jpeg', '.png', '.gif'];

      for (const ext of extensions) {
        const imagePath = join(uploadsPath, `${payment.id}${ext}`);
        if (existsSync(imagePath)) {
          try {
            unlinkSync(imagePath);
            console.log(`🗑️ Image deleted: ${imagePath}`);
            break; // Only one image per payment
          } catch (error) {
            console.error(`❌ Error deleting image ${imagePath}:`, error);
          }
        }
      }
    }

    // Delete all payments for this credit
    if (payments.length > 0) {
      await this.paymentsRepository.delete({ creditId: id });
      console.log(`✅ Deleted ${payments.length} payments for credit ${id}`);
    }

    // Finally, delete the credit
    await this.creditsRepository.delete(id);
    console.log(`✅ Credit ${id} successfully deleted`);
  }
}
