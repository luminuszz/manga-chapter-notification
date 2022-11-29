import { Module } from '@nestjs/common';
import { NotionService } from './notion.service';
import { NotionClientProvider } from './notionClient.provider';

@Module({
  providers: [NotionService, NotionClientProvider],
  exports: [NotionService],
})
export class NotionModule {}
