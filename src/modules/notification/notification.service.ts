import { Injectable } from '@nestjs/common';
import { MessageBody } from './providers/notification.contract';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Topics } from './topics';

@Injectable()
export class NotificationService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async sendNotification(messageBody: MessageBody): Promise<void> {
    this.eventEmitter.emit(Topics.chapterUpdate, messageBody);
  }
}
