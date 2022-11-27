import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as cheerio from 'cheerio';
import { CheckWithExistsNewChapterDto } from './dto/checkWithExistsNewChapter.dto';

@Injectable()
export class ScrapingService {
  private async initializeBrowser() {
    const args: string[] = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--window-position=0,0',
      '--ignore-certifcate-errors',
      '--ignore-certifcate-errors-spki-list',
      '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
    ];

    puppeteer.use(StealthPlugin());

    return puppeteer.launch({
      executablePath: '/usr/bin/google-chrome',
      args,
      ignoreHTTPSErrors: true,
    });
  }

  private stringMatchFilterList = (chapter: number) => [
    `Capítulo ${chapter.toString()}`,
    `Cap ${chapter.toString()}`,
    `cap ${chapter.toString()}`,
    `capítulo ${chapter.toString()}`,
    `cap. ${chapter.toString()}`,
    `Cap. ${chapter.toString()}`,
    `Cap. ${chapter.toString()}`,
  ];

  private predictingNextChapterList(currentCap: number) {
    let value = currentCap;

    return Array.from({ length: 10 }, () => Number((value += 0.1).toFixed(1)));
  }

  async checkWithExistsNewChapter({ cap, url }: CheckWithExistsNewChapterDto) {
    try {
      const browser = await this.initializeBrowser();
      const page = await browser.newPage();

      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 5000,
      });

      const html = await page.content();

      const $ = cheerio.load(html);

      const possibleNextChapters = this.predictingNextChapterList(cap);

      const hasChapter = possibleNextChapters.some((chapter) =>
        this.stringMatchFilterList(chapter).some((text) =>
          $.html().includes(text),
        ),
      );

      await browser.close();

      return {
        hasChapter,
      };
    } catch (e) {
      console.error(e);
    }
  }
}
