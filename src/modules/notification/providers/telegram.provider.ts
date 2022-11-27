import { Telegraf } from 'telegraf';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from '../../../app.module';
import {
  MessageBody,
  NotificationContractProvider,
} from './notification.contract';
import { OnEvent } from '@nestjs/event-emitter';
import { Topics } from '../topics';

@Injectable()
export class TelegramProvider implements NotificationContractProvider {
  getProviderName(): string {
    return 'Telegram';
  }

  private readonly telegramBot: Telegraf;

  private readonly group_id: string;

  constructor(private readonly configService: ConfigService<Env>) {
    this.telegramBot = new Telegraf(
      this.configService.get('TELEGRAM_NOTIFICATION_BOT'),
    );
    this.group_id = this.configService.get('TELEGRAM_CHAT_ID');
  }

  private createTelegramMessage({ url, name, chapter }: MessageBody): string {
    return `
   ${name} - Capítulo Novo disponível!
    Cap: ${chapter}
    link -> ${url}
    `;
  }

  async sendNotification(messageBody: MessageBody): Promise<void> {
    console.log({ messageBody, teste: this.group_id });

    await this.telegramBot.telegram.sendMessage(
      this.group_id,
      this.createTelegramMessage(messageBody),
    );
  }

  @OnEvent(Topics.chapterUpdate, {
    async: true,
  })
  async listenToUpdates(payload: MessageBody): Promise<void> {
    await this.sendNotification(payload);
  }
}
