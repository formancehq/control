import { Cursor } from '~/src/types/generic';
import { Transaction } from '~/src/types/ledger';

export type TransactionListProps = {
  transactions: Cursor<Transaction>;
  withPagination: boolean;
  paginationSize?: number;
  showMore?: boolean;
};
