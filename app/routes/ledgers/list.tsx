import * as React from 'react';
import { useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import { LoaderFunction } from '@remix-run/server-runtime';
import { API_LEDGER, ApiClient } from '~/src/utils/api';
import { LedgerInfo } from '~/src/types/ledger';
import { useFetcher } from '@remix-run/react';
import {
  Filters,
  renderOption,
} from '~/src/components/Wrappers/Table/Filters/filters';
import { useTranslation } from 'react-i18next';
import { SelectCheckboxItem } from '~/src/components/Wrappers/Table/Filters/SelectCheckbox/types';
import { AutocompleteOption, AutocompleteSelect } from '@numaryhq/storybook';

export const meta: MetaFunction = () => ({
  title: 'Ledgers',
  description: 'Get a list',
});

export const loader: LoaderFunction = async (): Promise<
  SelectCheckboxItem[] | null
> => {
  const ledgers = await new ApiClient().getResource<LedgerInfo>(
    `${API_LEDGER}/_info`,
    'data'
  );
  if (ledgers) {
    return ledgers?.config.storage.ledgers.map((ledger: string) => ({
      id: ledger,
      label: ledger,
    }));
  }

  return null;
};

export function LedgerList() {
  const fetcher = useFetcher<SelectCheckboxItem[] | null>();
  const { t } = useTranslation();

  useEffect(() => {
    fetcher.load('/ledgers/list');
  }, []);

  return (
    <AutocompleteSelect
      noOptionsText={t('common.noResults')}
      placeholder={t('common.filters.ledgers')}
      name="ledgers-autocomplete"
      multiple
      id="ledgers-autocomplete"
      options={fetcher.data ? (fetcher.data as readonly any[]) : []}
      disableCloseOnSelect
      getOptionLabel={(option: AutocompleteOption) => option.label}
      renderOption={(props: any, option: AutocompleteOption) =>
        renderOption(props, option, Filters.LEDGERS)
      }
      style={{ width: 350 }}
    />
  );
}
