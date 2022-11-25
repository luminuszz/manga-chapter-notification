import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotionModule } from './modules/notion/notion.module';
import { AppController } from './app.controller';

import { ScrapingModule } from './modules/scraping/scraping.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './modules/tasks/tasks.module';
import { BullModule } from '@nestjs/bull';

export type Env = {
  NOTION_AUTH_TOKEN: string;
  NOTION_DATABASE_ID: string;
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: {
        port: 6379,
        host: 'redis_database',
      },
    }),
    NotionModule,
    ScrapingModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
