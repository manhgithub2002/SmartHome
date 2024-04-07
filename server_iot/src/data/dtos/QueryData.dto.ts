import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { Category } from '../data.service';
import { IsInt, IsPositive, MaxLength } from 'class-validator';

export class QueryDataDto {
  @ApiProperty({ name: 'category', enum: Category, required: false })
  category: string;

  @ApiProperty()
  @MaxLength(30)
  @IsInt()
  @IsPositive()
  search: string;

  @ApiProperty({ default: 10 })
  pageSize: number;

  @ApiProperty({ default: 1 })
  pageNumber: number;

  @ApiProperty({ default: '2024-03-15', required: false })
  startDate: string;

  @ApiProperty({ default: '2024-03-16', required: false })
  endDate: string;

  @ApiProperty({
    description: "example: '-time' | '+temperature'",
    default: '+id',
    required: false,
  })
  sort?: string;
}
