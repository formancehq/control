import {
  OrchestrationStageSendAccount,
  OrchestrationStageSendPayment,
  OrchestrationStageSendWallet,
} from '~/src/types/orchestration';

export type SendStageProps = {
  send: {
    source:
      | {
          account: OrchestrationStageSendAccount;
        }
      | { wallet: OrchestrationStageSendWallet }
      | { payment: OrchestrationStageSendPayment };
    destination:
      | {
          account: OrchestrationStageSendAccount;
        }
      | { wallet: OrchestrationStageSendWallet }
      | { payment: OrchestrationStageSendPayment };
    amount: {
      amount: number;
      asset: string;
    };
  };
};
