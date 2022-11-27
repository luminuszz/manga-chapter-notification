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

    const file = storageFiles[0];

    const { hasNewChapter } =
      await this.scrapingService.checkWithExistsNewChapter({
        cap: file.cap,
        url: file.url,
        id: file.id,
      });

    await this.notionProvider.updatePageCheckBox(file.id, hasNewChapter);
  }
}
