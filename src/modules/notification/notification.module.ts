import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { TelegramProvider } from './providers/telegram.provider';

@Module({
  providers: [NotificationService, TelegramProvider],

  exports: [NotificationService],
})
export class NotificationModule {}
