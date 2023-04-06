import { get, isEmpty } from 'lodash';

import { ObjectOf } from '@numaryhq/storybook';

import i18n from '~/src/translations';
import {
  FlowInputOutput,
  OrchestrationStageSendHistory,
} from '~/src/types/orchestration';

export type OrchestrationFactoryLog = { main: string; children?: string[] };

const handleMetadata = (metadata: ObjectOf<any>): string | undefined => {
  const metadataKey = metadata ? Object.keys(metadata)[0] : undefined;

  return !isEmpty(metadata) && metadataKey
    ? i18n.t('pages.instance.sections.logs.createTransaction.child3', {
        key: metadataKey,
        value: get(metadata, metadataKey),
      })
    : undefined;
};

const getAccountLog = (data: any): OrchestrationFactoryLog => {
  const item = get(data, `${[OrchestrationStageSendHistory.GET_ACCOUNT]}`);

  return {
    main: item
      ? i18n.t('pages.instance.sections.logs.getAccount', {
          id: get(item, 'id'),
          ledger: get(item, 'ledger'),
        })
      : i18n.t('pages.instance.sections.logs.error', {
          activity: OrchestrationStageSendHistory.GET_ACCOUNT,
        }),
  };
};

const voidHoldLog = (data: any): OrchestrationFactoryLog => {
  const item = get(data, `${[OrchestrationStageSendHistory.VOID_HOLD]}`);

  return {
    main: item
      ? i18n.t('pages.instance.sections.logs.voidHold', {
          id: get(item, 'id'),
        })
      : i18n.t('pages.instance.sections.logs.error', {
          activity: OrchestrationStageSendHistory.VOID_HOLD,
        }),
  };
};

const getPaymentLog = (data: any): OrchestrationFactoryLog => {
  const id = get(data, `${[OrchestrationStageSendHistory.GET_PAYMENT]}.id`);

  return {
    main: id
      ? i18n.t('pages.instance.sections.logs.getPayment', {
          id,
        })
      : i18n.t('pages.instance.sections.logs.error', {
          activity: OrchestrationStageSendHistory.GET_PAYMENT,
        }),
  };
};

const revertTransactionLog = (data: any): OrchestrationFactoryLog => {
  const input = get(
    data,
    `input[${OrchestrationStageSendHistory.REVERT_TRANSACTION}]`
  );
  const output = get(
    data,
    `output[${OrchestrationStageSendHistory.REVERT_TRANSACTION}].data[0]`
  );
  const id = get(input, 'id');
  const txid = get(output, 'txid');

  return {
    main: id
      ? i18n.t('pages.instance.sections.logs.revertTransaction.main', {
          id,
        })
      : i18n.t('pages.instance.sections.logs.error', {
          activity: OrchestrationStageSendHistory.REVERT_TRANSACTION,
        }),
    children: [
      txid
        ? i18n.t('pages.instance.sections.logs.revertTransaction.child1', {
            txid,
          })
        : undefined,
    ].filter((str: string | undefined) => str !== undefined) as string[],
  };
};

const createTransactionLog = (data: any): OrchestrationFactoryLog => {
  const input = get(
    data,
    `input[${OrchestrationStageSendHistory.CREATE_TRANSACTION}]`
  );
  const output = get(
    data,
    `output[${OrchestrationStageSendHistory.CREATE_TRANSACTION}].data[0]`
  );
  const postings = get(output, 'postings') || [];
  const posting = postings.length === 1 ? postings[0] : undefined;
  const ledger = get(input, 'ledger');
  const metadata = get(output, 'metadata');
  const reference = get(output, 'reference', '') || '';

  const main =
    posting && ledger
      ? i18n.t('pages.instance.sections.logs.createTransaction.main', {
          amount: `${posting.amount} ${posting.asset}`,
          source: posting.source,
          destination: posting.destination,
          ledger,
        })
      : i18n.t('pages.instance.sections.logs.error', {
          activity: OrchestrationStageSendHistory.CREATE_TRANSACTION,
        });

  const children = output
    ? [
        i18n.t('pages.instance.sections.logs.createTransaction.child1', {
          txid: get(output, 'txid'),
        }),
        !isEmpty(reference)
          ? i18n.t('pages.instance.sections.logs.createTransaction.child2', {
              reference,
            })
          : undefined,
        handleMetadata(metadata),
      ]
    : undefined;

  return {
    main,
    children:
      children &&
      (children.filter(
        (str: string | undefined) => str !== undefined
      ) as string[]),
  };
};

