import * as React from 'react';

import type { MetaFunction, Session } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';

import { Page } from '@numaryhq/storybook';

import { LedgerList } from '~/routes/ledgers/list';
import { accounts as accountsConfig } from '~/src/components/Layout/routes';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import AccountList from '~/src/components/Wrappers/Lists/AccountList/AccountList';
import { Filters } from '~/src/components/Wrappers/Table/Filters/filters';
import FiltersBar from '~/src/components/Wrappers/Table/Filters/FiltersBar';
import { FEATURES } from '~/src/contexts/service';
import { TableContext } from '~/src/contexts/table';
import { useFeatureFlag } from '~/src/hooks/useFeatureFlag';
import { Cursor } from '~/src/types/generic';
import { Account } from '~/src/types/ledger';
import { SearchBody, SearchPolicies, SearchTargets } from '~/src/types/search';
import { API_SEARCH } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';
import { sanitizeQuery } from '~/src/utils/search';

export const meta: MetaFunction = () => ({
  title: 'Accounts',
  description: 'Show a list',
});

export const loader: LoaderFunction = async ({ request }) => {
  async function handleData(session: Session) {
    const accounts = await (
      await createApiClient(session)
    ).postResource<Cursor<Account>>(
      API_SEARCH,
      {
        ...(sanitizeQuery(request) as SearchBody),
        target: SearchTargets.ACCOUNT,
        policy: SearchPolicies.AND,
        pageSize: 15,
      },
      'cursor'
    );

    if (accounts) {
      return accounts;
    }

    return null;
  }

  return handleResponse(await withSession(request, handleData));
};

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ComponentErrorBoundary
      id={accountsConfig.id}
      title="pages.accounts.title"
      error={error}
    />
  );
}

export default function Index() {
  const accounts = useLoaderData<Cursor<Account>>();
  useFeatureFlag(FEATURES.ACCOUNTS);

  return (
    <Page id={accountsConfig.id}>
      <TableContext.Provider
        value={{
          filters: [{ field: 'ledgers', name: Filters.LEDGERS }],
        }}
      >
        <Form method="get">
          <FiltersBar>
            <LedgerList />
          </FiltersBar>
          <AccountList accounts={accounts as Cursor<Account>} />
        </Form>
      </TableContext.Provider>
    </Page>
  );
}
