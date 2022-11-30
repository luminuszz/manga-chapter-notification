import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { some } from 'lodash';
import { CheckWithExistsNewChapterDto } from './dto/checkWithExistsNewChapter.dto';

@Injectable()
export class ScrapingService {
  async initializeBrowser() {
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
      headless: true,
      executablePath: '/usr/bin/google-chrome',
      args,
    });
  }

  stringMatchFilterList = (chapter: number) => [
    `Capítulo ${chapter.toString()}`,
    `Cap ${chapter.toString()}`,
    `cap ${chapter.toString()}`,
    `capítulo ${chapter.toString()}`,
    `cap. ${chapter.toString()}`,
    `Cap. ${chapter.toString()}`,
    `Cap. ${chapter.toString()}`,
  ];

  predictingNextChapterList(currentCap: number) {
    let value = currentCap;

    return Array.from({ length: 10 }, () => Number((value += 0.1).toFixed(1)));
  }

  async checkWithExistsNewChapter({ cap, url }: CheckWithExistsNewChapterDto) {
    const browser = await this.initializeBrowser();
    try {
      const page = await browser.newPage();

      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0',
      );

      await page.goto(url, {
        waitUntil: 'networkidle2',
      });

      const html = await page.evaluate(
        () => document.querySelector('*').outerHTML,
      );

      const possibleNextChapters = this.predictingNextChapterList(cap);

      const stringsToMatch = possibleNextChapters
        .map((cap) => this.stringMatchFilterList(cap))
        .flat();

      const hasNewChapter = some(stringsToMatch, (stringToMatch) =>
        html.includes(stringToMatch),
      );

      return {
        hasNewChapter,
        stringsToMatch,
        html,
      };
    } catch (e) {
      console.error(e);
    } finally {
      await browser.close();
    }
  }
}
