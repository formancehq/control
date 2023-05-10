import * as React from 'react';
import { FunctionComponent, useEffect } from 'react';

import type { MetaFunction, Session } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useTranslation } from 'react-i18next';

import { Filters } from '~/src/components/Wrappers/Table/Filters/filters';
import Select from '~/src/components/Wrappers/Table/Filters/Select';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';
import { getStacks } from '~/src/utils/membership';

export const meta: MetaFunction = () => ({
  title: 'Stacks',
  description: 'Get a list',
});

export const loader: LoaderFunction = async ({ request }) => {
  async function handleData(session: Session) {
    const api = await createApiClient(
      session,
      `${process.env.MEMBERSHIP_URL}/api`,
      true
    );

    return await getStacks(api);
  }

  return handleResponse(await withSession(request, handleData));
};

export const StackList: FunctionComponent = () => {
  const fetcher = useFetcher<string[] | null>();
  const { t } = useTranslation();

  useEffect(() => {
    fetcher.load('/stacks/list');
  }, []);

  return (
    <Select
      id="stacks-autocomplete"
      options={fetcher.data ? fetcher.data : []}
      name="stacks-autocomplete"
      placeholder={t('common.filters.stacks')}
      type={Filters.STACKS}
      width={350}
    />
  );
};
