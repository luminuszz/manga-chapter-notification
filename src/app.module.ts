import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotionModule } from './modules/notion/notion.module';
import { AppController } from './app.controller';

import { ScrapingModule } from './modules/scraping/scraping.module';

export type Env = {
  NOTION_AUTH_TOKEN: string;
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NotionModule,
    ScrapingModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
