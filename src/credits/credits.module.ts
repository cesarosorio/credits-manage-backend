import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credit } from './credit.entity';
import { Payment } from '../payments/payment.entity';
import { CreditsController } from './credits.controller';
import { CreditsService } from './credits.service';

@Module({
  imports: [TypeOrmModule.forFeature([Credit, Payment])],
  providers: [CreditsService],
  controllers: [CreditsController],
})
export class CreditsModule {}
