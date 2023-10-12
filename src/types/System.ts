export type Notification = {
   title: string;
   description: string;
   timestamp: number;
   read: boolean;
   readTimestamp: number;
}

export type NotificationWithId = Notification & { id: string}