import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { TelegramProviderInstanceConfig } from './providers/telegram.provider';

@Module({
  providers: [NotificationService, TelegramProviderInstanceConfig],

  exports: [NotificationService],
})
export class NotificationModule {}
