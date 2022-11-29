import { Test } from '@nestjs/testing';
import { NotionService } from './notion.service';
import { ConfigService } from '@nestjs/config';
import { Client } from '@notionhq/client';
import { NOTION_SDK_PROVIDER_TOKEN } from './notionClient.provider';

const configServiceMock = {
  get: jest.fn().mockImplementation(() => 'NOTION_MOCK_TOKEN'),
};

const NotionClientProviderMock = {
  databases: {
    query: jest.fn().mockImplementation(() => ({ results: [] })),
  } as any,
  pages: {
    update: jest.fn().mockImplementation(() => ({})),
  } as any,
} as Client;

describe('Notion notion service', () => {
  let notionService: NotionService;

  beforeAll(async () => {
    const moduleFef = await Test.createTestingModule({
      providers: [
        NotionService,
        { provide: ConfigService, useValue: configServiceMock },
        {
          provide: NOTION_SDK_PROVIDER_TOKEN,
          useValue: NotionClientProviderMock,
        },
      ],
    }).compile();

    notionService = moduleFef.get<NotionService>(NotionService);
  });

  it('getFollowComicsMyDatabase: it should be able to get follow database list', async () => {
    const response = await notionService.getFollowComicsMyDatabase();

    expect(response).toBeInstanceOf(Array);
  });

  it('updatePageCheckBox: it should be able to update page checkbox', async () => {
    const fakePageId = 'fake-page-id';

    await expect(
      notionService.updatePageCheckBox(fakePageId, true),
    ).resolves.toBeUndefined();
  });
});
