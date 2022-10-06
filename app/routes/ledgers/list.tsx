import * as React from 'react';
import { FunctionComponent, useEffect } from 'react';

import type {MetaFunction, Session} from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useTranslation } from 'react-i18next';

import { Filters } from '~/src/components/Wrappers/Table/Filters/filters';
import Select from '~/src/components/Wrappers/Table/Filters/Select';
import { LedgerInfo } from '~/src/types/ledger';
import { API_LEDGER } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';

export const meta: MetaFunction = () => ({
  title: 'Ledgers',
  description: 'Get a list',
});

export const loader: LoaderFunction = async ({ request }) => {
  async function handleData(session: Session) {
    const ledgers = await (
      await createApiClient(session)
    ).getResource<LedgerInfo>(`${API_LEDGER}/_info`, 'data');
    if (ledgers) {
      return ledgers?.config.storage.ledgers;
    }

    return null;
  }

  return handleResponse(await withSession(request, handleData));
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
