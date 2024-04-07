import { query } from 'express';
import {
  BadGatewayException,
  Inject,
  Injectable,
  Search,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Data } from './data.entity';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QueryDataDto } from './dtos/QueryData.dto';

export enum Category {
  All = '',
  Temp = 'temperature',
  Humidity = 'humidity',
  Light = 'light',
}

@Injectable()
export class DataService {
  constructor(
    @InjectRepository(Data) private dataRepository: Repository<Data>,
    @InjectQueue('sensor-data') private storeDataQueue: Queue,
  ) { }

  async storeDataInCache(data) {
    await this.storeDataQueue.add('insert', data);

    // console.log(data);
  }

  async insertDataToDB(data: Data[], numOfData: number) {
    try {
      await this.dataRepository.save(data);
      console.log('store saved successfully: ' + numOfData + 'records');
    } catch (error) {
      console.log(error);
    }
  }

  async getDataFromRedis() {
    const completedJobs = await this.storeDataQueue.getCompleted();
    const resultData = completedJobs.map((job) => job.returnvalue);

    return resultData;
  }

  async getDataSensor(query: QueryDataDto) {
    const queryBuilder = this.dataRepository.createQueryBuilder('data');

    const offset = query.pageSize * (query.pageNumber - 1);

    if (query.startDate && query.endDate) {
      const startOfDay = new Date(query.startDate);
      startOfDay.setHours(0, 0, 0, 0);
      console.log(startOfDay.toString());

      const endOfDay = new Date(query.endDate);
      endOfDay.setHours(23, 59, 59, 999);
      console.log(endOfDay.toString());
      queryBuilder.where(
        'data.created_at >= :startDate AND data.created_at <= :endDate',
        {
          startDate: startOfDay,
          endDate: endOfDay,
        },
      );
    }

    if (query.search) {
      if (query.category === 'all') {
        queryBuilder.andWhere(
          '(data.temp = :search OR data.hum = :search OR data.light = :search)',
          {
            search: query.search,
          },
        );
      }
      if (query.category === 'temp') {
        queryBuilder.andWhere('(data.temp = :search)', {
          search: query.search,
        });
      }
      if (query.category === 'hum') {
        queryBuilder.andWhere('(data.hum = :search)', {
          search: query.search,
        });
      }
      if (query.category === 'light') {
        queryBuilder.andWhere('data.light = :search', { search: query.search });
      }
    }

    const toltalData = await queryBuilder.getCount();

    if (query.sort) {
      const sortOrder = query.sort.startsWith('-') ? 'DESC' : 'ASC';
      const sortBy = query.sort.replace(/^-/, '');
      queryBuilder.orderBy(`data.${sortBy}`, sortOrder);
    }

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

  getAllDataSensor(): Promise<Data[]> {
    return this.dataRepository.find();
  }

  convertToLocalTime(time: Date): Date {
    const serverTimezoneOffset = new Date().getTimezoneOffset() * 60000; // Đổi sang milliseconds
    const localTime = new Date(time.getTime() - serverTimezoneOffset);
    return localTime;
  }
}
