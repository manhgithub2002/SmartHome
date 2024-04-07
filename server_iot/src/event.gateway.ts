import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MqttService } from './mqtt/mqtt.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { DataService } from './data/data.service';
import { ActionService } from './action/action.service';

@WebSocketGateway({ cors: true })
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly mqttService: MqttService,
    private readonly eventEmiter: EventEmitter2,
    private readonly dataService: DataService,
    private readonly actionService: ActionService,
  ) {}

  @WebSocketServer()
  server: Server;

  handleEmitSoket({ data, event, to }) {
    if (to) {
      this.server.to(to).emit(event, data);
    } else {
      this.server.emit(event, data);
    }
  }

  @SubscribeMessage('control')
  async handleDevice(client: Socket, @MessageBody() data) {
    const handleData = JSON.parse(data.toString());
    if (handleData.fan) {
      handleData.fan === 'on'
        ? this.mqttService.mqtt.publish('device/control/fan', 'on')
        : this.mqttService.mqtt.publish('device/control/fan', 'off');
    } else {
      handleData.led === 'on'
        ? this.mqttService.mqtt.publish('device/control/led', 'on')
        : this.mqttService.mqtt.publish('device/control/fan', 'off');
    }
  }

  afterInit(socket: Socket) {
    console.log('EventGateway initialized');
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id);
  }

  handleConnection(client: Socket) {
    console.log('Client connected: ', client.id);

    this.mqttService.mqtt.on('message', async (topic, message) => {
      if (topic === 'sensor') {
        //send data to client over websocket
        this.handleEmitSoket({
          data: message.toString(),
          event: 'sensor',
          to: null,
        });
      } else if (topic === 'device/control/led') {
        this.handleEmitSoket({
          data: message.toString(),
          event: 'led',
          to: null,
        });
      } else if (topic === 'device/control/fan') {
        this.handleEmitSoket({
          data: message.toString(),
          event: 'fan',
          to: null,
        });
      } else if (topic === 'device/response') {
        console.log(message.toString());

        this.handleEmitSoket({
          data: message.toString(),
          event: 'response',
          to: null,
        });
        this.eventEmiter.emit('action.insert', message.toString());
      } else if (topic === 'warning') {
        this.handleEmitSoket({
          data: message.toString(),
          event: 'warning',
          to: null,
        });
      }
    });
  }

  @OnEvent('action.insert', { async: true })
  async handleActionInsertEvent(payload) {
    await this.actionService.storeAction(payload);
  }
}
