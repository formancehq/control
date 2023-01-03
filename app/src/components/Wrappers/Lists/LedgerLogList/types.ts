import { Cursor } from '~/src/types/generic';
import { LedgerLog } from '~/src/types/ledger';

export type LedgerLogListProps = {
  logs: Cursor<LedgerLog<any>>;
  withPagination?: boolean;
};
