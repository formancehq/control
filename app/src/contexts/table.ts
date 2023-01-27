import { createContext } from 'react';

import { Filters } from '~/src/components/Wrappers/Table/Filters/filters';

export type TableContext = {
  id?: string;
  filters?: {
    field: string;
    name: Filters.TERMS | Filters.LEDGERS;
    formatLabel?: (item: string) => string;
  }[];
};
export const TableContext = createContext({} as TableContext);
