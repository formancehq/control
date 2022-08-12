import { LedgerResources, Metadata } from '~/src/types/ledger';

export type MetadataProps = {
  metadata: Metadata;
  title: string;
  resource: LedgerResources.ACCOUNTS | LedgerResources.TRANSACTIONS;
  id: string;
};
