import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { TelegramProvider } from './providers/telegram/telegram.provider';
import { TelegrafSdkProvider } from './providers/telegram/telegraf';

@Module({
  providers: [NotificationService, TelegrafSdkProvider, TelegramProvider],

  exports: [NotificationService],
})
export class NotificationModule {}
