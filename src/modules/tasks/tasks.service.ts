import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import {
  scrapingMangaPageQueueName,
  JobDataDTO,
} from '../scraping/jobs/scrapping-manga-page.job';
import { Queue } from 'bull';
import { NotionService } from '../notion/notion.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectQueue(scrapingMangaPageQueueName)
    private readonly processScrapingMangaPage: Queue<JobDataDTO>,

    private readonly notionService: NotionService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES, {
    timeZone: 'America/Bahia',
  })
  public async handleBackgroundTasks() {
    console.log('trigger ');
    const results = await this.notionService.getFollowComicsMyDatabase();

    results.forEach((page) => {
      this.processScrapingMangaPage.add({
        cap: page.cap,
        url: page.url,
        name: page.name,
        id: page.id,
      });
    });
  }
}
