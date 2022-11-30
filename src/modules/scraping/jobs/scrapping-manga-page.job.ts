import {
  OnQueueCompleted,
  OnQueueError,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { ScrapingService } from '../scraping.service';
import { NotionService } from '../../notion/notion.service';
import { NotificationService } from '../../notification/notification.service';

export type JobDataDTO = {
  url: string;
  cap: number;
  name: string;
  id: string;
};

export const scrapingMangaPageQueueName = 'scrapingMangaPage';

@Processor(scrapingMangaPageQueueName)
export class ScrappingMangaPageJob {
  constructor(
    private readonly scrapingService: ScrapingService,
    private readonly notionService: NotionService,
    private readonly notificationService: NotificationService,
  ) {}

  @Process()
  async processJob({ data }: Job<JobDataDTO>) {
    const { url, cap, id, name } = data;

    const { hasNewChapter, newChapter } =
      await this.scrapingService.checkWithExistsNewChapter({
        url,
        cap,
        id,
      });

    await this.notionService.updatePageCheckBox(id, hasNewChapter);

    return {
      hasNewChapter,
      newChapter: newChapter || null,
      name,
      url,
      cap,
      id,
    };
  }

  @OnQueueCompleted()
  async onFinishJob(job: Job<JobDataDTO>) {
    const { hasNewChapter, cap, url, name, newChapter } = job.returnvalue;

    console.log('job finished', { ...job.data, hasChapter: job.returnvalue });

    if (hasNewChapter) {
      console.log('notify providers');
      await this.notificationService.sendNotification({
        name,
        chapter: cap,
        url: url,
        newChapter,
      });
    }
  }

  @OnQueueError()
  onQueueError(error: Error) {
    console.error('error', error);
  }
}
