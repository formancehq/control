import { ObjectOf } from '@numaryhq/storybook';

export type OrchestrationWorkflow<T> = {
  id: string;
  name: string;
  createdAt: Date;
  stages: OrchestrationStage<T>[];
};

export type OrchestrationStageSendAccount = {
  id: string;
  ledger: string;
};

export type OrchestrationStageSendWallet = {
  id: string;
};

export type OrchestrationStageSendPayment = {
  id: string;
  psp: string;
};

export type OrchestrationStageSend<T> = {
  source: T;
  destination: T;
  amount: {
    amount: number;
    asset: string;
  };
};

export type OrchestrationStageDelay = {
  duration?: string;
  until?: string;
};

export type OrchestrationStageWaitEvent = {
  event: string;
};

export type OrchestrationStage<T> = ObjectOf<T>;

export type OrchestrationInstance = {
  id: string;
  workflowID: string;
  createdAt: Date;
  updatedAt: Date;
  terminatedAt: Date;
  terminated: boolean;
};

export enum OrchestrationStages {
  SEND = 'send',
  WAIT_EVENT = 'wait_event',
  DELAY = 'delay',
}
