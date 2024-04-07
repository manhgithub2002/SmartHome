import { ApiProperty } from '@nestjs/swagger';
import { DeviceCategory } from '../action.service';

export class QueryActionDto {
  @ApiProperty({ name: 'category', enum: DeviceCategory, required: false })
  category: string;

  @ApiProperty({ default: 10 })
  pageSize: number;

  @ApiProperty({ default: 1 })
  pageNumber: number;

  @ApiProperty({ default: '2024-03-15', required: false })
  startDate: string;

  @ApiProperty({ default: '2024-03-18', required: false })
  endDate: string;

  @ApiProperty({
    description: "example: '-time' | '+temperature'",
    default: '+id',
    required: false,
  })
  sort?: string;
}
