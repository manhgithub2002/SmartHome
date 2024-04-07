import { ApiProperty } from '@nestjs/swagger';
import { Action } from '../action.entity';

export class GetAllActionDataResponse {
  @ApiProperty({ type: [Action] })
  data: Action[];

  @ApiProperty()
  totalData: number;
}
