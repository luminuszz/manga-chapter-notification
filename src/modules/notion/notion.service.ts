import { Injectable } from '@nestjs/common';
import { Client } from '@notionhq/client';
import { ConfigService } from '@nestjs/config';
import { Env } from '../../app.module';
import { GetFollowComicsMyDatabaseResponse } from './dto/getFollowComicsMyDatabase.dto';

@Injectable()
export class NotionService {
  private readonly notionSdk: Client;

  constructor(private readonly configService: ConfigService<Env>) {
    console.log({
      t: this.configService.get('NOTION_AUTH_TOKEN'),
    });

    this.notionSdk = new Client({
      auth: this.configService.get('NOTION_AUTH_TOKEN'),
    });
  }

  public async getFollowComicsMyDatabase(): Promise<GetFollowComicsMyDatabaseResponse> {
    const response = await this.notionSdk.databases.query({
      database_id: this.configService.get('NOTION_DATABASE_ID'),
      filter: {
        and: [
          {
            property: 'CAPITULO NOVO',
            checkbox: {
              equals: false,
              does_not_equal: true,
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
                content: `edited by notification-manga-api at ${new Date().toISOString()}`,
              },
            },
          ],
        },
      },
    });
  }
}
