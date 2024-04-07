import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { ConfigModule } from '@nestjs/config';
import { DataModule } from 'src/data/data.module';

@Module({
  imports: [ConfigModule, DataModule],
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttModule {}
