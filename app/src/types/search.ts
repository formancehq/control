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
  sort?: string[];
  cursor?: string;
  target?: SearchTarget;
  policy?: SearchPolicies.OR | SearchPolicies.AND;
};

export type SearchResource = Account[] | Transaction[] | Payment[] | Asset[];

export type Suggestion<T> = {
  viewAll: boolean;
  items: Array<SuggestionItem & T>;
};

export type SuggestionItem = {
  id: string;
  label?: string;
};

export type AccountSuggestions = Suggestion<{ ledger: string }>;
export type TransactionsSuggestions = Suggestion<{ source: string }>;
export type PaymentSuggestions = Suggestion<{
  type: PaymentType;
  provider: string;
  asset: string;
  amount: number;
}>;

export type Bucket = {
  doc_count: number;
  key_as_string: string;
  key: number;
};

export type BooleanConfig = { [b: string]: { [a: string]: any } };