const debitWalletLog = (data: any): OrchestrationFactoryLog => {
  const debitWallet = get(
    data,
    `input[${OrchestrationStageSendHistory.DEBIT_WALLET}]`
  );
  const input = get(debitWallet, 'data');

  return {
    main:
      input && debitWallet
        ? i18n.t('pages.instance.sections.logs.debitWallet.main', {
            amount: `${get(input, 'amount.amount')} ${get(
              input,
              'amount.asset'
            )}`,
            id: get(debitWallet, 'id'),
            balance: get(input, 'balances[0]'),
            destination: get(input, 'destination') || '@world',
          })
        : i18n.t('pages.instance.sections.logs.error', {
            activity: OrchestrationStageSendHistory.CREDIT_WALLET,
          }),
    children: [handleMetadata(get(input, 'metadata'))].filter(
      (str: string | undefined) => str !== undefined
    ) as string[],
  };
};

const creditWalletLog = (data: any): OrchestrationFactoryLog => {
  const creditWallet = get(
    data,
    `input[${OrchestrationStageSendHistory.CREDIT_WALLET}]`
  );
  const input = get(creditWallet, 'data');

  return {
    main:
      input && creditWallet
        ? i18n.t('pages.instance.sections.logs.creditWallet.main', {
            amount: `${get(input, 'amount.amount')} ${get(
              input,
              'amount.asset'
            )}`,
            id: get(creditWallet, 'id'),
            balance: get(input, 'balance'),
            source: get(input, 'ledger'),
          })
        : i18n.t('pages.instance.sections.logs.error', {
            activity: OrchestrationStageSendHistory.CREDIT_WALLET,
          }),
    children: [handleMetadata(get(input, 'metadata'))].filter(
      (str: string | undefined) => str !== undefined
    ) as string[],
  };
};

const getGetWalletLog = (data: any): OrchestrationFactoryLog => {
  const id = get(data, `${[OrchestrationStageSendHistory.GET_WALLET]}.id`);

  return {
    main: id
      ? i18n.t('pages.instance.sections.logs.getWallet', {
          id,
        })
      : i18n.t('pages.instance.sections.logs.error', {
          activity: OrchestrationStageSendHistory.GET_WALLET,
        }),
  };
};
const getStripeTransferLog = (data: any): OrchestrationFactoryLog => {
  const input = get(data, `${[OrchestrationStageSendHistory.STRIPE_TRANSFER]}`);

  return {
    main: input
      ? i18n.t('pages.instance.sections.logs.stripeTransfer', {
          amount: `${get(input, 'amount')} ${get(input, 'asset')}`,
          destination: get(input, 'destination'),
        })
      : i18n.t('pages.instance.sections.logs.error', {
          activity: OrchestrationStageSendHistory.STRIPE_TRANSFER,
        }),
  };
};

export function logsFactory(
  history: FlowInputOutput[]
): OrchestrationFactoryLog[] {
  return history
    .map((h) => {
      switch (h.name) {
        case OrchestrationStageSendHistory.GET_PAYMENT:
          return getPaymentLog(h.input);
        case OrchestrationStageSendHistory.GET_ACCOUNT:
          return getAccountLog(h.input);
        case OrchestrationStageSendHistory.VOID_HOLD:
          return voidHoldLog(h.input);
        case OrchestrationStageSendHistory.REVERT_TRANSACTION:
          return revertTransactionLog(h);
        case OrchestrationStageSendHistory.GET_WALLET:
          return getGetWalletLog(h.input);
        case OrchestrationStageSendHistory.STRIPE_TRANSFER:
          return getStripeTransferLog(h.input);
        case OrchestrationStageSendHistory.CREATE_TRANSACTION:
          return createTransactionLog(h);
        case OrchestrationStageSendHistory.CREDIT_WALLET:
          return creditWalletLog(h);
        case OrchestrationStageSendHistory.DEBIT_WALLET:
          return debitWalletLog(h);
        default:
          return undefined;
      }
    })
    .filter((l) => l !== undefined) as OrchestrationFactoryLog[];
}
