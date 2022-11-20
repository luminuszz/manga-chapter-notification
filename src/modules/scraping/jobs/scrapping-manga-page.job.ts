import {
  OnQueueCompleted,
  OnQueueError,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { ScrapingService } from '../scraping.service';
import { NotionService } from '../../notion/notion.service';

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
  ) {}

  @Process()
  async processJob({ data }: Job<JobDataDTO>) {
    const { url, cap, id } = data;

    const hasNewChapter = await this.scrapingService.checkWithExistsNewChapter({
      url,
      cap,
      id,
    });

    await this.notionService.updatePageCheckBox(id, hasNewChapter.hasChapter);
  }

  @OnQueueCompleted()
  onFinishJob(job: Job<JobDataDTO>) {
    console.log('job finished', job.data);
  }

  @OnQueueError()
  onQueueError(error: Error) {
    console.error('error', error);
  }
}
