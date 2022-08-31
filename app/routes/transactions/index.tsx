import * as React from 'react';
import type { MetaFunction } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { Page } from '@numaryhq/storybook';
import { SearchPolicies, SearchTargets } from '~/src/types/search';
import { LoaderFunction } from '@remix-run/server-runtime';
import { API_SEARCH, ApiClient } from '~/src/utils/api';
import { Transaction } from '~/src/types/ledger';
import { buildQuery } from '~/src/utils/search';
import { transactions as transactionsConfig } from '~/src/components/Navbar/routes';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import { Cursor } from '~/src/types/generic';
import { LedgerList } from '~/routes/ledgers/list';
import TransactionList from '~/src/components/Wrappers/Lists/TransactionList';
import FiltersBar from '~/src/components/Wrappers/Table/Filters/FiltersBar';
import Text from '~/src/components/Wrappers/Table/Filters/Text';
import { useTranslation } from 'react-i18next';

export const meta: MetaFunction = () => ({
  title: 'Transactions',
  description: 'Show a list',
});

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const transactions = await new ApiClient().postResource<Cursor<Transaction>>(
    API_SEARCH,
    {
      ...buildQuery(url.searchParams),
      target: SearchTargets.TRANSACTION,
      policy: SearchPolicies.OR,
    },
    'cursor'
  );
  if (transactions) {
    return transactions;
  }

  return null;
};

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ComponentErrorBoundary
      id={transactionsConfig.id}
      title="pages.transactions.title"
      error={error}
    />
  );
}

export default function Index() {
  const transactions = useLoaderData<Cursor<Transaction>>();
  const { t } = useTranslation();

  return (
    <Page id={transactionsConfig.id}>
      <Form method="get">
        <FiltersBar>
          <>
            <LedgerList />
            <Text
              placeholder={t('pages.payments.filters.value')}
              name="amount"
            />
            <Text
              placeholder={t('pages.payments.filters.source')}
              name="source"
            />
            <Text
              placeholder={t('pages.payments.filters.destination')}
              name="destination"
            />
          </>
        </FiltersBar>
        <TransactionList
          transactions={transactions as unknown as Cursor<Transaction>}
          withPagination
        />
      </Form>
    </Page>
  );
}
