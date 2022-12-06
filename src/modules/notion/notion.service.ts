import { Inject, Injectable } from '@nestjs/common';
import { Client } from '@notionhq/client';
import { ConfigService } from '@nestjs/config';
import { Env } from '../../app.module';
import { GetFollowComicsMyDatabaseResponse } from './dto/getFollowComicsMyDatabase.dto';
import { NOTION_SDK_PROVIDER_TOKEN } from './notionClient.provider';
import { format } from 'date-fns';

@Injectable()
export class NotionService {
  constructor(
    @Inject(NOTION_SDK_PROVIDER_TOKEN)
    private readonly notionSdk: Client,
    private readonly configService: ConfigService<Env>,
  ) {}

  public async getFollowComicsMyDatabase(): Promise<GetFollowComicsMyDatabaseResponse> {
    const response = await this.notionSdk.databases.query({
      database_id: this.configService.get('NOTION_DATABASE_COMIC_ID'),
      filter: {
        and: [
          {
            property: 'CAPITULO NOVO',
            checkbox: {
              equals: false,
            },
          },
          {
            property: 'status',
            select: {
              equals: 'Acompanhando',
            },
          },
        ],
      },
    });

    return response.results.map((item: any) => ({
      id: item.id,
      name: item?.properties?.Name.title[0].plain_text,
      cap: item?.properties.cap.number,
      url: item?.properties.URL.url,
    }));
  }

  public async updatePageCheckBox(page_id: string, value: boolean) {
    await this.notionSdk.pages.update({
      page_id,
      properties: {
        'CAPITULO NOVO': {
          checkbox: value,
        },

        Notas: {
          rich_text: [
            {
              text: {
                content: `edited by notification-manga-api at ${format(
                  new Date(),
                  'dd/MM/yyyy HH:mm:ss',
                )}`,
              },
            },
          ],
        },
      },
    });
  }
}
