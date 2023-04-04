import { get, isEmpty } from 'lodash';

import i18n from '~/src/translations';
import { OrchestrationStageSendHistory } from '~/src/types/orchestration';

export type OrchestrationFactoryLog = { main: string; children?: string[] };

const getPaymentLog = (data: any): OrchestrationFactoryLog => ({
  main: i18n.t('pages.instance.sections.logs.getPayment', {
    id: data[OrchestrationStageSendHistory.GET_PAYMENT].id,
  }),
});

const createTransactionLog = (data: any): OrchestrationFactoryLog => {
  const input = data.input[OrchestrationStageSendHistory.CREATE_TRANSACTION];
  const output = get(
    data,
    `output[${OrchestrationStageSendHistory.CREATE_TRANSACTION}].data[0]`
  );
  const postings = output.postings.length === 1 ? output.postings[0] : {};

  return {
    main: i18n.t('pages.instance.sections.logs.createTransaction.main', {
      amount: `${postings.amount} ${postings.asset}`,
      source: postings.source,
      destination: postings.destination,
      ledger: input.ledger,
    }),
    children: [
      i18n.t('pages.instance.sections.logs.createTransaction.child1', {
        txid: output.txid,
      }),
      !isEmpty(output.reference)
        ? i18n.t('pages.instance.sections.logs.createTransaction.child2', {
            reference: output.reference,
          })
        : undefined,
      !isEmpty(output.metadata)
        ? i18n.t('pages.instance.sections.logs.createTransaction.child3', {
            key: Object.keys(output.metadata)[0],
            value: output.metadata[Object.keys(output.metadata)[0]],
          })
        : undefined,
    ].filter((str: string | undefined) => str !== undefined) as string[],
  };
};

const creditWalletLog = (data: any): OrchestrationFactoryLog => {
  const creditWallet = data.input[OrchestrationStageSendHistory.CREDIT_WALLET];
  const input = creditWallet.data;

  return {
    main: i18n.t('pages.instance.sections.logs.creditWallet.main', {
      amount: `${input.amount.amount} ${input.amount.asset}`,
      id: creditWallet.id,
      balance: input.balance,
      source: input.ledger,
    }),
    children: [
      !isEmpty(input.metadata)
        ? i18n.t('pages.instance.sections.logs.creditWallet.child1', {
            key: Object.keys(input.metadata)[0],
            value: input.metadata[Object.keys(input.metadata)[0]],
          })
        : undefined,
    ].filter((str: string | undefined) => str !== undefined) as string[],
  };
};

const getGetWalletLog = (data: any): OrchestrationFactoryLog => ({
  main: i18n.t('pages.instance.sections.logs.getWallet', {
    id: data[OrchestrationStageSendHistory.GET_WALLET].id,
  }),
});

export function logsFactory(
  history: { name: string; input: any; output: any }[]
): Log[] {
  return history
    .map((h) => {
      switch (h.name) {
        case OrchestrationStageSendHistory.GET_PAYMENT:
          return getPaymentLog(h.input);
        case OrchestrationStageSendHistory.GET_WALLET:
          return getGetWalletLog(h.input);
        case OrchestrationStageSendHistory.CREATE_TRANSACTION:
          return createTransactionLog(h);
        case OrchestrationStageSendHistory.CREDIT_WALLET:
          return creditWalletLog(h);
        default:
          return undefined;
      }
    })
    .filter((l) => l !== undefined) as Log[];
}
