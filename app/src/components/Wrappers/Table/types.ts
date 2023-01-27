import {
  Column as SbColumn,
  TableProps as SbTableProps,
} from '@numaryhq/storybook';

type Column = Omit<SbColumn, 'sort'> & { sort?: boolean };
export type TableProps = Omit<
  SbTableProps,
  'onNext' | 'onPrevious' | 'labels' | 'columns'
> & {
  columns: Column[];
  action?: boolean;
};
