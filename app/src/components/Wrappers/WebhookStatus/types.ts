import { Webhook } from '~/src/types/webhook';

export type WebhookStatusProps = {
  webhook: Webhook;
  onChangeCallback: any;
};
