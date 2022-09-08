import * as React from 'react';
import { FunctionComponent, useEffect } from 'react';

import type { MetaFunction } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useTranslation } from 'react-i18next';

import { Filters } from '~/src/components/Wrappers/Table/Filters/filters';
import Select from '~/src/components/Wrappers/Table/Filters/Select';
import { LedgerInfo } from '~/src/types/ledger';
import { API_LEDGER, ApiClient } from '~/src/utils/api';

export const meta: MetaFunction = () => ({
  title: 'Ledgers',
  description: 'Get a list',
});

export const loader: LoaderFunction = async (): Promise<string[] | null> => {
  const ledgers = await new ApiClient().getResource<LedgerInfo>(
    `${API_LEDGER}/_info`,
    'data'
  );
  if (ledgers) {
    return ledgers?.config.storage.ledgers;
  }

  return null;
};

export const LedgerList: FunctionComponent<{ variant?: 'light' | 'dark' }> = ({
  variant = 'light',
}) => {
  const fetcher = useFetcher<string[] | null>();
  const { t } = useTranslation();

  useEffect(() => {
    fetcher.load('/ledgers/list');
  }, []);

  return (
    <Select
      id="ledgers-autocomplete"
      options={fetcher.data ? fetcher.data : []}
      name="ledgers-autocomplete"
      placeholder={t('common.filters.ledgers')}
      type={Filters.LEDGERS}
      width={350}
      variant={variant}
    />
  );
};
