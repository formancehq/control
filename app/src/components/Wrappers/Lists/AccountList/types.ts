import { Account } from '~/src/types/ledger';
import { Cursor } from '~/src/types/generic';

export type AccountListProps = {
  accounts: Cursor<Account>;
};
