import { ObjectOf } from './generic';

export enum LedgerResources {
  ACCOUNTS = 'accounts',
  TRANSACTIONS = 'transactions',
}

export enum LedgerSubResources {
  METADATA = 'metadata',
}
export enum LedgerTypes {
  SET_METADATA = 'SET_METADATA',
  NEW_TRANSACTION = 'NEW_TRANSACTION',
}

export type Account = {
  ledger: string;
  address: string;
  contract: string;
  metadata: any;
  balances: any;
  volumes: any;
};

export type Asset = {
  account: string;
  input: number;
  name: string;
  output: number;
};

export type Balance = {
  asset: string;
  value: number;
};

export type Volume = {
  asset: string;
  sent: number;
  received: number;
};

export type Posting = {
  amount: number;
  asset: string;
  destination: string;
  source: string;
};

export type Transaction = {
  ledger: string;
  hash: string;
  postings: Posting[];
  reference: string;
  timestamp: Date;
  txid: number;
  metadata: any;
};

export type PostingHybrid = {
  hash: string;
  reference: string;
  timestamp: Date;
  txid: number;
  amount: number;
  asset: string;
  destination: string;
  source: string;
  metadata: ObjectOf<any>;
};

export type TransactionHybrid = Omit<Transaction, 'postings' | 'metadata'> &
  Posting & {
    postingId: number;
    metadata: ObjectOf<any>;
  };

export type AccountHybrid = {
  balances: Balance[];
  volumes: Volume[];
  metadata: ObjectOf<any>;
};

export type LedgerInfo = {
  server: string;
  version: string;
  config: {
    storage: {
      driver: string;
      ledgers: string[];
    };
  };
};

export type LedgerStats = {
  transactions: number;
  accounts: number;
};

export type LedgerDetailedInfo = {
  name: string;
  storage: {
    migrations: LedgerMigration[];
    migration: LedgerMigration[]; // TODO remove once backend will fix typo
  };
};

export type LedgerMigration = {
  version: number;
  date: Date;
  name: string;
  state: LedgerMigrations;
};

export enum LedgerMigrations {
  DONE = 'DONE',
  TO_DO = 'TO DO',
}

export type LedgerLog<T> = {
  id: number;
  type: LedgerTypes.SET_METADATA | LedgerTypes.NEW_TRANSACTION;
  data: T;
  hash: string;
  date: Date;
};
