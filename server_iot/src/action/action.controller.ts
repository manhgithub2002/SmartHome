import { GetAllActionDataResponse } from './dtos/getActionDataResponse.dto';
import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiDefaultResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ActionService } from './action.service';
import { QueryActionDto } from './dtos/queryAction.dto';

@ApiTags('Action History')
@Controller('action')
export class ActionController {
  constructor(private readonly actionService: ActionService) { }
  // @Get('latest-action')
  // async getLatestAction() {
  //   return await this.actionService.getDeviceActionLatest();
  // }

  @Get()
  @ApiDefaultResponse({
    status: 200,
    description: 'Get data from DB successfully',
    type: GetAllActionDataResponse,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Get some error',
  })
  async getActionData(@Query() query: QueryActionDto) {
    return await this.actionService.getActionData(query);
  }
}
