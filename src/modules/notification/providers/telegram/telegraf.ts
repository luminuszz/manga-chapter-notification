import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from '../../../../app.module';
import { Telegraf } from 'telegraf';
import { TelegramProvider } from './telegram.provider';

export const TELEGRAF_PROVIDER_TOKEN = 'TELEGRAF_PROVIDER_TOKEN';

export const TelegrafSdkProvider: Provider = {
  provide: TELEGRAF_PROVIDER_TOKEN,
  useFactory: (configService: ConfigService<Env>) => {
    const bot = new Telegraf(configService.get('TELEGRAM_NOTIFICATION_BOT'));

    return new TelegramProvider(configService, bot);
  },

  inject: [ConfigService],
};
