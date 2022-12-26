import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@notionhq/client';
import { Env } from '../../app.module';

export const NOTION_SDK_PROVIDER_TOKEN = 'NOTION_SDK_PROVIDER_TOKEN';

export const NotionClientProvider: Provider = {
  provide: NOTION_SDK_PROVIDER_TOKEN,
  useFactory: (configService: ConfigService<Env>) =>
    new Client({
      auth: configService.get('NOTION_AUTH_TOKEN'),
    }),
  inject: [ConfigService],
};
