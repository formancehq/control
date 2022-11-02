export type Webhook = {
  endpoint: string;
  secret: string;
  eventTypes: string[];
  active: boolean;
  createdAt: Date;
  modifiedAt: Date;
};
