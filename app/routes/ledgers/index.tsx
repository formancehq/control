import * as React from 'react';

import type { MetaFunction } from '@remix-run/node';
import { Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useTranslation } from 'react-i18next';

import { Page, Row } from '@numaryhq/storybook';

import {
  LEDGER_ROUTE,
  ledgers as ledgersConfig,
} from '~/src/components/Layout/routes';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import ShowListAction from '~/src/components/Wrappers/Lists/Actions/ShowListAction';
import Table from '~/src/components/Wrappers/Table';
import { FEATURES } from '~/src/contexts/service';
import { useFeatureFlag } from '~/src/hooks/useFeatureFlag';
import { API_LEDGER } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';

export const meta: MetaFunction = () => ({
  title: 'Ledgers',
  description: 'List',
});

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ComponentErrorBoundary
      id="ledgers"
      title="pages.ledgers.title"
      error={error}
      showAction={false}
    />
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  async function handleData(session: Session) {
    const api = await createApiClient(session);
    const ledgers = await api.getResource<string[]>(
      `${API_LEDGER}/_info`,
      'data.config.storage.ledgers'
    );
    if (ledgers) {
      return ledgers.map((ledger: string) => ({ name: ledger }));
    }

    return null;
  }

  return handleResponse(await withSession(request, handleData));
};

export default function Index() {
  const { t } = useTranslation();
  const ledgers = useLoaderData<string[]>();
  useFeatureFlag(FEATURES.LEDGERS);

  return (
    <Page id={ledgersConfig.id}>
      <Table
        id="ledger-list"
        items={ledgers}
        action={true}
        withPagination={false}
        columns={[
          {
            key: 'name',
            label: t('pages.ledgers.table.columnLabel.name'),
          },
        ]}
        renderItem={(ledger: { name: string }, index: number) => (
          <Row
            key={index}
            keys={['name']}
            item={ledger}
            renderActions={() => (
              <ShowListAction id={ledger.name} route={LEDGER_ROUTE} />
            )}
          />
        )}
      />
    </Page>
  );
}
