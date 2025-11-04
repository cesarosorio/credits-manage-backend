import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateExpenseDto {
  @ApiPropertyOptional()
  value?: number;

  @ApiPropertyOptional()
  date?: Date;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  creditId?: string;
}
