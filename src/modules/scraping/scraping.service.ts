import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import { CheckWithExistsNewChapterDto } from './dto/checkWithExistsNewChapter.dto';

@Injectable()
export class ScrapingService {
  private async initializeBrowser() {
    return puppeteer.launch({
      executablePath: '/usr/bin/google-chrome',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }

  private predictingNextChapterList(currentCap: number) {
    let value = currentCap;

    return Array.from({ length: 10 }, (_, i) =>
      Number((value += 0.1).toFixed(1)),
    );
  }

  async checkWithExistsNewChapter({ cap, url }: CheckWithExistsNewChapterDto) {
    try {
      const browser = await this.initializeBrowser();
      const page = await browser.newPage();

      await page.goto(url, { waitUntil: 'networkidle2' });

      const html = await page.content();

      const $ = cheerio.load(html);

      const possibleNextChapters = this.predictingNextChapterList(cap);

      const hasChapter = possibleNextChapters.some((chapter) =>
        $.html().includes(String(chapter)),
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
