import { Account, Asset, Transaction } from '~/src/types/ledger';
import { Payment, PaymentType } from '~/src/types/payment';

export enum SearchTargets {
  ACCOUNT = 'ACCOUNT',
  TRANSACTION = 'TRANSACTION',
  PAYMENT = 'PAYMENT',
  ASSET = 'ASSET',
  LEDGER = 'LEDGER', // not a real target for search api, but should be use as it is to avoid complexity
}

export enum SearchPolicies {
  OR = 'OR',
  AND = 'AND',
}

export type SearchTarget =
  | SearchTargets.TRANSACTION
  | SearchTargets.ACCOUNT
  | SearchTargets.PAYMENT
  | SearchTargets.ASSET
  | SearchTargets.LEDGER;

export type SearchBody = {
  ledgers?: string[];
  size?: string | number;
  terms?: string[];
  cursor?: string;
  target?: SearchTarget;
  policy?: SearchPolicies.OR | SearchPolicies.AND;
};

export type SearchResource = Account[] | Transaction[] | Payment[] | Asset[];

export type Suggestion<T, X> = {
  viewAll: boolean;
  items: Array<SuggestionItem<T> & X>;
};

export type SuggestionItem<T> = {
  id: string;
  label?: string;
  onClick: (_item: T) => void;
};

export type AccountSuggestions = Suggestion<Account, { ledger: string }>;
export type TransactionsSuggestions = Suggestion<
  Transaction,
  { source: string }
>;
export type PaymentSuggestions = Suggestion<Payment, { type: PaymentType }>;
