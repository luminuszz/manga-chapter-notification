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
    return await this.notionProvider.getFollowComicsMyDatabase();
  }
}
