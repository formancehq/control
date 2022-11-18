import { useContext } from 'react';

import { TableFiltersContext } from '../contexts/tableFilters';

export function useTableFilters(): TableFiltersContext {
  return useContext(TableFiltersContext);
}
