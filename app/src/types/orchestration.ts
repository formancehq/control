import { ObjectOf } from '@numaryhq/storybook';

export type OrchestrationWorkflow<T> = {
  id: string;
  name: string;
  createdAt: Date;
  config: {
    stages: OrchestrationStage<T>[];
  };
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

export type OrchestrationStageDelay = {
  duration?: string;
  until?: string;
};

export type OrchestrationStageWaitEvent = {
  event: string;
};

export type OrchestrationStageInputAccount = {
  account: OrchestrationStageSendAccount;
};
export type OrchestrationStageInputWallet = {
  wallet: OrchestrationStageSendWallet;
};
export type OrchestrationStageInputPayment = {
  payment: OrchestrationStageSendPayment;
};

export type OrchestrationStageInput =
  | OrchestrationStageInputAccount
  | OrchestrationStageInputWallet
  | OrchestrationStageInputPayment;

export type OrchestrationStageSend = {
  source: OrchestrationStageInput;
  destination: OrchestrationStageInput;
  amount: {
    amount: number;
    asset: string;
  };
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

export enum OrchestrationInstanceStatuses {
  RUNNING = 'running',
  TERMINATED = 'terminated',
}

export enum OrchestrationStages {
  SEND = 'send',
  WAIT_EVENT = 'wait_event',
  DELAY = 'delay',
}

export enum OrchestrationRunHistories {
  RUN_SEND = 'RunSend',
  RUN_WAIT_EVENT = 'RunWaitEvent',
  RUN_DELAY = 'RunDelay',
}

export enum OrchestrationStageSendHistory {
  CREATE_TRANSACTION = 'CreateTransaction',
  REVERT_TRANSACTION = 'RevertTransaction',
  GET_PAYMENT = 'GetPayment',
  GET_ACCOUNT = 'GetAccount',
  GET_WALLET = 'GetWallet',
  CREDIT_WALLET = 'CreditWallet',
  DEBIT_WALLET = 'DebitWallet',
  STRIPE_TRANSFER = 'StripeTransfer',
}
