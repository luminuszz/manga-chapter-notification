import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

@Injectable()
export class ScrapingService {
  private async initializeBrowser() {
    return puppeteer.launch({
      executablePath: '/usr/bin/google-chrome',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }

  async checkWithExistsNewChapter(pageUrl: string, cap: number) {
    try {
      const browser = await this.initializeBrowser();
      const page = await browser.newPage();

      await page.goto(pageUrl, { waitUntil: 'networkidle2' });

      const html = await page.content();

      const $ = cheerio.load(html);

      const hasChapter = $.html().includes(String(cap + 1));

      await browser.close();

      return {
        hasChapter,
      };
    } catch (e) {
      console.error(e);
    }
  }
}
