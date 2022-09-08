import { ObjectOf } from '~/src/types/generic';
import { LedgerResources } from '~/src/types/ledger';

export type MetadataProps = {
  metadata: ObjectOf<any>;
  title: string;
  resource: LedgerResources.ACCOUNTS | LedgerResources.TRANSACTIONS;
  id: string;
  sync: () => void;
};
