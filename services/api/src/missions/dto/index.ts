import { IsString, IsNumber, IsEnum, IsOptional, IsArray, Min, Max } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateMissionDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ enum: ['QUICK_WIN', 'WEEKLY_CHALLENGE', 'MILESTONE', 'NINETY_DAY_GOAL'] })
  @IsEnum(['QUICK_WIN', 'WEEKLY_CHALLENGE', 'MILESTONE', 'NINETY_DAY_GOAL'])
  type: 'QUICK_WIN' | 'WEEKLY_CHALLENGE' | 'MILESTONE' | 'NINETY_DAY_GOAL';

  @ApiProperty({ enum: ['FINANCE', 'MARKETING', 'SALES', 'PRODUCT', 'OPERATIONS'] })
  @IsEnum(['FINANCE', 'MARKETING', 'SALES', 'PRODUCT', 'OPERATIONS'])
  department: 'FINANCE' | 'MARKETING' | 'SALES' | 'PRODUCT' | 'OPERATIONS';

  @ApiProperty()
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty()
  @IsNumber()
  @Min(10)
  @Max(500)
  xpReward: number;

  @ApiProperty({ enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], required: false })
  @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
  @IsOptional()
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  assignedToId?: string;

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  subtasks?: any[];
}

export class UpdateMissionDto extends PartialType(CreateMissionDto) {
  @ApiProperty({ enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], required: false })
  @IsEnum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  @IsOptional()
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}
