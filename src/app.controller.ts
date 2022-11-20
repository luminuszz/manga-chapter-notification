import { Controller, Get } from '@nestjs/common';
import { NotionService } from './modules/notion/notion.service';
import { ScrapingService } from './modules/scraping/scraping.service';

@Controller()
export class AppController {
  constructor(
    private readonly notionProvider: NotionService,
    private readonly scrapingService: ScrapingService,
  ) {}

  @Get('/databases')
  async getDatabase() {
    const storageFiles = await this.notionProvider.getFollowComicsMyDatabase();

    const response = await this.scrapingService.checkWithExistsNewChapter(
      storageFiles[0].url,
      storageFiles[0].cap,
    );

    return response;
  }
}
