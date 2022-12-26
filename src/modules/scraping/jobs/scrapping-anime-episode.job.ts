import { Process, Processor } from '@nestjs/bull';

export const scrapingAnimeEpisodeQueueName = 'scrapingAnimeEpisode-queue-job';

@Processor(scrapingAnimeEpisodeQueueName)
export class ScrapingAnimeEpisode {
  @Process()
  async execute() {
    console.log('teste');
  }
}
