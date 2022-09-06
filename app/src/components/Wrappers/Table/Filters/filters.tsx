import { AutocompleteOption } from '@numaryhq/storybook';
import * as React from 'react';
import Checkbox from './Checkbox';

export enum Filters {
  TERMS = 'terms',
  LEDGERS = 'ledgers',
}

// TODO improve
export const getFieldValue = (field: string): string => {
  const isTerms = field.split('=').length > 1;
  const formatted = field.replace(/=/g, ': ');

  return isTerms ? formatted : `ledger: ${field}`;
};

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
  <Checkbox
    key={option.id}
    value={option.id}
    name={name || Filters.TERMS}
    label={option.label}
  />
);
