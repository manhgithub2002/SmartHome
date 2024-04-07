import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { MqttClient, connect } from 'mqtt';
import { Data } from 'src/data/data.entity';
import { DataService } from 'src/data/data.service';

@Injectable()
// @WebSocketGateway()
export class MqttService {
  // @WebSocketServer() private server: Server;

  public readonly mqtt: MqttClient;

  constructor(
    private configService: ConfigService,
    private readonly eventEmiter: EventEmitter2,
    private readonly dataService: DataService,
  ) {
    this.mqtt = connect(this.configService.get<string>('connectUrl'), {
      clientId: this.configService.get<string>('clientId') || null,
      clean: true,
      connectTimeout: parseInt(
        this.configService.get<string>('connectTimeout'),
        10,
      ),
      username: this.configService.get<string>('MQTT_USERNAME'),
      password: this.configService.get<string>('password'),
      reconnectPeriod: parseInt(
        this.configService.get<string>('reconnectPeriod'),
        10,
      ),
    });

    this.mqtt.on('connect', () => {
      console.log('Connected to MQTT server');
    });

    //Connect to topics to handle events
    const topics = [
      'sensor',
      'device/control/led',
      'device/control/fan',
      'warning',
      'device/response',
    ];

    this.mqtt.on('connect', () => {
      topics.forEach((topic) => {
        this.mqtt.subscribe(topic, (err) => {
          if (err) {
            console.log('Sub failed: ' + err);
          } else {
            console.log(`Subscribed to ${topic}`);
          }
        });
      });
    });

    this.mqtt.on('message', (topic, message) => {
      if (topic === 'sensor') {
        this.eventEmiter.emit('data.insert', message.toString());
      }
    });

    this.mqtt.on('close', () => {
      console.log('Trying to reconnect MQTT broker');
    });

    this.mqtt.on('error', () => {
      console.log('Connection error');
    });
  }

  @OnEvent('data.insert', { async: true })
  async handleDataInsrtEvent(payload) {
    // console.log(payload.toString());

    await this.dataService.storeDataInCache(payload);
  }
}
