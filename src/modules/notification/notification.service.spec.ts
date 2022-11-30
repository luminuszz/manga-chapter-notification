import { Test } from '@nestjs/testing';

import { NotificationService } from './notification.service';
import { Provider } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

const eventEmiiterMockProvider: Provider = {
  provide: EventEmitter2,
  useValue: {
    emit: jest.fn(),
  },
};

describe('NotificationService', () => {
  let notificationService: NotificationService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [eventEmiiterMockProvider, NotificationService],
    }).compile();

    notificationService =
      moduleRef.get<NotificationService>(NotificationService);
  });

  it('should be defined', async () => {
    expect(notificationService).toBeDefined();
  });

  it('should abe ablet notify a new chapter', async () => {
    const messageBody = { name: 'teste', chapter: 5, url: 'dsad' };

    await expect(
      notificationService.sendNotification(messageBody),
    ).resolves.toBeUndefined();
  });
});
