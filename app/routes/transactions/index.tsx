import * as React from 'react';

import type { MetaFunction, Session } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useTranslation } from 'react-i18next';

import { Page } from '@numaryhq/storybook';

import { LedgerList } from '~/routes/ledgers/list';
import { transactions as transactionsConfig } from '~/src/components/Navbar/routes';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import TransactionList from '~/src/components/Wrappers/Lists/TransactionList';
import { Filters } from '~/src/components/Wrappers/Table/Filters/filters';
import FiltersBar from '~/src/components/Wrappers/Table/Filters/FiltersBar';
import Text from '~/src/components/Wrappers/Table/Filters/Text';
import { TableFiltersContext } from '~/src/contexts/tableFilters';
import { Cursor } from '~/src/types/generic';
import { Transaction } from '~/src/types/ledger';
import { SearchPolicies, SearchTargets } from '~/src/types/search';
import { API_SEARCH } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';
import { sanitizeQuery } from '~/src/utils/search';

export const meta: MetaFunction = () => ({
  title: 'Transactions',
  description: 'Show a list',
});

export const loader: LoaderFunction = async ({ request }) => {
  async function handleData(session: Session) {
    const query = sanitizeQuery(request);
    const transactions = await (
      await createApiClient(session)
    ).postResource<Cursor<Transaction>>(
      API_SEARCH,
      {
        ...query,
        target: SearchTargets.TRANSACTION,
        policy: query.policy || SearchPolicies.AND,
        sort: query.sort || [
          {
            key: 'timestamp',
            order: 'desc',
          },
        ],
      },
      'cursor'
    );
    if (transactions) {
      return transactions;
    }

    return null;
  }

  return handleResponse(await withSession(request, handleData));
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
      <TableFiltersContext.Provider
        value={{
          filters: [
            { field: 'ledgers', name: Filters.LEDGERS },
            {
              field: 'source',
              name: Filters.TERMS,
            },
            { field: 'destination', name: Filters.TERMS },
          ],
        }}
      >
        <Form method="get">
          <FiltersBar>
            <>
              <LedgerList />
              {/* TODO uncomment when Search API is ready to filter on amount*/}
              {/* https://linear.app/formance/issue/NUM-778/search-minor-improvements-searchable-field-empty-data*/}
              {/*<Text*/}
              {/*  placeholder={t('pages.payments.filters.value')}*/}
              {/*  name="amount"*/}
              {/*/>*/}
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
      </TableFiltersContext.Provider>
    </Page>
  );
}
