import { useContext } from 'react';

import { TableContext } from '../contexts/table';

export function useTable(): TableContext {
  return useContext(TableContext);
}
