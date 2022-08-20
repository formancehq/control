import * as React from 'react';
import { useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import { LoaderFunction } from '@remix-run/server-runtime';
import { API_LEDGER, ApiClient } from '~/src/utils/api';
import { LedgerInfo } from '~/src/types/ledger';
import { useFetcher } from '@remix-run/react';
import { MenuItem } from '@mui/material';
import { Filters } from '~/src/components/Wrappers/Search/Filters/filters';
import SelectCheckbox from '~/src/components/Wrappers/Search/Filters/SelectCheckbox/SelectCheckbox';
import SelectButton from '~/src/components/Wrappers/Search/Filters/SelectButton';
import { useTranslation } from 'react-i18next';
import { SelectCheckboxItem } from '~/src/components/Wrappers/Search/Filters/SelectCheckbox/types';

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
    <SelectButton label={t('common.filters.ledgers')}>
      <>
        {fetcher.data &&
          fetcher.data.map(({ id, label }) => (
            <MenuItem key={id} value={label}>
              <SelectCheckbox value={label} name={Filters.LEDGERS} />
            </MenuItem>
          ))}
      </>
    </SelectButton>
  );
}
