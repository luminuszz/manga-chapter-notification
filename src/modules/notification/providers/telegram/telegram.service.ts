import { Telegraf } from 'telegraf';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from '../../../../app.module';
import { NotificationContractProvider } from '../../notification.contract';
import { MessageBody } from '../../dto/message-body.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { Topics } from '../../topics';
import { TELEGRAF_PROVIDER_TOKEN } from './telegraf';

@Injectable()
export class TelegramService implements NotificationContractProvider {
  getProviderName(): string {
    return 'Telegram';
  }

  private readonly group_id: string;

  constructor(
    private readonly configService: ConfigService<Env>,
    @Inject(TELEGRAF_PROVIDER_TOKEN)
    private readonly telegramBot: Telegraf,
  ) {
    this.group_id = this.configService.get('TELEGRAM_CHAT_ID');
  }

  public createTelegramMessage({
    url,
    name,
    chapter,
    newChapter,
  }: MessageBody): string {
    return `
   ${name} - Capítulo Novo disponível - ${newChapter}!
    Cap Anterior: ${chapter}
    Novo Capítulo: ${newChapter}
    link -> ${url}
    `;
  }

  async sendNotification(messageBody: MessageBody): Promise<void> {
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
