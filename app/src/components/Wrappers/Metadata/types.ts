import { LedgerResources } from '~/src/types/ledger';
import { ObjectOf } from '~/src/types/generic';

export type MetadataProps = {
  metadata: ObjectOf<any>;
  title: string;
  resource: LedgerResources.ACCOUNTS | LedgerResources.TRANSACTIONS;
  id: string;
  sync: () => void;
};
