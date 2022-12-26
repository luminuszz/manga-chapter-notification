import { Module } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { BullModule } from '@nestjs/bull';
import {
  ScrappingMangaPageJob,
  scrapingMangaPageQueueName,
} from './jobs/scrapping-manga-page.job';
import { NotionModule } from '../notion/notion.module';
import { NotificationModule } from '../notification/notification.module';
import { scrapingAnimeEpisodeQueueName } from './jobs/scrapping-anime-episode.job';

@Module({
  imports: [
    NotificationModule,
    NotionModule,
    BullModule.registerQueue(
      {
        name: scrapingMangaPageQueueName,
      },
      {
        name: scrapingAnimeEpisodeQueueName,
      },
    ),
  ],
  providers: [ScrapingService, ScrappingMangaPageJob],
  exports: [ScrapingService, ScrappingMangaPageJob],
})
export class ScrapingModule {}
