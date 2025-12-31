import { IsString, IsNumber, IsEnum, IsOptional, Min, IsDateString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateSaleDto {
  @ApiProperty()
  @IsString()
  clientName: string;

  @ApiProperty()
  @IsString()
  offerId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty()
  @IsString()
  soldById: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({ enum: ['PENDING', 'CLOSED', 'LOST'], required: false })
  @IsEnum(['PENDING', 'CLOSED', 'LOST'])
  @IsOptional()
  status?: 'PENDING' | 'CLOSED' | 'LOST';
}

export class UpdateSaleDto extends PartialType(CreateSaleDto) {}
