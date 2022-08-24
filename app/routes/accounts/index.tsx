import * as React from 'react';
import type { MetaFunction } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { Page } from '@numaryhq/storybook';
import { SearchPolicies, SearchTargets } from '~/src/types/search';
import AccountList from '~/src/components/Wrappers/Lists/AccountList/AccountList';
import { LoaderFunction } from '@remix-run/server-runtime';
import { API_SEARCH, ApiClient } from '~/src/utils/api';
import { Account } from '~/src/types/ledger';
import { buildQuery } from '~/src/utils/search';
import { accounts as accountsConfig } from '~/src/components/Navbar/routes';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import { Cursor } from '~/src/types/generic';
import { useTranslation } from 'react-i18next';
import { LedgerList } from '~/routes/ledgers/list';
import FiltersBar from '~/src/components/Wrappers/Table/Filters/FiltersBar';

export const meta: MetaFunction = () => ({
  title: 'Accounts',
  description: 'Show a list',
});

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const accounts = await new ApiClient().postResource<Cursor<Account>>(
    API_SEARCH,
    {
      ...buildQuery(url.searchParams),
      target: SearchTargets.ACCOUNT,
      policy: SearchPolicies.OR,
    },
    'cursor'
  );
  if (accounts) {
    return accounts;
  }

  return null;
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
  const { t } = useTranslation();

  return (
    <Page id={accountsConfig.id} title={t('pages.accounts.title')}>
      <Form method="get">
        {/* TODO remove width when having multiple filter*/}
        <FiltersBar>
          <LedgerList />
        </FiltersBar>
        <AccountList accounts={accounts as Cursor<Account>} />
      </Form>
    </Page>
  );
}
