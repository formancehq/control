import { Transaction } from '~/src/types/ledger';
import { Cursor } from '~/src/types/generic';

export type TransactionListProps = {
  transactions: Cursor<Transaction>;
  withPagination: boolean;
  paginationSize?: number;
};
