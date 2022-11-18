export type Webhook = {
  _id: string;
  endpoint: string;
  secret: string;
  eventTypes: string[];
  active: boolean;
  createdAt: Date;
  modifiedAt: Date;
};
