import { IsString, IsNumber, IsEnum, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateTeamMemberDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  role: string;

  @ApiProperty({ enum: ['FINANCE', 'MARKETING', 'SALES', 'PRODUCT', 'OPERATIONS'] })
  @IsEnum(['FINANCE', 'MARKETING', 'SALES', 'PRODUCT', 'OPERATIONS'])
  department: 'FINANCE' | 'MARKETING' | 'SALES' | 'PRODUCT' | 'OPERATIONS';

  @ApiProperty()
  @IsNumber()
  @Min(0)
  monthlyCost: number;

  @ApiProperty()
  @IsString()
  kpiMetric: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  kpiTarget: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  currentKpi?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  performance?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  capacity?: number;
}

export class UpdateTeamMemberDto extends PartialType(CreateTeamMemberDto) {}
