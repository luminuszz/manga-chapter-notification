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
      database_id: 'a66324488dbd4e2ab5e6dd15e00f512d',
      filter: {
        property: 'status',
        select: {
          equals: 'Acompanhando',
        },
      },
    });

    return response.results.map((item: any) => ({
      name: item?.properties?.Name.title[0].plain_text,
      cap: item?.properties.cap.number,
      url: item?.properties.URL.url,
    }));
  }
}
