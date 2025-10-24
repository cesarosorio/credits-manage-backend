import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { diskStorage } from 'multer';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './payment.entity';
import { PaymentsService } from './payments.service';
import {
  imageFileFilter,
  paymentImageFileName,
  destination,
} from '../common/utils/file-upload.utils';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return await this.paymentsService.create(createPaymentDto);
  }

  @Get()
  async findAll(): Promise<Payment[]> {
    return await this.paymentsService.findAll();
  }

  @Get('credit/:creditId')
  async findByCreditId(
    @Param('creditId') creditId: string,
  ): Promise<Payment[]> {
    return await this.paymentsService.findByCreditId(creditId);
  }

  @Get(':id/image')
  async getPaymentImage(@Param('id') paymentId: string, @Res() res: Response) {
    return await this.paymentsService.getPaymentImage(paymentId, res);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Payment> {
    return await this.paymentsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    return await this.paymentsService.update(id, updatePaymentDto);
  }

  @Post(':id/upload-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: destination,
        filename: paymentImageFileName,
      }),
      fileFilter: imageFileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit per file
      },
    }),
  )
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Payment> {
    return await this.paymentsService.addImage(id, file);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    console.log(`DELETE request received for payment ID: ${id}`);
    return await this.paymentsService.remove(id);
  }
}
