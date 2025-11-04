import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCreditDto {
  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  totalLoan?: number;

  @ApiPropertyOptional()
  annualInterestRate?: number;

  @ApiPropertyOptional()
  lifeInsurance?: number;

  @ApiPropertyOptional()
  expirationDate?: Date;

  @ApiPropertyOptional()
  termMonths?: number;

  @ApiPropertyOptional()
  showExpenses?: boolean;
}
