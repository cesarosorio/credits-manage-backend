import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaymentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  paymentDate: Date;

  @ApiProperty()
  amountPaid: number;

  @ApiPropertyOptional()
  comment?: string;

  @ApiProperty()
  creditId: string;
}
