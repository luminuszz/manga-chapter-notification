import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { BullModule } from '@nestjs/bull';
import { scrapingMangaPageQueueName } from '../scraping/jobs/scrapping-manga-page.job';
import { NotionModule } from '../notion/notion.module';

@Module({
  imports: [
    NotionModule,
    BullModule.registerQueue({
      name: scrapingMangaPageQueueName,
    }),
  ],
  providers: [TasksService],
})
export class TasksModule {}
