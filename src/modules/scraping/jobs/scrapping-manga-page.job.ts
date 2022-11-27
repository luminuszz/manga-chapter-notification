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

    const { hasNewChapter } =
      await this.scrapingService.checkWithExistsNewChapter({
        url,
        cap,
        id,
      });

    await this.notionService.updatePageCheckBox(id, hasNewChapter);

    if (hasNewChapter) {
      await this.notificationService.sendNotification({
        name,
        url,
        chapter: cap,
      });
    }

    return {
      hasNewChapter,
    };
  }

  @OnQueueCompleted()
  onFinishJob(job: Job<JobDataDTO>) {
    console.log({
      t: job.returnvalue,
    });

    console.log('job finished', { ...job.data, hasChapter: job.returnvalue });
  }

  @OnQueueError()
  onQueueError(error: Error) {
    console.error('error', error);
  }
}
