import { IsString, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateChannelDto {
  @ApiProperty()
  @IsString()
  source: string;

  @ApiProperty({ enum: ['AWARENESS', 'CONSIDERATION', 'CONVERSION', 'RETENTION'] })
  @IsEnum(['AWARENESS', 'CONSIDERATION', 'CONVERSION', 'RETENTION'])
  funnelStage: 'AWARENESS' | 'CONSIDERATION' | 'CONVERSION' | 'RETENTION';

  @ApiProperty()
  @IsNumber()
  @Min(0)
  visitors: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  leads: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  monthlySpend: number;

  @ApiProperty({ enum: ['ACTIVE', 'PAUSED', 'TESTING'], required: false })
  @IsEnum(['ACTIVE', 'PAUSED', 'TESTING'])
  @IsOptional()
  status?: 'ACTIVE' | 'PAUSED' | 'TESTING';
}

export class UpdateChannelDto extends PartialType(CreateChannelDto) {}
