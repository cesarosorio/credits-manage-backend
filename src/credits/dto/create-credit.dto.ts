import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCreditDto {
  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  totalLoan: number;

  @ApiProperty()
  annualInterestRate: number;

  @ApiProperty()
  lifeInsurance: number;

  @ApiProperty()
  expirationDate: Date;

  @ApiProperty()
  termMonths: number;

  @ApiPropertyOptional({ default: false })
  showExpenses?: boolean;
}
