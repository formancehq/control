import * as React from 'react';

import type { MetaFunction } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';

import { Page } from '@numaryhq/storybook';

import { LedgerList } from '~/routes/ledgers/list';
import { reports as reportsConfig } from '~/src/components/Navbar/routes';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import ReportList from '~/src/components/Wrappers/Lists/ReportList';
import { Filters } from '~/src/components/Wrappers/Table/Filters/filters';
import FiltersBar from '~/src/components/Wrappers/Table/Filters/FiltersBar';
import { TableFiltersContext } from '~/src/contexts/tableFilters';
import { Report } from '~/src/types/report';
import { API_REPORT, ApiClient } from '~/src/utils/api';

export const meta: MetaFunction = () => ({
  title: 'Reports',
  description: 'Show a list',
});

export const loader: LoaderFunction = async ({
  request,
}): Promise<Report[] | null> => {
  const url = new URL(request.url);
  const reports = await new ApiClient('http://localhost:3200').getResource<
    Report[]
  >(`${API_REPORT}/${url.search}`, 'data');
  if (reports) {
    return reports;
  }

  return null;
};

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ComponentErrorBoundary
      id={reportsConfig.id}
      title="pages.reports.title"
      error={error}
    />
  );
}

export default function Index() {
  const reports = useLoaderData<Report[]>();

  return (
    <Page id={reportsConfig.id}>
      <TableFiltersContext.Provider
        value={{
          filters: [{ field: 'ledgers', name: Filters.LEDGERS }],
        }}
      >
        <Form method="get">
          <FiltersBar>
            <LedgerList />
          </FiltersBar>
          <ReportList reports={reports as unknown as Report[]} />
        </Form>
      </TableFiltersContext.Provider>
    </Page>
  );
}
