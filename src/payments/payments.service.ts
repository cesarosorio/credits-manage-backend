import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { Payment } from './payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
  ) {}

  create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = new Payment();
    payment.paymentDate = createPaymentDto.paymentDate;
    payment.amountPaid = createPaymentDto.amountPaid;
    payment.comment = createPaymentDto.comment;
    payment.creditId = createPaymentDto.creditId;

    return this.paymentsRepository.save(payment);
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentsRepository.find();
  }

  async findByCreditId(creditId: string): Promise<Payment[]> {
    return this.paymentsRepository.find({
      where: { creditId: creditId },
      relations: ['credit'],
    });
  }

  findOne(id: string): Promise<Payment> {
    return this.paymentsRepository.findOneBy({ id: id });
  }

  async update(
    id: string,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    const payment = await this.paymentsRepository.findOneBy({ id });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    // Update only provided fields
    if (updatePaymentDto.paymentDate !== undefined) {
      payment.paymentDate = updatePaymentDto.paymentDate;
    }
    if (updatePaymentDto.amountPaid !== undefined) {
      payment.amountPaid = updatePaymentDto.amountPaid;
    }
    if (updatePaymentDto.comment !== undefined) {
      payment.comment = updatePaymentDto.comment;
    }
    if (updatePaymentDto.creditId !== undefined) {
      payment.creditId = updatePaymentDto.creditId;
    }

    return this.paymentsRepository.save(payment);
  }

  async remove(id: string): Promise<void> {
    // First check if payment exists
    const payment = await this.paymentsRepository.findOneBy({ id });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    // Delete the image file if it exists
    const uploadsPath = join(process.cwd(), 'uploads/payments');
    const extensions = ['.jpg', '.jpeg', '.png', '.gif'];

    for (const ext of extensions) {
      const imagePath = join(uploadsPath, `${id}${ext}`);
      if (existsSync(imagePath)) {
        try {
          unlinkSync(imagePath);
          console.log(`Image deleted: ${imagePath}`);
          break; // Only one image per payment, so break after finding and deleting
        } catch (error) {
          console.error(`Error deleting image ${imagePath}:`, error);
          // Continue with database deletion even if image deletion fails
        }
      }
    }

    // Delete the payment from database
    await this.paymentsRepository.delete(id);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async addImage(id: string, _file: Express.Multer.File): Promise<Payment> {
    const payment = await this.paymentsRepository.findOneBy({ id });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    // The file is already saved with the payment ID as filename by multer
    // We just verify the payment exists and return it
    return payment;
  }

  async getPaymentImage(paymentId: string, res: Response) {
    // Check if payment exists
    const payment = await this.paymentsRepository.findOneBy({ id: paymentId });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${paymentId} not found`);
    }

    // Look for image files with the payment ID and different extensions
    const uploadsPath = join(process.cwd(), 'uploads/payments');
    const extensions = ['.jpg', '.jpeg', '.png', '.gif'];

    for (const ext of extensions) {
      const imagePath = join(uploadsPath, `${paymentId}${ext}`);
      if (existsSync(imagePath)) {
        return res.sendFile(imagePath);
      }
    }

    // If no image found, return 404
    throw new NotFoundException(`No image found for payment ${paymentId}`);
  }

  transformToResponseDto(payment: Payment): PaymentResponseDto {
    return {
      id: payment.id,
      paymentDate: payment.paymentDate,
      amountPaid: payment.amountPaid,
      comment: payment.comment,
      creditId: payment.creditId,
    };
  }
}
