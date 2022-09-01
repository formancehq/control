import { AutocompleteOption } from '@numaryhq/storybook';
import * as React from 'react';
import Checkbox from './Checkbox';

export enum Filters {
  TERMS = 'terms',
  LEDGERS = 'ledgers',
}

export const getFieldValue = (field: string): string => field.split('=')[1];

export const buildOptions = (
  arr: string[],
  field?: string
): AutocompleteOption[] =>
  arr.map((item) => ({
    id: `${field ? `${field}=` : ''}${item}`,
    label: item,
  }));

export const renderOption = (
  props: any,
  option: AutocompleteOption,
  name?: Filters.TERMS | Filters.LEDGERS
) => (
  <li {...props}>
    <Checkbox
      value={option.id}
      name={name || Filters.TERMS}
      label={option.label}
    />
  </li>
);
