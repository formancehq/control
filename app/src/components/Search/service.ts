import {
  AccountSuggestions,
  PaymentSuggestions,
  SearchResource,
  SearchTargets,
  Suggestion,
  TransactionsSuggestions,
} from '~/src/types/search';
import { Account, Transaction } from '~/src/types/ledger';
import { Payment } from '~/src/types/payment';
import { Cursor } from '~/src/types/generic';
import { API_SEARCH, IApiClient } from '~/src/utils/api';
import i18n from './../../translations';

function normalize<T>(items: Array<T>, total: number, targetLabel: string) {
  return {
    viewAll: total > 3,
    items: [],
    targetLabel: i18n.t(targetLabel),
  };
}

const normalizeAccounts = (
  accounts: Account[],
  total: number
): Suggestion<Account, { ledger: string }> => ({
  ...normalize(accounts, total, 'common.search.targets.account'),
  items: accounts.map((account) => ({
    id: account.address,
    label: account.address,
    ledger: account.ledger || 'main-production',
    onClick: (a: Account) => a,
  })),
});

const normalizePayments = (
  payments: Payment[],
  total: number
): PaymentSuggestions => ({
  ...normalize(payments, total, 'common.search.targets.payment'),
  items: payments.map((payment) => ({
    id: payment.id,
    label: payment.reference,
    type: payment.type,
    onClick: (p: Payment) => p,
  })),
});

export const getSuggestions = async (
  target: SearchTargets,
  value: string,
  api: IApiClient
) =>
  await api.postResource<Cursor<Account | Transaction | Payment>>(
    API_SEARCH,
    {
      target,
      terms: [value],
      size: 3,
    },
    'cursor'
  );

const normalizeTransactions = (
  transactions: Transaction[],
  total: number
): TransactionsSuggestions => ({
  ...normalize(transactions, total, 'common.search.targets.transaction'),
  items: transactions.map((transaction) => ({
    id: `${transaction.txid}`,
    label: `${transaction.txid}`,
    source: transaction.postings[0].source,
    ledger: transaction.ledger || 'main-production-1234',
    onClick: (t: Transaction) => t,
  })),
});

export function suggestionsFactory(
  suggestions: SearchResource,
  target: SearchTargets,
  total: number
): AccountSuggestions | TransactionsSuggestions | PaymentSuggestions {
  switch (target) {
    case SearchTargets.ACCOUNT:
      return normalizeAccounts(suggestions as Account[], total);
    case SearchTargets.TRANSACTION:
      return normalizeTransactions(suggestions as Transaction[], total);
    case SearchTargets.PAYMENT:
      return normalizePayments(suggestions as Payment[], total);
    default:
      return normalize(suggestions as any, total, '');
  }
}
