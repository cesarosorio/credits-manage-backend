import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePaymentDto {
  @ApiPropertyOptional()
  paymentDate?: Date;

  @ApiPropertyOptional()
  amountPaid?: number;

  @ApiPropertyOptional()
  comment?: string;

  @ApiPropertyOptional()
  creditId?: string;
}
