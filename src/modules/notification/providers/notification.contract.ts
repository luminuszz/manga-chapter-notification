export type MessageBody = {
  name: string;
  chapter: number;
  url: string;

  newChapter?: string;
};

export abstract class NotificationContractProvider {
  abstract sendNotification(message: MessageBody): Promise<void>;

  abstract getProviderName(): string;

  abstract listenToUpdates(payload: MessageBody): Promise<void>;
}
