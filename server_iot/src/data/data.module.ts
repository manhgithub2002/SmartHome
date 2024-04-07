import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Data } from './data.entity';
import { BullModule } from '@nestjs/bull';
import { DataService } from './data.service';
import { DataConsummer } from './consumers/data.comsumer';
import { DataController } from './data.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Data]),
    BullModule.registerQueue({
      name: 'sensor-data',
    }),
  ],
  controllers: [DataController],
  providers: [DataService, DataConsummer],
  exports: [DataService],
})
export class DataModule {}
