import { query } from 'express';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Action } from './action.entity';
import { DeviceResponse } from './dtos/deviceResponse.dto';
import { FindOneOptions, Repository } from 'typeorm';
import { QueryActionDto } from './dtos/queryAction.dto';

export enum DeviceCategory {
  Fan = 'Fan',
  Led = 'Led',
}
@Injectable()
export class ActionService {
  constructor(
    @InjectRepository(Action)
    private readonly actionRepository: Repository<Action>,
  ) { }

  async storeAction(message: string) {
    const deviceResponse = JSON.parse(message) as DeviceResponse;

    const action = new Action();
    action.name = deviceResponse.fan ? 'fan' : 'led';
    action.action = deviceResponse.fan
      ? deviceResponse.fan
      : deviceResponse.led;

    try {
      this.actionRepository.save(action);
    } catch (error) {
      console.log(error);
    }
  }

  async getDeviceActionLatest() {
    try {
      const fanState = await this.actionRepository.findOne({
        where: { name: 'fan' },
        order: { createdAt: 'DESC' },
      } as FindOneOptions);
      const ledState = await this.actionRepository.findOne({
        where: { name: 'led' },
        order: { createdAt: 'DESC' },
      } as FindOneOptions);

      const data = { fanState, ledState };
      return data;
    } catch (error) {
      console.log(error);

      throw new BadRequestException('Get Some error');
    }
  }

  async getActionData(query: QueryActionDto) {
    const queryBuilder = this.actionRepository.createQueryBuilder('action');

    const offset = query.pageSize * (query.pageNumber - 1);

    if (query.startDate && query.endDate) {
      const startOfDay = new Date(query.startDate);
      startOfDay.setHours(0, 0, 0, 0);
      console.log(startOfDay.toString());

      const endOfDay = new Date(query.endDate);
      endOfDay.setHours(23, 59, 59, 999);
      console.log(endOfDay.toString());
      queryBuilder.where(
        'action.created_at >= :startDate AND action.created_at <= :endDate',
        {
          startDate: startOfDay,
          endDate: endOfDay,
        },
      );
    }

    if (query.sort) {
      const sortOrder = query.sort.startsWith('-') ? 'DESC' : 'ASC';
      const sortBy = query.sort.replace(/^-/, '');
      queryBuilder.orderBy(`action.${sortBy}`, sortOrder);
    }

    if (query.category !== '') {
      queryBuilder.andWhere('action.name = :name', {
        name: query.category === 'fan' ? 'fan' : 'led',
      });
    }

    const toltalData = await queryBuilder.getCount();

    queryBuilder.offset(offset).limit(query.pageSize);

    queryBuilder.cache(60000);

    try {
      const data = await queryBuilder.getMany();

      return {
        data: data.map((item) => ({
          ...item,
          createdAt: this.convertToLocalTime(item.createdAt),
        })),
        totalData: toltalData,
      };
    } catch (error) {
      throw new BadGatewayException('Get some error');
    }
  }

  convertToLocalTime(time: Date): Date {
    const serverTimezoneOffset = new Date().getTimezoneOffset() * 60000; // Đổi sang milliseconds
    const localTime = new Date(time.getTime() - serverTimezoneOffset);
    return localTime;
  }
}
