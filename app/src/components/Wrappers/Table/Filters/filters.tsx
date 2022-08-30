import { AutocompleteOption } from '@numaryhq/storybook';
import SelectCheckbox from '~/src/components/Wrappers/Table/Filters/SelectCheckbox';
import * as React from 'react';

export enum Filters {
  TERMS = 'terms',
  LEDGERS = 'ledgers',
}

export const buildOptions = (
  arr: string[],
  key: string
): AutocompleteOption[] =>
  arr.map((item) => ({
    id: `${key}=${item}`,
    label: item,
  }));

export const renderOption = (
  props: any,
  option: AutocompleteOption,
  name?: Filters.TERMS | Filters.LEDGERS
) => (
  <li {...props}>
    <SelectCheckbox
      value={option.id}
      name={name || Filters.TERMS}
      label={option.label}
    />
  </li>
);
