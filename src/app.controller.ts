import { Controller, Get } from '@nestjs/common';
import { NotionService } from './modules/notion/notion.service';

@Controller()
export class AppController {
  constructor(private readonly notionProvider: NotionService) {}

  @Get('/databases')
  async getDatabase() {
    return await this.notionProvider.getFollowComicsMyDatabase();
  }

 

}
