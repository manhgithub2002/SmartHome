import { ApiProperty } from '@nestjs/swagger';
import { Data } from '../data.entity';

export class GetAllDataResponse {
  @ApiProperty({ type: [Data] })
  data: Data[];

  @ApiProperty()
  totalData: number;
}
