import { createContext } from 'react';

import { Filters } from '~/src/components/Wrappers/Table/Filters/filters';

export type TableFiltersContext = {
  filters: {
    field: string;
    name: Filters.TERMS | Filters.LEDGERS;
    formatLabel?: (item: string) => string;
  }[];
};
export const TableFiltersContext = createContext({} as TableFiltersContext);
