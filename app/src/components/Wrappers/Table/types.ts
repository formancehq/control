import { TableProps as SbTableProps } from '@numaryhq/storybook';

export type TableProps = Omit<
  SbTableProps,
  'onNext' | 'onPrevious' | 'labels'
> & {
  action?: boolean;
};
