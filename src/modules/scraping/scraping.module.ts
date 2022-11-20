import { Module } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { BullModule } from '@nestjs/bull';
import {
  ScrappingMangaPageJob,
  scrapingMangaPageQueueName,
} from './jobs/scrapping-manga-page.job';
import { NotionModule } from '../notion/notion.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: scrapingMangaPageQueueName,
    }),
    NotionModule,
  ],
  providers: [ScrapingService, ScrappingMangaPageJob],
  exports: [ScrapingService, ScrappingMangaPageJob],
})
export class ScrapingModule {}
