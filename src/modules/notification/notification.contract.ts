import { MessageBody } from './dto/message-body.dto';

export abstract class NotificationContractProvider {
  abstract sendNotification(message: MessageBody): Promise<void>;

  abstract getProviderName(): string;

  abstract listenToUpdates(payload: MessageBody): Promise<void>;
}
