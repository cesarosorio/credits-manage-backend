import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty()
  paymentDate: Date;

  @ApiProperty()
  amountPaid: number;

  @ApiPropertyOptional()
  comment?: string;

  @ApiProperty()
  creditId: string;
}
