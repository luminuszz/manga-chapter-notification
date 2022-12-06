import { Test } from '@nestjs/testing';
import { TelegramProvider } from './telegram.provider';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const configServiceMock: Provider = {
  provide: ConfigService,
  useValue: {
    get: jest.fn().mockImplementation(() => 'TELEGRAM_MOCK_TOKEN'),
  },
};

const telegrafMock = {
  telegram: {
    sendMessage: jest.fn().mockImplementation(() => ({})),
  },
} as any;

const TelegramProviderInstanceConfigMock: Provider = {
  provide: TelegramProvider,
  useFactory: (configService: ConfigService) =>
    new TelegramProvider(configService, telegrafMock),
  inject: [ConfigService],
};

describe('TelegramProvider', () => {
  let telegramProvider: TelegramProvider;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [TelegramProviderInstanceConfigMock, configServiceMock],
    }).compile();

    telegramProvider = moduleRef.get<TelegramProvider>(TelegramProvider);
  });

  it('should be defined', () => {
    expect(telegramProvider).toBeDefined();
  });

  it('createTelegramMessage: it should be able to create a telegram message', () => {
    const messageBody = { name: 'teste', chapter: 5, url: 'dsad' };

    const message = telegramProvider.createTelegramMessage(messageBody);

    expect(message).toContain(messageBody.name);
    expect(message).toContain(messageBody.chapter.toString());
    expect(message).toContain(messageBody.url);
  });

  it('sendNotification: it should be able to send a notification a telegram group', async () => {
    const messageBody = { name: 'teste', chapter: 5, url: 'dsad' };

    await expect(
      telegramProvider.sendNotification(messageBody),
    ).resolves.toBeUndefined();
  });

  it('listenToUpdates: it should be able to listen new chapters updates ', async () => {
    const messageBody = { name: 'teste', chapter: 5, url: 'dsad' };

    await expect(
      telegramProvider.listenToUpdates(messageBody),
    ).resolves.toBeUndefined();
  });
  it('getProviderName: it should be able to get provider name ', async () => {
    const providerName = telegramProvider.getProviderName();

    expect(providerName).toBe('Telegram');
    expect(providerName).not.toBe('Telegram2');
  });
});
