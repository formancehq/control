import * as React from 'react';

import Checkbox from './Checkbox';

import { AutocompleteOption } from '@numaryhq/storybook';

export enum Filters {
  TERMS = 'terms',
  LEDGERS = 'ledgers',
  STACKS = 'stacks',
}

// TODO improve
export const getFieldValue = (
  field: string,
  formatLabel?: (item: string) => string
): string => {
  const splitValue = field.split('=');
  const isTerms = splitValue.length > 1;
  const label = `${splitValue[0]}=${
    formatLabel ? formatLabel(splitValue[1]) : splitValue[1]
  }`;
  const formatted = label.replace(/=/g, ': ');

  return isTerms ? formatted : `ledger: ${field}`;
};

export const buildOptions = (
  arr: string[],
  field?: string,
  formatLabel?: (item: string) => string
): AutocompleteOption[] =>
  arr.map((item) => ({
    id: `${field ? `${field}=` : ''}${item}`,
    label: formatLabel ? formatLabel(item) : item,
  }));

export const renderOption = (
  props: any,
  option: AutocompleteOption,
  name?: Filters.TERMS | Filters.LEDGERS,
  onChange?: () => void
) => (
  <Checkbox
    key={option.id}
    value={option.id}
    name={name || Filters.TERMS}
    label={option.label}
    onChange={onChange}
  />
);
