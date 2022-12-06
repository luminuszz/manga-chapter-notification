import { Module } from '@nestjs/common';
import { TelegrafSdkProvider } from './telegraf';
import { TelegramService } from './telegram.service';

@Module({
  providers: [TelegramService, TelegrafSdkProvider],
})
export class TelegramModule {}
