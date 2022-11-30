import { Test } from '@nestjs/testing';
import { ScrapingService } from './scraping.service';
import puppeteer from 'puppeteer-extra';

const browserInstanceMock = {
  newPage: () => ({
    setUserAgent: jest.fn().mockImplementation(() => Promise.resolve()),
    goto: jest.fn().mockImplementation(() => Promise.resolve()),
    evaluate: jest.fn().mockImplementation(() => 'Capítulo 2'),
  }),

  close: jest.fn().mockImplementation(() => Promise.resolve()),
};

describe('ScrappingSevice', () => {
  let scrapingService: ScrapingService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ScrapingService],
    }).compile();

    scrapingService = moduleRef.get<ScrapingService>(ScrapingService);
  });

  it('should be defined', () => {
    expect(scrapingService).toBeDefined();
  });

  it(' initializeBrowser: should be able to  init to return a browser instance', async () => {
    jest
      .spyOn(puppeteer, 'launch')
      .mockImplementation(() => Promise.resolve({}) as any);

    const browser = await scrapingService.initializeBrowser();

    expect(browser).toBeDefined();
  });

  it('stringMatchFilterList: should be able to return a list of strings', () => {
    const list = scrapingService.stringMatchFilterList(1);

    expect(list).toBeInstanceOf(Array);
    expect(list[0]).toBe('Capítulo 1');
  });

  it('predictingNextChapterList: should be able to return a list of numbers', () => {
    const list = scrapingService.predictingNextChapterList(1);

    expect(list).toBeInstanceOf(Array);
    expect(list[0]).toBe(1.1);
  });

  it('checkWithExistsNewChapter: should be able to return a object with hasNewChapter, stringsToMatch and html', async () => {
    jest
      .spyOn(scrapingService, 'initializeBrowser')
      .mockImplementation(() => browserInstanceMock as any);

    const response = await scrapingService.checkWithExistsNewChapter({
      cap: 1,
      url: 'https://www.google.com',
      id: '1',
    });

    expect(response).toHaveProperty('hasNewChapter');
    expect(response).toHaveProperty('stringsToMatch');
    expect(response).toHaveProperty('html');

    expect(response.hasNewChapter).toBeTruthy();
  });

  it('checkWithExistsNewChapter: should be able return false if not exits new chapter', async () => {
    jest
      .spyOn(scrapingService, 'initializeBrowser')
      .mockImplementation(() => Promise.resolve(browserInstanceMock) as any);

    const currentChapter = 2;

    const response = await scrapingService.checkWithExistsNewChapter({
      cap: currentChapter,
      url: 'fake-url',
      id: 'dsadasd',
    });

    expect(response.hasNewChapter).toBeFalsy();
  });
});
