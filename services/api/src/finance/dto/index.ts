import { IsString, IsNumber, IsBoolean, IsOptional, IsEnum, Min } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateOfferDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  deliveryCost: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isMain?: boolean;

  @ApiProperty({ enum: ['ACTIVE', 'INACTIVE', 'ARCHIVED'], required: false })
  @IsEnum(['ACTIVE', 'INACTIVE', 'ARCHIVED'])
  @IsOptional()
  status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
}

export class UpdateOfferDto extends PartialType(CreateOfferDto) {}
