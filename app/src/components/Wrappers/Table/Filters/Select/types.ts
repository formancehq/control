import { Filters } from '~/src/components/Wrappers/Table/Filters/filters';

export type SelectProps = {
  id: string;
  options: string[] | [];
  field?: string;
  placeholder: string;
  width?: number;
  name: string;
  type?: Filters;
  onChange?: () => void;
  formatLabel?: (item: string) => string;
};
