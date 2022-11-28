import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotionModule } from './modules/notion/notion.module';
import { AppController } from './app.controller';

import { ScrapingModule } from './modules/scraping/scraping.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './modules/tasks/tasks.module';
import { BullModule } from '@nestjs/bull';
import { NotificationModule } from './modules/notification/notification.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

export type Env = {
  NOTION_AUTH_TOKEN: string;
  NOTION_DATABASE_ID: string;
  TELEGRAM_APP_ID: string;
  TELEGRAM_API_HASH: string;
  TELEGRAM_CHAT_ID: string;
  TELEGRAM_NOTIFICATION_BOT: string;
};

@Module({
  imports: [
    EventEmitterModule.forRoot({
      maxListeners: 10,
      delimiter: '.',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: {
        port: 6379,
        host: 'redis_database',
      },
      limiter: {
        max: 3,
        duration: 60000,
      },
    }),
    NotionModule,
    ScrapingModule,
    TasksModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
