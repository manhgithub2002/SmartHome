import { Controller, Get, Inject, Query } from '@nestjs/common';
import { Category, DataService } from './data.service';
import { QueryDataDto } from './dtos/QueryData.dto';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GetAllDataResponse } from './dtos/getDataResponse.dto';

@ApiTags('Data Sensor')
@Controller('dataSensor')
export class DataController {
  constructor(private readonly dataService: DataService) { }

  @Get()
  @ApiAcceptedResponse({
    status: 200,
    description: 'Get data from DB successfully',
    type: GetAllDataResponse,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Get some error',
  })
  async GetDataSensor(@Query() query: QueryDataDto) {
    const data = await this.dataService.getDataSensor(query);
    return data;
  }

  @Get()
  @ApiAcceptedResponse({
    status: 200,
    description: 'Get data from DB successfully',
    type: GetAllDataResponse,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Get some error',
  })
  async GetSearchDataSensor(@Query() query: QueryDataDto) {
    const data = await this.dataService.getDataSensor(query);
    return data;
  }
}
