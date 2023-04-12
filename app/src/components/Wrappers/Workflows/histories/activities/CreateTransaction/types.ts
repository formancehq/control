import { ObjectOf } from '@numaryhq/storybook';

import { Transaction } from '~/src/types/ledger';

export type CreateTransactionProps = Pick<
  Transaction,
  'txid' | 'reference' | 'metadata' | 'timestamp' | 'postings'
> & {
  postCommitTransactions: ObjectOf<any>;
  preCommitVolumes: ObjectOf<any>;
  ledger: string;
};
