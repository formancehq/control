import * as React from 'react';

import { ArrowRight } from '@mui/icons-material';
import { Box } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { LoadingButton, Page, Row } from '@numaryhq/storybook';

import {
  getRoute,
  LEDGER_ROUTE,
  ledgers as ledgersConfig,
} from '~/src/components/Navbar/routes';
import Table from '~/src/components/Wrappers/Table';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';

export const meta: MetaFunction = () => ({
  title: 'Ledgers',
  description: 'List',
});

export const loader: LoaderFunction = async ({ request }) => {
  async function handleData(session: Session) {
    const api = await createApiClient(session);
    const ledgers = await api.getResource<string[]>(
      '/ledger/_info',
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
  const navigate = useNavigate();

  const renderRowActions = (name: string) => (
    <Box component="span" key={name}>
      <LoadingButton
        id={`show-${name}`}
        onClick={() => navigate(getRoute(LEDGER_ROUTE, name))}
        endIcon={<ArrowRight />}
      />
    </Box>
  );

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
            renderActions={() => renderRowActions(ledger.name)}
          />
        )}
      />
    </Page>
  );
}
