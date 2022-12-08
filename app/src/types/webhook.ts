export type Webhook = {
  id: string;
  endpoint: string;
  secret: string;
  eventTypes: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};
